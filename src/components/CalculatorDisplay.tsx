import React from 'react';
import { FONT_SIZES, SPACING, COLORS, BUTTON_BORDER, CALCULATOR_DISPLAY, LETTER_SPACING } from '../constants/sizing';
import { FadedEights } from './FadedEights';

interface CalculatorDisplayProps {
  mode: 'chyron' | 'target' | 'success';
  chyronText?: string;
  targetNumber?: number;
  successMessage?: string;
  targetNumberPaddingRight?: number;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  mode,
  chyronText = 'DIGITL',
  targetNumber,
  successMessage,
  targetNumberPaddingRight,
}) => {
  const innerBorderOffset = BUTTON_BORDER.WIDTH * 2.5 + 2;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingHorizontal: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.75}px`,
    paddingTop: `${SPACING.VERTICAL_SPACING}px`,
    paddingBottom: `${SPACING.VERTICAL_SPACING}px`,
    borderRadius: `${CALCULATOR_DISPLAY.BORDER_RADIUS * 0.75}px`,
    width: `${CALCULATOR_DISPLAY.WIDTH * 0.5625}px`,
    height: `${CALCULATOR_DISPLAY.HEIGHT * 0.65}px`,
    position: 'relative' as const,
    pointerEvents: 'none' as const,
    // Metallic border effect - scaled down borders
    borderTopColor: '#B0B0B0',
    borderLeftColor: '#909090',
    borderRightColor: '#404040',
    borderBottomColor: '#404040',
    borderTopWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`,
    borderLeftWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`,
    borderRightWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`,
    borderBottomWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`,
    borderStyle: 'solid',
    boxShadow: '0 1px 2px rgba(160, 160, 160, 0.3)',
    overflow: 'hidden' as const,
  };

  const innerBorderStyle: React.CSSProperties = {
    position: 'absolute' as const,
    top: `${innerBorderOffset}px`,
    left: `${innerBorderOffset}px`,
    right: `${innerBorderOffset}px`,
    bottom: `${innerBorderOffset}px`,
    backgroundColor: '#1F1F1F',
    borderRadius: `${Math.max(0, CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 2.5) - 2)}px`,
    zIndex: 0,
  };

  // Chyron mode (main menu)
  const chyronWrapperStyle: React.CSSProperties = {
    position: 'absolute' as const,
    top: `${innerBorderOffset}px`,
    left: `${innerBorderOffset}px`,
    right: `${innerBorderOffset}px`,
    bottom: `${innerBorderOffset}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden' as const,
    zIndex: 1,
    paddingRight: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.75}px`,
    borderRadius: `${Math.max(0, CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 2.5) - 2)}px`,
  };

  const chyronTextStyle: React.CSSProperties = {
    fontSize: FONT_SIZES.TARGET_NUMBER * 0.5625,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono, monospace',
    letterSpacing: `${LETTER_SPACING.WIDE * 0.75}px`,
    textAlign: 'center' as const,
    textShadow: '2px 2px 3px rgba(0, 0, 0, 0.8)',
    zIndex: 1,
    position: 'relative' as const,
    lineHeight: `${FONT_SIZES.TARGET_NUMBER * 0.95}px`,
    display: 'inline-block' as const,
    pointerEvents: 'none' as const,
    whiteSpace: 'nowrap' as const,
    animation: 'chyron 10s linear infinite',
    fontWeight: 900 as const,
  };

  // Target number mode (game screen)
  const targetNumberWrapperStyle: React.CSSProperties = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden' as const,
    zIndex: 1,
    paddingRight: targetNumberPaddingRight ? `${targetNumberPaddingRight}px` : undefined,
  };

  const targetNumberStyle: React.CSSProperties = {
    fontSize: FONT_SIZES.TARGET_NUMBER * 0.5625,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono, monospace',
    letterSpacing: `${LETTER_SPACING.WIDE * 0.75}px`,
    textAlign: 'right' as const,
    textShadow: '2px 2px 3px rgba(0, 0, 0, 0.8)',
    zIndex: 1,
    position: 'relative' as const,
    lineHeight: `${FONT_SIZES.TARGET_NUMBER * 0.95}px`,
    display: 'inline-block' as const,
    pointerEvents: 'none' as const,
  };

  // Success message mode (game screen)
  const successWrapperStyle: React.CSSProperties = {
    position: 'absolute' as const,
    top: `${innerBorderOffset}px`,
    left: `${innerBorderOffset}px`,
    right: `${innerBorderOffset}px`,
    bottom: `${innerBorderOffset}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden' as const,
    zIndex: 1,
    borderRadius: `${Math.max(0, (CALCULATOR_DISPLAY.BORDER_RADIUS * 0.75) - (BUTTON_BORDER.WIDTH * 2.5) - 2)}px`,
  };

  const successTextStyle: React.CSSProperties = {
    fontSize: FONT_SIZES.TARGET_NUMBER * 0.6,
    fontFamily: 'Digital-7-Mono, monospace',
    color: COLORS.DIFFICULTY_EASY,
    fontWeight: 'bold' as const,
    textAlign: 'left' as const,
    whiteSpace: 'nowrap' as const,
    pointerEvents: 'none' as const,
    animation: 'chyronScroll 6s linear infinite',
    display: 'block' as const,
    textShadow: '2px 2px 3px rgba(0, 0, 0, 0.8)',
  };

  return (
    <div style={containerStyle}>
      <div style={innerBorderStyle} />
      <FadedEights count={4} />
      
      {mode === 'chyron' && (
        <div style={chyronWrapperStyle}>
          <span style={chyronTextStyle}>{chyronText}</span>
        </div>
      )}
      
      {mode === 'target' && targetNumber !== undefined && (
        <div style={targetNumberWrapperStyle}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: `${LETTER_SPACING.WIDE * 0.75}px`,
          }}>
            {targetNumber.toString().split('').map((digit, index) => {
              // For digit "1", shift it left to align with left groove of faded 8
              const isOne = digit === '1';
              const digitStyle: React.CSSProperties = {
                ...targetNumberStyle,
                letterSpacing: 0,
                ...(isOne && {
                  transform: `translateX(-${LETTER_SPACING.WIDE * 0.75 * 0.5}px)`, // Shift left by half the gap
                }),
              };
              return (
                <span key={index} style={digitStyle}>{digit}</span>
              );
            })}
          </div>
        </div>
      )}
      
      {mode === 'success' && (
        <div style={successWrapperStyle}>
          <span style={successTextStyle}>
            {successMessage ? `${successMessage}!` : 'Success!'}
          </span>
        </div>
      )}
    </div>
  );
};

