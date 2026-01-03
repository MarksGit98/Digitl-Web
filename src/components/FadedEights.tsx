import React from 'react';
import { FONT_SIZES, LETTER_SPACING, COLORS } from '../constants/sizing';

interface FadedEightsProps {
  count?: number;
}

export const FadedEights: React.FC<FadedEightsProps> = ({ count = 4 }) => {
  const fadedEightsText = '8'.repeat(count);

  return (
    <div
      style={{
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Center-align horizontally
        fontFamily: 'Digital-7-Mono, monospace',
        fontSize: FONT_SIZES.TARGET_NUMBER * 0.5625, // Same size as target number
        color: COLORS.TEXT_SUCCESS,
        opacity: 0.08, // Very faded
        letterSpacing: `${LETTER_SPACING.WIDE * 0.75}px`, // Same as target number
        zIndex: 0.5,
        pointerEvents: 'none' as const,
      }}
    >
      {fadedEightsText}
    </div>
  );
};

