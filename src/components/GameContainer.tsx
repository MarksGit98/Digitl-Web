
// Fixed container dimensions
const CONTAINER_WIDTH = 650;
const CONTAINER_HEIGHT = 1000;

interface GameContainerProps {
  children: React.ReactNode;
}

export default function GameContainer({ children }: GameContainerProps) {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top Ad Banner Placeholder */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50px',
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        borderBottom: '1px solid #ccc',
      }}>
        <span style={{ color: '#999', fontSize: '12px' }}>Ad Banner (Top)</span>
      </div>

      {/* Bottom Ad Banner Placeholder */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50px',
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        borderTop: '1px solid #ccc',
      }}>
        <span style={{ color: '#999', fontSize: '12px' }}>Ad Banner (Bottom)</span>
      </div>

      {/* Fixed size game container */}
      <div style={{
        width: `${CONTAINER_WIDTH}px`,
        height: `${CONTAINER_HEIGHT}px`,
        backgroundColor: '#f8f9fa',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '50px',
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

