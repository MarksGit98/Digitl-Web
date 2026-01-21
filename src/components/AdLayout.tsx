import AdsterraAd from './AdsterraAd';

interface AdLayoutProps {
  children: React.ReactNode;
}

export default function AdLayout({ children }: AdLayoutProps) {
  return (
    <>
      {/* Left banner ad - fixed position, desktop only */}
      <div style={{
        position: 'fixed',
        left: 20,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
      }}>
        <AdsterraAd variant="banner-left" />
      </div>

      {/* Right banner ad - fixed position, desktop only */}
      <div style={{
        position: 'fixed',
        right: 20,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
      }}>
        <AdsterraAd variant="banner-right" />
      </div>

      {/* Main content */}
      {children}
    </>
  );
}
