import { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  variant: 'native';
  className?: string;
}

/**
 * AdsterraAd component for displaying Adsterra native banner ads
 */
export default function AdsterraAd({ className }: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current || !containerRef.current) return;
    hasInitialized.current = true;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl28527754.effectivegatecpm.com/520bdb57a092a9b2817c6013781290a5/invoke.js';
    containerRef.current.parentNode?.insertBefore(script, containerRef.current);
  }, []);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        id="container-520bdb57a092a9b2817c6013781290a5"
      />
    </div>
  );
}
