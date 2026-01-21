// Web ad manager using Adsterra
class AdManager {
  private adsEnabled: boolean = true;
  private adFree: boolean = false;

  async initialize(): Promise<void> {
    // Adsterra ads are loaded via the AdsterraAd component
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

