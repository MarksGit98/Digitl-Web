import React from 'react';
import { SPACING, COLORS, FONT_SIZES, BORDER_RADIUS, OVERLAY_BORDER, SCREEN_DIMENSIONS } from '../constants/sizing';
import InstructionsContent from './InstructionsContent';
import CloseButton from './CloseButton';
import OverlayBackdrop from './OverlayBackdrop';

interface HowToPlayModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function HowToPlayModal({
  visible,
  onClose,
}: HowToPlayModalProps) {
  if (!visible) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const styles = {
    modalOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      pointerEvents: 'none' as const, // Allow clicks to pass through to backdrop
    },
    modalContentWrapper: {
      pointerEvents: 'auto' as const, // Re-enable pointer events for content
      position: 'absolute' as const,
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)', // Only horizontal centering
      zIndex: 1001, // Above the backdrop
      width: '80%',
      maxWidth: `${SCREEN_DIMENSIONS.WIDTH * 0.8}px`,
      minWidth: '300px',
    },
    modalContent: {
      backgroundColor: COLORS.BACKGROUND_WHITE,
      borderRadius: `${BORDER_RADIUS.LARGE}px`,
      border: `${OVERLAY_BORDER.WIDTH}px solid ${OVERLAY_BORDER.COLOR}`,
      padding: `${SPACING.PADDING_MEDIUM * 0.7}px ${SPACING.PADDING_LARGE * 0.7}px`,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'flex-start',
      alignItems: 'center' as const,
      overflow: 'hidden' as const,
    },
    modalTitle: {
      fontSize: FONT_SIZES.TITLE * 0.48,
      fontFamily: 'var(--font-banner)',
      backgroundColor: COLORS.BACKGROUND_DARK,
      color: COLORS.TEXT_WHITE,
      padding: `${SPACING.PADDING_MEDIUM * 0.7 + 4}px ${SPACING.PADDING_LARGE * 0.7}px ${SPACING.PADDING_MEDIUM * 0.7}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.7}px`,
      fontWeight: 'bold' as const,
      marginBottom: `${SPACING.MARGIN_MEDIUM}px`,
      width: '100%',
      textTransform: 'uppercase' as const,
      letterSpacing: '1.5px',
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollView: {
      flexGrow: 1,
      flexShrink: 1,
      maxHeight: '50vh',
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
      scrollbarWidth: 'thin' as const,
    },
    scrollContent: {
      paddingBottom: `${SPACING.PADDING_SMALL}px`,
    },
  };

  return (
    <>
      <OverlayBackdrop onClick={handleBackdropClick} zIndex={1000} />
      <div style={styles.modalOverlay}>
        <div style={styles.modalContentWrapper}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalTitle}>How to Play</div>
        
        <div style={styles.scrollView}>
          <div style={styles.scrollContent}>
            <InstructionsContent />
          </div>
        </div>

        <CloseButton onClick={onClose} />
          </div>
        </div>
      </div>
    </>
  );
}

