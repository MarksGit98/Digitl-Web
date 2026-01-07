
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
      alignItems: 'flex-start',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      position: 'relative',
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingTop: '8px',
      paddingBottom: '50px',
      scrollBehavior: 'smooth',
      WebkitOverflowScrolling: 'touch',
    } as React.CSSProperties}>
      {/* Top Ad Banner Space - Reserved for future ads */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50px',
        zIndex: 1000,
      }} />

      {/* Bottom Ad Banner Space - Reserved for future ads */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50px',
        zIndex: 1000,
      }} />

      {/* Fixed size game container */}
      <div style={{
        width: `${CONTAINER_WIDTH}px`,
        height: `${containerHeight}px`,
        backgroundColor: '#f8f9fa',
        position: 'relative',
        overflow: 'visible',
        marginTop: '25px',
        marginBottom: '50px',
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

