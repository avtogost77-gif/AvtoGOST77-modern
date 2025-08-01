// 🚛 Типы для логистической системы NextGen
// Основано на реальной бизнес-логике АвтоГОСТ

export interface TransportType {
  readonly id: string;
  readonly name: string;
  readonly maxWeight: number; // кг
  readonly maxVolume: number; // м³
  readonly density: number; // кг/м³
  readonly minPrice: {
    readonly moscow: number;
    readonly regions: number;
  };
  readonly coefficient: number; // от цены фуры
  readonly icon: string;
}

export interface CityData {
  readonly name: string;
  readonly region: string;
  readonly coordinates: readonly [number, number];
  readonly isMarketplaceHub: boolean;
  readonly deliveryZone: 'moscow' | 'spb' | 'federal';
  readonly timezone: string;
}

export interface RouteData {
  readonly from: CityData;
  readonly to: CityData;
  readonly distance: number; // км
  readonly estimatedTime: number; // часы
  readonly popularity: 'low' | 'medium' | 'high';
}

export type CargoType = 
  | 'general' 
  | 'fragile' 
  | 'valuable' 
  | 'dangerous' 
  | 'perishable' 
  | 'oversized';

export type UrgencyLevel = 
  | 'standard' 
  | 'urgent' 
  | 'emergency';

export type DeliveryMode = 
  | 'consolidated' // сборный
  | 'dedicated';   // отдельная машина

export interface CalculatorFormData {
  fromCity: string;
  toCity: string;
  weight: number;
  volume?: number | undefined;
  cargoType: CargoType;
  urgency: UrgencyLevel;
  deliveryMode?: DeliveryMode;
}

export interface PriceFactors {
  readonly basePrice: number;
  readonly loadFactor: number;    // коэффициент загрузки
  readonly routeFactor: number;   // популярность маршрута
  readonly cargoFactor: number;   // тип груза
  readonly urgencyFactor: number; // срочность
  readonly seasonFactor: number;  // сезонность
  readonly demandFactor: number;  // спрос в реальном времени
}

export interface CalculationResult {
  readonly success: boolean;
  readonly price: number;
  readonly pricePerKm: number;
  readonly transport: TransportType;
  readonly route: RouteData;
  readonly deliveryTime: string;
  readonly factors: PriceFactors;
  readonly details: {
    readonly weight: number;
    readonly volume?: number | undefined;
    readonly density?: number | undefined;
    readonly loadPercent: number;
    readonly volumePercent?: number | undefined;
  };
  readonly restrictions?: string[];
  readonly recommendations?: string[];
}

export interface CalculationError {
  readonly success: false;
  readonly error: string;
  readonly code: 'SAME_REGION' | 'OVERWEIGHT' | 'INVALID_ROUTE' | 'API_ERROR';
  readonly alternativePrice?: number | undefined;
  readonly suggestions?: string[] | undefined;
}

// Результат может быть успешным или с ошибкой
export type CalculationResponse = CalculationResult | CalculationError;

export interface LeadData {
  readonly name: string;
  readonly phone: string;
  readonly email?: string;
  readonly company?: string;
  readonly message?: string;
  readonly calculationResult?: CalculationResult;
  readonly source: 'calculator' | 'form' | 'exit-intent' | 'chat';
  readonly timestamp: Date;
  readonly promoCode?: string;
  readonly privacyConsent: boolean;
}

export interface TelegramConfig {
  readonly botToken: string;
  readonly chatId: string;
  readonly webhook?: string;
}

export interface AnalyticsEvent {
  readonly event: string;
  readonly category: 'calculator' | 'form' | 'navigation' | 'engagement';
  readonly action: string;
  readonly label?: string;
  readonly value?: number;
  readonly customParameters?: Record<string, string | number>;
}

// Конфигурация промокодов
export interface PromoCode {
  readonly code: string;
  readonly discount: number; // процент скидки
  readonly validUntil?: Date;
  readonly maxUses?: number;
  readonly currentUses: number;
  readonly source: 'exit-intent' | 'timer' | 'manual';
}

// Пользовательский journey
export interface UserJourney {
  sessionId: string;
  landingPage: string;
  calculatorUsed: boolean;
  calculationResult?: CalculationResult;
  exitIntent: boolean;
  promoCodeShown?: PromoCode;
  leadSubmitted: boolean;
  conversionSource?: string;
  events: AnalyticsEvent[];
  timeOnSite: number;
}