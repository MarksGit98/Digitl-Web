import React from 'react';

interface OverlayBackdropProps {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  zIndex?: number;
}

export default function OverlayBackdrop({ onClick, zIndex = 1000 }: OverlayBackdropProps) {
  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: zIndex - 1, // Backdrop should be behind the overlay content
  };

  return <div style={backdropStyle} onClick={onClick} />;
}

