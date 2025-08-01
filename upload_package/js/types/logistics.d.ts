export interface TransportType {
    readonly id: string;
    readonly name: string;
    readonly maxWeight: number;
    readonly maxVolume: number;
    readonly density: number;
    readonly minPrice: {
        readonly moscow: number;
        readonly regions: number;
    };
    readonly coefficient: number;
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
    readonly distance: number;
    readonly estimatedTime: number;
    readonly popularity: 'low' | 'medium' | 'high';
}
export type CargoType = 'general' | 'fragile' | 'valuable' | 'dangerous' | 'perishable' | 'oversized';
export type UrgencyLevel = 'standard' | 'urgent' | 'emergency';
export type DeliveryMode = 'consolidated' | 'dedicated';
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
    readonly loadFactor: number;
    readonly routeFactor: number;
    readonly cargoFactor: number;
    readonly urgencyFactor: number;
    readonly seasonFactor: number;
    readonly demandFactor: number;
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
export interface PromoCode {
    readonly code: string;
    readonly discount: number;
    readonly validUntil?: Date;
    readonly maxUses?: number;
    readonly currentUses: number;
    readonly source: 'exit-intent' | 'timer' | 'manual';
}
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
//# sourceMappingURL=logistics.d.ts.map