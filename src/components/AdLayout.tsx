import AdsterraAd from './AdsterraAd';

interface AdLayoutProps {
  children: React.ReactNode;
}

export default function AdLayout({ children }: AdLayoutProps) {
  return (
    <>
      {/* Main content */}
      {children}

      {/* Bottom native banner ad */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        zIndex: 100,
      }}>
        <AdsterraAd variant="native" />
      </div>
    </>
  );
}
