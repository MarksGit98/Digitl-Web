import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    ezstandalone?: {
      cmd: Array<() => void>;
      showAds: (...placementIds: number[]) => void;
    };
  }
}

interface EzoicAdProps {
  placementId: number;
}

/**
 * EzoicAd component for displaying Ezoic ads
 *
 * Usage:
 * <EzoicAd placementId={101} />
 *
 * Get your placement IDs from the Ezoic dashboard.
 * DO NOT add styling to this component - Ezoic handles ad sizing.
 */
export default function EzoicAd({ placementId }: EzoicAdProps) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Push the showAds command to Ezoic's command queue
    if (window.ezstandalone) {
      window.ezstandalone.cmd.push(() => {
        window.ezstandalone?.showAds(placementId);
      });
    }
  }, [placementId]);

  return <div id={`ezoic-pub-ad-placeholder-${placementId}`} />;
}

/**
 * Hook to show multiple Ezoic ads at once (more efficient)
 * Call this once per page with all placement IDs that exist on that page
 *
 * Usage:
 * useEzoicAds([101, 102, 103]);
 */
export function useEzoicAds(placementIds: number[]) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current || placementIds.length === 0) return;
    hasInitialized.current = true;

    if (window.ezstandalone) {
      window.ezstandalone.cmd.push(() => {
        window.ezstandalone?.showAds(...placementIds);
      });
    }
  }, [placementIds]);
}

/**
 * Placeholder component - use this where you want an ad
 * Then call useEzoicAds with all placement IDs on the page
 */
export function EzoicAdPlaceholder({ placementId }: EzoicAdProps) {
  return <div id={`ezoic-pub-ad-placeholder-${placementId}`} />;
}
