import React from 'react';
import { FONT_SIZES, SPACING, COLORS, BUTTON_BORDER, CALCULATOR_DISPLAY, LETTER_SPACING } from '../constants/sizing';
import { FadedEights } from './FadedEights';

interface CalculatorDisplayProps {
  mode: 'chyron' | 'target' | 'success';
  chyronText?: string;
  targetNumber?: number;
  successMessage?: string;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  mode,
  chyronText = 'DIGITL',
  targetNumber,
  successMessage,
}) => {
  const innerBorderOffset = BUTTON_BORDER.WIDTH * 2.5 + 2;

  // Calculate animation bounds to keep text within inner border while scrolling left to right
  const containerWidth = CALCULATOR_DISPLAY.WIDTH * 0.5625; // Display width
  // Inner width is container width minus border offsets (no padding since wrapper is absolute positioned within borders)
  const innerWidth = containerWidth - (innerBorderOffset * 2);
  const chyronFontSize = FONT_SIZES.TARGET_NUMBER * 0.5625;
  const chyronLetterSpacing = LETTER_SPACING.WIDE * 0.75;
  // Estimate text width: "DIGITL" = 6 characters, 5 spaces between them
  const estimatedTextWidth = (chyronFontSize * 6) + (chyronLetterSpacing * 5);
  
  // For left-to-right scroll, calculate start and end positions:
  // Start: text's left edge should align with inner border's left edge (or slightly before)
  // Since text is centered in its container by default, we need to offset it
  // The text container is centered, so at 0% translateX, the center of text is at center of inner area
  // To align left edge with left border: translateX = -(innerWidth/2) + (estimatedTextWidth/2)
  // To align right edge with right border: translateX = (innerWidth/2) - (estimatedTextWidth/2)
  const startOffset = -(innerWidth / 2) + (estimatedTextWidth / 2); // Left edge at left border
  const endOffset = (innerWidth / 2) - (estimatedTextWidth / 2); // Right edge at right border

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingLeft: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.75}px`,
    paddingRight: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.75}px`,
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
    borderRadius: `${Math.max(0, CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 2.5) - 2)}px`,
  };

  const chyronTextStyle: React.CSSProperties = {
    fontSize: chyronFontSize,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono, monospace',
    letterSpacing: `${chyronLetterSpacing}px`,
    textAlign: 'center' as const,
    textShadow: '2px 2px 3px rgba(0, 0, 0, 0.8)',
    zIndex: 1,
    position: 'relative' as const,
    lineHeight: '1',
    display: 'inline-block' as const,
    pointerEvents: 'none' as const,
    whiteSpace: 'nowrap' as const,
    animation: `chyronLeftToRight 10s linear infinite`,
    fontWeight: 900 as const,
    // CSS custom properties for animation start and end positions
    ['--start-offset' as any]: `${startOffset}px`,
    ['--end-offset' as any]: `${endOffset}px`,
  };

  // Target number mode (game screen)
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

  // For target mode, create display digits (faded 8s with target digits replacing rightmost positions)
  const getDisplayDigits = () => {
    if (mode !== 'target' || targetNumber === undefined) return null;
    
    const targetDigits = targetNumber.toString().split('');
    const totalPositions = 4;
    const displayDigits: string[] = [];
    
    // Right-align: fill left positions with faded 8s, then add target digits
    const numEmptySlots = totalPositions - targetDigits.length;
    for (let i = 0; i < totalPositions; i++) {
      if (i < numEmptySlots) {
        // Left positions: faded 8s
        displayDigits.push('8');
      } else {
        // Right positions: target digits
        displayDigits.push(targetDigits[i - numEmptySlots]);
      }
    }
    
    return displayDigits;
  };

  const displayDigits = getDisplayDigits();

  return (
    <div style={containerStyle}>
      <div style={innerBorderStyle} />
      
      {mode === 'chyron' && (
        <>
          <FadedEights count={4} />
          <div style={chyronWrapperStyle}>
            <span style={chyronTextStyle}>{chyronText}</span>
          </div>
        </>
      )}
      
      {mode === 'target' && displayDigits && (
        <div style={{
          position: 'absolute' as const,
          top: `${innerBorderOffset}px`,
          left: `${innerBorderOffset}px`,
          right: `${innerBorderOffset}px`,
          bottom: `${innerBorderOffset}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: `${LETTER_SPACING.WIDE * 0.75}px`,
          zIndex: 1,
        }}>
          {displayDigits.map((digit, index) => {
            // Determine if this position should be faded (leftmost empty slots)
            const numEmptySlots = 4 - targetNumber!.toString().length;
            const isFaded = index < numEmptySlots;
            // Each digit container has a fixed width to ensure consistent alignment
            // Match the width of a single "8" character to align with faded 8s
            const digitContainerStyle: React.CSSProperties = {
              display: 'inline-block',
              width: `${FONT_SIZES.TARGET_NUMBER * 0.5625 * 0.6}px`, // Approximate width of an "8" digit
              textAlign: 'center' as const,
            };
            const digitStyle: React.CSSProperties = {
              ...targetNumberStyle,
              letterSpacing: 0,
              opacity: isFaded ? 0.08 : 1,
              color: COLORS.TEXT_SUCCESS,
              display: 'inline-block',
            };
            return (
              <span key={index} style={digitContainerStyle}>
                <span style={digitStyle}>{digit}</span>
              </span>
            );
          })}
        </div>
      )}
      
      {mode === 'success' && (
        <>
          <FadedEights count={4} />
          <div style={successWrapperStyle}>
            <span style={successTextStyle}>
              {successMessage ? `${successMessage}!` : 'Success!'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

