import { useEffect, useRef, useState } from 'react';

type AdVariant = 'banner-left' | 'banner-right' | 'banner-bottom';

interface AdsterraAdProps {
  variant: AdVariant;
  className?: string;
}

const DESKTOP_MIN_WIDTH = 1024;

/**
 * AdsterraAd component for displaying Adsterra ads
 *
 * Usage:
 * <AdsterraAd variant="banner-left" />   // 160x300 left banner (desktop only)
 * <AdsterraAd variant="banner-right" />  // 300x250 right banner (desktop only)
 * <AdsterraAd variant="banner-bottom" /> // 300x250 bottom banner (all screens)
 */
export default function AdsterraAd({ variant, className }: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= DESKTOP_MIN_WIDTH);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_MIN_WIDTH);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (hasInitialized.current || !containerRef.current) return;

    // Side banners are desktop only
    if ((variant === 'banner-left' || variant === 'banner-right') && !isDesktop) return;

    hasInitialized.current = true;

    if (variant === 'banner-left') {
      (window as any).atOptions = {
        key: 'be5082c59b47043fc8717a0fa3fe5ccd',
        format: 'iframe',
        height: 300,
        width: 160,
        params: {}
      };
      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/be5082c59b47043fc8717a0fa3fe5ccd/invoke.js';
      containerRef.current.appendChild(script);
    } else if (variant === 'banner-right' || variant === 'banner-bottom') {
      (window as any).atOptions = {
        key: '14f24981dcdb1c5019107fca1bba9f6e',
        format: 'iframe',
        height: 250,
        width: 300,
        params: {}
      };
      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/14f24981dcdb1c5019107fca1bba9f6e/invoke.js';
      containerRef.current.appendChild(script);
    }
  }, [variant, isDesktop]);

  // Side banners are desktop only
  if ((variant === 'banner-left' || variant === 'banner-right') && !isDesktop) {
    return null;
  }

  const dimensions = variant === 'banner-left'
    ? { width: 160, height: 300 }
    : { width: 300, height: 250 };

  return (
    <div className={className} ref={containerRef} style={dimensions} />
  );
}
