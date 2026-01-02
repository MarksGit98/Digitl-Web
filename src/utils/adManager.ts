// Web ad manager using Google AdSense (no-op for now, can be implemented)
class AdManager {
  private adsEnabled: boolean = true;
  private adFree: boolean = false;

  async initialize(): Promise<void> {
    // Initialize Google AdSense if needed
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

