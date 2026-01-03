import React from 'react';
import { SCREEN_DIMENSIONS, SPACING, COLORS, FONT_SIZES, BORDER_RADIUS, BUTTON_BORDER } from '../constants/sizing';
import InstructionsContent from './InstructionsContent';

interface HowToPlayModalProps {
  visible: boolean;
  onClose: () => void;
}

const SCREEN_WIDTH = SCREEN_DIMENSIONS.WIDTH;
const SCREEN_HEIGHT = SCREEN_DIMENSIONS.HEIGHT;

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
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      width: '85%',
      maxWidth: '550px',
      minWidth: '300px',
      maxHeight: '80vh',
      backgroundColor: COLORS.BACKGROUND_WHITE,
      borderRadius: `${BORDER_RADIUS.LARGE}px`,
      padding: `${SPACING.PADDING_MEDIUM}px`,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'flex-start',
      overflow: 'hidden' as const,
    },
    modalTitle: {
      fontSize: FONT_SIZES.TITLE,
      fontWeight: 'bold' as const,
      color: COLORS.BACKGROUND_DARK,
      marginBottom: `${SPACING.MARGIN_MEDIUM}px`,
      textAlign: 'center' as const,
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
    closeButton: {
      backgroundColor: COLORS.BACKGROUND_WHITE,
      paddingTop: `${SPACING.MARGIN_SMALL}px`,
      paddingBottom: `${SPACING.MARGIN_SMALL}px`,
      paddingLeft: `${SPACING.PADDING_MEDIUM}px`,
      paddingRight: `${SPACING.PADDING_MEDIUM}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM}px`,
      borderWidth: `${BUTTON_BORDER.WIDTH}px`,
      borderStyle: 'solid' as const,
      borderColor: BUTTON_BORDER.COLOR,
      cursor: 'pointer',
      boxShadow: '4px 4px 0 0 rgba(0, 0, 0, 1)',
      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
      marginTop: '0px',
      alignSelf: 'center' as const,
    },
    closeButtonText: {
      color: '#000000',
      fontSize: FONT_SIZES.BUTTON_TEXT,
      fontWeight: '500' as const,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
  };

  return (
    <div style={styles.modalOverlay} onClick={handleBackdropClick}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalTitle}>How to Play</div>
        
        <div style={styles.scrollView}>
          <div style={styles.scrollContent}>
            <InstructionsContent />
          </div>
        </div>

        <button
          style={styles.closeButton}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(2px, 2px)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translate(4px, 4px)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
          }}
        >
          <span style={styles.closeButtonText}>Close</span>
        </button>
      </div>
    </div>
  );
}

