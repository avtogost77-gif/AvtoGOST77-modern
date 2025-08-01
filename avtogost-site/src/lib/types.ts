export type TransportKey =
  | "gazelle"
  | "threeTon"
  | "fiveTon"
  | "tenTon"
  | "truck";

export type CargoType =
  | "general"
  | "fragile"
  | "valuable"
  | "dangerous"
  | "perishable"
  | "oversized"
  | "сборный"
  | "consolidated";

export interface PricingDetails {
  weight: number;
  volume: number;
  density: number;
  loadPercent: number;
  volumePercent: number;
}

export interface PricingSuccess {
  success: true;
  price: number;
  transport: string;
  distance: number;
  pricePerKm: number;
  deliveryTime: string;
  details: PricingDetails;
}

export interface PricingError {
  error: true;
  message: string;
  alternativePrice?: number;
}

export type PricingResult = PricingSuccess | PricingError;