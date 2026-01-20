// Web ad manager using Ezoic
class AdManager {
  private adsEnabled: boolean = true;
  private adFree: boolean = false;

  async initialize(): Promise<void> {
    // Ezoic scripts are loaded via index.html
    // This method can be used for any additional initialization if needed
  }

  setAdsEnabled(enabled: boolean): void {
    this.adsEnabled = enabled;
  }

  setAdFree(adFree: boolean): void {
    this.adFree = adFree;
  }

  isAdsEnabled(): boolean {
    return this.adsEnabled && !this.adFree;
  }
}

export const adManager = new AdManager();

