import type { CalculatorFormData, CalculationResponse } from '../types/logistics.js';
export declare class SmartLogisticsCalculator {
    private readonly transportTypes;
    private readonly regions;
    private readonly cargoFactors;
    private readonly urgencyFactors;
    /**
     * Главный метод расчета стоимости
     */
    calculatePrice(data: CalculatorFormData): CalculationResponse;
    /**
     * Валидация входных данных
     */
    private validateInput;
    /**
     * ВАЖНОЕ ОГРАНИЧЕНИЕ: Сборные грузы только между регионами!
     */
    private checkRegionRestriction;
    /**
     * Выбор оптимального транспорта
     */
    private selectOptimalTransport;
    /**
     * Расчет базовой цены по километражу (из анализа АвтоГОСТ)
     */
    private calculateBasePrice;
    /**
     * Расчет всех ценовых факторов
     */
    private calculatePriceFactors;
    /**
     * Коэффициент загрузки (чем меньше груз, тем дороже за единицу)
     */
    private calculateLoadFactor;
    /**
     * Коэффициент популярности маршрута
     */
    private getRouteFactor;
    /**
     * Сезонный коэффициент
     */
    private getSeasonFactor;
    /**
     * Коэффициент спроса (можно интегрировать с ML в будущем)
     */
    private getDemandFactor;
    /**
     * Применение всех факторов к базовой цене
     */
    private applyFactors;
    /**
     * Создание успешного результата
     */
    private createSuccessResult;
    /**
     * Создание ошибки
     */
    private createError;
    private getCityRegion;
    private calculateRoute;
    private createCityData;
    private getDistanceByRoute;
    private getRoutePopularity;
    private isMarketplaceHub;
    private getDeliveryZone;
    private calculateDeliveryTime;
    private calculateFullTruckPrice;
    private getRestrictions;
    private getRecommendations;
}
//# sourceMappingURL=calculator.d.ts.map