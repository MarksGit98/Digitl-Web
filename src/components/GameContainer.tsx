
// Fixed container dimensions
const CONTAINER_WIDTH = 600;
const CONTAINER_HEIGHT = 1200;
const MAIN_MENU_HEIGHT = 1800; // Taller height for main menu to fit all content

interface GameContainerProps {
  children: React.ReactNode;
  isMainMenu?: boolean;
}

export default function GameContainer({ children, isMainMenu = false }: GameContainerProps) {
  const containerHeight = isMainMenu ? MAIN_MENU_HEIGHT : CONTAINER_HEIGHT;
  
  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'scroll',
      WebkitOverflowScrolling: 'touch',
    } as React.CSSProperties}>
      {/* Top Ad Banner Space - Reserved for future ads */}
      <div style={{
        width: '100%',
        height: '50px',
        flexShrink: 0,
      }} />

      {/* Game container - responsive width */}
      <div style={{
        width: '100%',
        maxWidth: `${CONTAINER_WIDTH}px`,
        minHeight: `${containerHeight}px`,
        backgroundColor: '#f8f9fa',
        position: 'relative',
        paddingLeft: '10px',
        paddingRight: '10px',
        boxSizing: 'border-box',
      }}>
        {children}
      </div>

      {/* Bottom Ad Banner Space - Reserved for future ads */}
      <div style={{
        width: '100%',
        height: '50px',
        flexShrink: 0,
      }} />
    </div>
  );
}

export const CONTAINER_DIMENSIONS = {
  WIDTH: CONTAINER_WIDTH,
  HEIGHT: CONTAINER_HEIGHT,
};

