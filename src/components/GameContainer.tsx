
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
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      position: 'fixed',
      top: 0,
      left: 0,
      overflowX: 'hidden',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    } as React.CSSProperties}>
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
        paddingBottom: '100px', // Extra padding for bottom ad
        boxSizing: 'border-box',
        flexShrink: 0,
      }}>
        {children}
      </div>
    </div>
  );
}

export const CONTAINER_DIMENSIONS = {
  WIDTH: CONTAINER_WIDTH,
  HEIGHT: CONTAINER_HEIGHT,
};

