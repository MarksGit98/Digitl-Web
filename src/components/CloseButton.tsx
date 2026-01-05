import React from 'react';
import { SPACING, COLORS, FONT_SIZES, BORDER_RADIUS, BUTTON_BORDER } from '../constants/sizing';

interface CloseButtonProps {
  onClick: () => void;
  style?: React.CSSProperties;
}

const ACTION_BUTTON_SHADOW_OFFSET = 4;
const ACTION_BUTTON_SHADOW_HOVER_OFFSET = 5;

export default function CloseButton({ onClick, style }: CloseButtonProps) {
  const buttonStyle: React.CSSProperties = {
    padding: `${14 * 0.7225}px ${24 * 0.7225}px`,
    width: `${200 * 0.7225}px`,
    minHeight: `${50 * 0.7225}px`,
    borderRadius: `${BORDER_RADIUS.MEDIUM * 0.7225}px`,
    backgroundColor: COLORS.BACKGROUND_WHITE,
    color: COLORS.TEXT_SECONDARY,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
    fontSize: FONT_SIZES.DIFFICULTY_BUTTON * 0.7225,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: 'bold' as const,
    boxShadow: `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`,
    transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    ...style,
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate(-1px, -1px)';
        e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_HOVER_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(0, 0)';
        e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = `translate(${ACTION_BUTTON_SHADOW_OFFSET}px, ${ACTION_BUTTON_SHADOW_OFFSET}px)`;
        e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0, 0, 0, 1)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translate(0, 0)';
        e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
      }}
    >
      Close
    </button>
  );
}

