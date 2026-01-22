import AdsterraAd from './AdsterraAd';

// Fixed container dimensions
const CONTAINER_WIDTH = 600;
const CONTAINER_HEIGHT = 1200;

interface GameContainerProps {
  children: React.ReactNode;
}

export default function GameContainer({ children }: GameContainerProps) {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      position: 'fixed',
      top: 0,
      left: 0,
      overflowX: 'hidden',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    } as React.CSSProperties}>
      {/* Left side ad (desktop only) */}
      <div style={{
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
      }}>
        <AdsterraAd variant="banner-left" />
      </div>

      {/* Main content column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: `${CONTAINER_WIDTH}px`,
        height: '100%',
      }}>
        {/* Top spacing - reduced from 50px to 25px */}
        <div style={{
          width: '100%',
          height: '25px',
          flexShrink: 0,
        }} />

        {/* Game container - responsive width */}
        <div style={{
          width: '100%',
          maxWidth: `${CONTAINER_WIDTH}px`,
          backgroundColor: '#f8f9fa',
          position: 'relative',
          paddingLeft: '10px',
          paddingRight: '10px',
          paddingBottom: '15px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}>
          {children}
        </div>
      </div>

      {/* Right side ad (desktop only) */}
      <div style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
      }}>
        <AdsterraAd variant="banner-right" />
      </div>
    </div>
  );
}

export const CONTAINER_DIMENSIONS = {
  WIDTH: CONTAINER_WIDTH,
  HEIGHT: CONTAINER_HEIGHT,
};

