declare class NextGenLogisticsApp {
    private calculator;
    private isCalculating;
    constructor();
    /**
     * Initialize the application
     */
    private init;
    /**
     * Initialize the smart calculator
     */
    private initCalculator;
    /**
     * Handle calculation request
     */
    private handleCalculation;
    /**
     * Collect form data with validation
     */
    private collectFormData;
    /**
     * Display calculation result
     */
    private displayResult;
    /**
     * Render successful calculation result
     */
    private renderSuccessResult;
    /**
   * Render error result
   */
    private renderErrorResult;
    /**
     * Display error message
     */
    private displayError;
    /**
     * Show/hide loading state
     */
    private showLoadingState;
    /**
     * Initialize city autocomplete
     */
    private initCityAutocomplete;
    /**
     * Setup autocomplete for input field
     */
    private setupAutocomplete;
    /**
     * Initialize smooth scrolling
     */
    private initSmoothScrolling;
    /**
     * Initialize exit intent popup
     */
    private initExitIntent;
    /**
     * Show exit intent popup
     */
    private showExitIntentPopup;
    /**
     * Handle exit intent form submission
     */
    handleExitIntentSubmit(): void;
    /**
     * Show lead form (called from calculator result)
     */
    showLeadForm(calculationResult?: any): void;
    /**
     * Initialize analytics
     */
    private initAnalytics;
    /**
   * Track analytics event
   */
    private trackEvent;
}
export { NextGenLogisticsApp };
//# sourceMappingURL=app.d.ts.map