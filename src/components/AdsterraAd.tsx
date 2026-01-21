import { useEffect, useRef, useState } from 'react';

type AdVariant = 'native' | 'banner-left' | 'banner-right';

interface AdsterraAdProps {
  variant: AdVariant;
  className?: string;
}

const DESKTOP_MIN_WIDTH = 1024;

/**
 * AdsterraAd component for displaying Adsterra ads
 *
 * Usage:
 * <AdsterraAd variant="native" />        // Native banner ad
 * <AdsterraAd variant="banner-left" />   // 160x300 left banner (desktop only)
 * <AdsterraAd variant="banner-right" />  // 300x250 right banner (desktop only)
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

    if (variant === 'native') {
      hasInitialized.current = true;
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl28527754.effectivegatecpm.com/520bdb57a092a9b2817c6013781290a5/invoke.js';
      containerRef.current.parentNode?.insertBefore(script, containerRef.current);
    } else if (variant === 'banner-left' && isDesktop) {
      hasInitialized.current = true;
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
    } else if (variant === 'banner-right' && isDesktop) {
      hasInitialized.current = true;
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

  if (variant === 'native') {
    return (
      <div className={className}>
        <div
          ref={containerRef}
          id="container-520bdb57a092a9b2817c6013781290a5"
        />
      </div>
    );
  }

  // Banner variants - desktop only
  if (!isDesktop) {
    return null;
  }

  const dimensions = variant === 'banner-left'
    ? { width: 160, height: 300 }
    : { width: 300, height: 250 };

  return (
    <div className={className} ref={containerRef} style={dimensions} />
  );
}
