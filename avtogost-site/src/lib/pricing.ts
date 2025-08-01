import type { TransportKey, CargoType, PricingResult } from "./types";

export interface CalculateInput {
  fromCity: string;
  toCity: string;
  weight: number; // kg
  volume?: number; // m3
  cargoType?: CargoType;
}

/*
 * Ported from legacy assets/js/smart-calculator-v2.js
 * Only calculation logic without DOM side-effects
 */

export class SmartCalculator {
  private transportTypes = {
    gazelle: {
      name: "Газель",
      maxWeight: 1500,
      maxVolume: 16,
      density: 94,
      minPrice: 10_000,
      minPriceRegion: 7_500,
      coefficient: 0.36,
    },
    threeTon: {
      name: "3-тонник",
      maxWeight: 3000,
      maxVolume: 18,
      density: 167,
      minPrice: 13_000,
      minPriceRegion: 9_750,
      coefficient: 0.46,
    },
    fiveTon: {
      name: "5-тонник",
      maxWeight: 5000,
      maxVolume: 36,
      density: 139,
      minPrice: 20_000,
      minPriceRegion: 15_000,
      coefficient: 0.71,
    },
    tenTon: {
      name: "10-тонник",
      maxWeight: 10_000,
      maxVolume: 50,
      density: 200,
      minPrice: 24_000,
      minPriceRegion: 18_000,
      coefficient: 0.86,
    },
    truck: {
      name: "Фура 20т",
      maxWeight: 20_000,
      maxVolume: 82,
      density: 244,
      minPrice: 28_000,
      minPriceRegion: 21_000,
      coefficient: 1.0,
    },
  } as const;

  private regions: Record<string, string[]> = {
    "Московская область": [
      "Москва",
      "Подольск",
      "Химки",
      "Балашиха",
      "Мытищи",
      "Королёв",
      "Люберцы",
      "Красногорск",
      "Одинцово",
      "Голицыно",
      "Поварово",
      "Воскресенск",
      "Коломна",
      "Серпухов",
      "Щёлково",
      "Домодедово",
    ],
    "Санкт-Петербург и область": [
      "Санкт-Петербург",
      "Гатчина",
      "Выборг",
      "Всеволожск",
      "Колпино",
      "Пушкин",
      "Петергоф",
      "Кронштадт",
    ],
    "Нижегородская область": [
      "Нижний Новгород",
      "Дзержинск",
      "Арзамас",
      "Саров",
      "Бор",
    ],
  };

  calculate({ fromCity, toCity, weight, volume = 0, cargoType = "general" }: CalculateInput): PricingResult {
    if (this.isSameRegion(fromCity, toCity)) {
      return {
        error: true,
        message:
          "ВНИМАНИЕ! Сборные грузы только между регионами. Внутри региона - только отдельная машина!",
        alternativePrice: this.calculateFullTruckPrice(fromCity, toCity),
      } as PricingResult;
    }

    const transport = this.selectOptimalTransport(weight, volume);
    if (!transport) {
      return {
        error: true,
        message: "Груз не помещается даже в фуру! Требуется спецтранспорт.",
      } as PricingResult;
    }

    const distance = this.getDistance(fromCity, toCity);
    const pricePerKm =
      distance < 50
        ? 700
        : distance < 100
        ? 280
        : distance < 200
        ? 200
        : distance < 500
        ? 150
        : 100;

    let basePrice = distance * pricePerKm;

    const isMoscow = fromCity.includes("Москв") || toCity.includes("Москв");
    const minPrice = isMoscow ? transport.minPrice : transport.minPriceRegion;

    if (transport.name !== "Фура 20т") basePrice *= transport.coefficient;

    basePrice = Math.max(basePrice, minPrice);

    if (cargoType === "сборный" || cargoType === "consolidated") {
      basePrice *= 0.65;
    }

    const loadFactor = this.calculateLoadFactor(weight, volume, transport);
    basePrice *= loadFactor;

    basePrice *= this.getRouteFactor(fromCity, toCity);
    basePrice *= this.getCargoFactor(cargoType);

    const finalPrice = Math.round(basePrice / 500) * 500;

    return {
      success: true,
      price: finalPrice,
      transport: transport.name,
      distance,
      pricePerKm: Math.round(finalPrice / distance),
      deliveryTime: this.calculateDeliveryTime(distance),
      details: {
        weight,
        volume,
        density: volume ? Math.round(weight / volume) : 0,
        loadPercent: Math.round((weight / transport.maxWeight) * 100),
        volumePercent: volume ? Math.round((volume / transport.maxVolume) * 100) : 0,
      },
    } as PricingResult;
  }

  private isSameRegion(city1: string, city2: string): boolean {
    return Object.values(this.regions).some((cities) => cities.includes(city1) && cities.includes(city2));
  }

  private selectOptimalTransport(weight: number, volume: number): typeof this.transportTypes[TransportKey] | null {
    const transports = Object.values(this.transportTypes).sort((a, b) => a.maxWeight - b.maxWeight);
    for (const t of transports) {
      if (weight <= t.maxWeight) {
        if (volume) {
          const density = weight / volume;
          if (volume <= t.maxVolume && density <= t.density * 1.2) return t;
        } else {
          return t;
        }
      }
    }
    return null;
  }

  private calculateLoadFactor(weight: number, volume: number, t: typeof this.transportTypes[TransportKey]) {
    const weightUsage = weight / t.maxWeight;
    const usage = volume ? Math.max(weightUsage, volume / t.maxVolume) : weightUsage;

    if (usage < 0.3) return volume ? 1.5 : 1.4;
    if (usage < 0.5) return volume ? 1.3 : 1.2;
    if (usage < 0.7) return volume ? 1.1 : 1.05;
    return 1.0;
  }

  private getRouteFactor(from: string, to: string) {
    const popularRoutes = [
      ["Москва", "Санкт-Петербург"],
      ["Москва", "Нижний Новгород"],
      ["Москва", "Екатеринбург"],
      ["Москва", "Казань"],
    ];
    if (popularRoutes.some((r) => r.includes(from) && r.includes(to))) return 0.9;
    if (to === "Москва" || to === "Санкт-Петербург") return 0.95;
    return 1.0;
  }

  private getCargoFactor(type: CargoType) {
    const f: Record<CargoType, number> = {
      general: 1.0,
      fragile: 1.3,
      valuable: 1.5,
      dangerous: 1.8,
      perishable: 1.4,
      oversized: 1.6,
      "сборный": 0.65,
      consolidated: 0.65,
    } as const;
    return f[type] ?? 1.0;
  }

  private calculateDeliveryTime(dist: number) {
    if (dist < 500) return "1-2 дня";
    if (dist < 1000) return "2-3 дня";
    if (dist < 2000) return "3-4 дня";
    if (dist < 3000) return "4-5 дней";
    return "5-7 дней";
  }

  private calculateFullTruckPrice(from: string, to: string) {
    const distance = this.getDistance(from, to) || 50;
    const base = 20_000;
    const kmPrice = distance < 50 ? 500 : 200;
    return Math.max(base, distance * kmPrice);
  }

  private routes: Record<string, number> = {
    "Москва-Санкт-Петербург": 700,
    "Москва-Нижний Новгород": 400,
    "Москва-Екатеринбург": 1400,
    "Москва-Казань": 800,
    "Москва-Ростов-на-Дону": 1100,
    "Москва-Новосибирск": 3300,
  };

  private getDistance(from: string, to: string) {
    const key = `${from}-${to}`;
    const revKey = `${to}-${from}`;
    return this.routes[key] || this.routes[revKey] || 500;
  }
}