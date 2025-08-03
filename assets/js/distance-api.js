// Система получения реальных расстояний через API
// Поддерживает несколько источников с fallback

class DistanceAPI {
  constructor() {
    // Приоритет источников данных
    this.providers = [
      'avtodispetcher', // Российский API - бесплатный
      'osrm',          // Open Source Routing Machine - бесплатный  
      'yandex',        // Yandex Maps API - условно бесплатный
      'static'         // Статическая таблица - fallback
    ];
    
    // Кэш для избежания повторных запросов
    this.cache = new Map();
    this.cacheKey = (from, to) => `${from}-${to}`;
  }

  // Главная функция получения расстояния
  async getDistance(fromCity, toCity) {
    const cacheKey = this.cacheKey(fromCity, toCity);
    
    // Проверяем кэш
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let distance = null;
    
    // Пробуем разные источники
    for (const provider of this.providers) {
      try {
        distance = await this.getFromProvider(provider, fromCity, toCity);
        if (distance) {
          break;
        }
      } catch (error) {
        console.warn(`Provider ${provider} failed:`, error);
        continue;
      }
    }
    
    // Кэшируем результат
    if (distance) {
      this.cache.set(cacheKey, distance);
    }
    
    return distance || 0;
  }

  // Получение от конкретного провайдера
  async getFromProvider(provider, fromCity, toCity) {
    switch (provider) {
      case 'avtodispetcher':
        return await this.getFromAvtoDispetcher(fromCity, toCity);
      case 'osrm':
        return await this.getFromOSRM(fromCity, toCity);
      case 'yandex':
        return await this.getFromYandex(fromCity, toCity);
      case 'static':
        return this.getFromStatic(fromCity, toCity);
      default:
        return null;
    }
  }

  // АвтоДиспетчер API (российский, для грузовиков)
  async getFromAvtoDispetcher(fromCity, toCity) {
    const coords = this.getCityCoords(fromCity, toCity);
    if (!coords) return null;

    const url = `https://avtodispetcher.ru/distance/api.php?` +
      `from_lat=${coords.from.lat}&from_lng=${coords.from.lng}&` +
      `to_lat=${coords.to.lat}&to_lng=${coords.to.lng}&` +
      `vehicle=truck&avoid_tolls=false`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK' && data.distance) {
        return Math.round(data.distance / 1000); // метры в километры
      }
    } catch (error) {
      console.warn('AvtoDispetcher API error:', error);
    }
    
    return null;
  }

  // Open Source Routing Machine (бесплатный)
  async getFromOSRM(fromCity, toCity) {
    const coords = this.getCityCoords(fromCity, toCity);
    if (!coords) return null;

    const url = `https://router.project-osrm.org/route/v1/driving/` +
      `${coords.from.lng},${coords.from.lat};${coords.to.lng},${coords.to.lat}` +
      `?overview=false&alternatives=false&steps=false`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        return Math.round(data.routes[0].distance / 1000);
      }
    } catch (error) {
      console.warn('OSRM API error:', error);
    }
    
    return null;
  }

  // Yandex Maps API (требует ключ)
  async getFromYandex(fromCity, toCity) {
    // Здесь нужен API ключ Yandex
    const API_KEY = 'YOUR_YANDEX_API_KEY'; // Заменить на реальный
    if (!API_KEY || API_KEY === 'YOUR_YANDEX_API_KEY') {
      return null;
    }

    const coords = this.getCityCoords(fromCity, toCity);
    if (!coords) return null;

    const url = `https://api.routing.yandex.net/v2/route?` +
      `waypoints=${coords.from.lng},${coords.from.lat}|${coords.to.lng},${coords.to.lat}&` +
      `mode=truck&apikey=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.route && data.route[0] && data.route[0].distance) {
        return Math.round(data.route[0].distance.value / 1000);
      }
    } catch (error) {
      console.warn('Yandex API error:', error);
    }
    
    return null;
  }

  // Статическая таблица (fallback)
  getFromStatic(fromCity, toCity) {
    if (typeof getRealDistance === 'function') {
      return getRealDistance(fromCity, toCity);
    }
    return null;
  }

  // Получение координат городов
  getCityCoords(fromCity, toCity) {
    const CITY_COORDS = {
      "moskva": { lat: 55.7558, lng: 37.6176 },
      "spb": { lat: 59.9311, lng: 30.3609 },
      "kazan": { lat: 55.8304, lng: 49.0661 },
      "voronezh": { lat: 51.6754, lng: 39.2088 },
      "samara": { lat: 53.2001, lng: 50.1500 },
      "nizhniy-novgorod": { lat: 56.3287, lng: 44.0020 },
      "ekaterinburg": { lat: 56.8431, lng: 60.6454 },
      "rostov": { lat: 47.2357, lng: 39.7015 },
      "chelyabinsk": { lat: 55.1644, lng: 61.4368 },
      "ufa": { lat: 54.7388, lng: 55.9721 },
      "ryazan": { lat: 54.6269, lng: 39.6916 },
      "tula": { lat: 54.1961, lng: 37.6182 },
      "yaroslavl": { lat: 57.6261, lng: 39.8845 },
      "vladimir": { lat: 56.1366, lng: 40.3966 },
      "kaluga": { lat: 54.5293, lng: 36.2754 },
      "smolensk": { lat: 54.7818, lng: 32.0401 },
      "bryansk": { lat: 53.2434, lng: 34.3641 },
      "orel": { lat: 52.9691, lng: 36.0699 },
      "kursk": { lat: 51.7373, lng: 36.1873 },
      "belgorod": { lat: 50.5952, lng: 36.5804 },
      "lipetsk": { lat: 52.6031, lng: 39.5708 },
      "tambov": { lat: 52.7213, lng: 41.4633 },
      "penza": { lat: 53.2001, lng: 45.0000 },
      "saransk": { lat: 54.1838, lng: 45.1749 },
      "cheboksary": { lat: 56.1439, lng: 47.2489 },
      "kirov": { lat: 58.6035, lng: 49.6679 },
      "izhevsk": { lat: 56.8431, lng: 53.2045 },
      "perm": { lat: 58.0105, lng: 56.2502 },
      "orenburg": { lat: 51.7727, lng: 55.0988 },
      "saratov": { lat: 51.5924, lng: 46.0348 },
      "volgograd": { lat: 48.7080, lng: 44.5133 },
      "astrakhan": { lat: 46.3497, lng: 48.0408 },
      "krasnodar": { lat: 45.0328, lng: 38.9769 },
      "sochi": { lat: 43.6028, lng: 39.7342 },
      "stavropol": { lat: 45.0428, lng: 41.9734 }
    };

    const from = CITY_COORDS[fromCity];
    const to = CITY_COORDS[toCity];
    
    if (!from || !to) {
      console.warn(`Coordinates not found for ${fromCity} or ${toCity}`);
      return null;
    }
    
    return { from, to };
  }

  // Batch запрос для нескольких маршрутов
  async getDistancesBatch(routes) {
    const promises = routes.map(route => 
      this.getDistance(route.from, route.to).then(distance => ({
        ...route,
        distance
      }))
    );
    
    return await Promise.all(promises);
  }

  // Очистка кэша
  clearCache() {
    this.cache.clear();
  }

  // Получение статистики кэша
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Глобальный экземпляр
const distanceAPI = new DistanceAPI();

// Удобная функция для прямого использования
async function getRouteDistance(fromCity, toCity) {
  return await distanceAPI.getDistance(fromCity, toCity);
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DistanceAPI, distanceAPI, getRouteDistance };
}

// Для браузера
if (typeof window !== 'undefined') {
  window.DistanceAPI = DistanceAPI;
  window.distanceAPI = distanceAPI;
  window.getRouteDistance = getRouteDistance;
}