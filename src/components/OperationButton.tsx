import React, { useState } from 'react';
import { BUTTON_SIZES, BUTTON_BORDER, ANIMATION, COLORS } from '../constants/sizing';
import { createCircular3DButtonStyle, SHADOW_OFFSETS } from '../styles/buttonStyles';

interface OperationButtonProps {
  operation: string;
  onPress: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  style?: React.CSSProperties;
}

export default function OperationButton({
  operation,
  onPress,
  disabled = false,
  isSelected = false,
  style,
}: OperationButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const backgroundColor = isSelected ? COLORS.BUTTON_ORANGE_DARK : COLORS.BUTTON_ORANGE;
  const buttonStyle = createCircular3DButtonStyle(
    BUTTON_SIZES.OPERATION_BUTTON_SIZE,
    backgroundColor,
    COLORS.TEXT_WHITE,
    SHADOW_OFFSETS.OPERATION_UNDO // Use lower shadow for operation buttons
  );

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  // Map operation symbols
  const displaySymbol = operation === '*' ? '×' : operation === '/' ? '÷' : operation === '+' ? '＋' : operation === '-' ? '−' : operation;
  
  // Adjust vertical alignment for different symbols to center them properly
  // Scale adjustments proportionally with button size
  const verticalAdjustmentScale = BUTTON_SIZES.OPERATION_BUTTON_SIZE / 100; // Scale factor based on button size
  const getVerticalAdjustment = () => {
    if (operation === '+') return `translateY(${-1 * verticalAdjustmentScale}px)`; // Plus needs slight upward adjustment
    if (operation === '-') return `translateY(${-3 * verticalAdjustmentScale}px)`; // Minus needs to move up to center
    if (operation === '*') return `translateY(${-3 * verticalAdjustmentScale}px)`; // Multiplication needs to move up more
    if (operation === '/') return `translateY(${-3 * verticalAdjustmentScale}px)`; // Division needs to move up to center
    return 'translateY(0px)';
  };

  return (
    <div
      style={{
        ...buttonStyle.base,
        ...(isSelected ? {
          transform: `translate(${ANIMATION.TRANSLATE_X_SELECTED}px, ${ANIMATION.TRANSLATE_Y_SELECTED}px)`,
          boxShadow: 'none',
          transition: `transform ${ANIMATION.DURATION_FAST}ms ease-out, box-shadow ${ANIMATION.DURATION_FAST}ms ease-out`,
        } : {
          transition: `transform ${ANIMATION.DURATION_FAST}ms ease-out, box-shadow ${ANIMATION.DURATION_FAST}ms ease-out`,
        }),
        ...(isPressed && !isSelected ? buttonStyle.pressed : {}),
        ...(isHovered && !isPressed && !isSelected && !disabled ? buttonStyle.hover : {}),
        ...(disabled ? { 
          backgroundColor: COLORS.BACKGROUND_DISABLED,
          opacity: ANIMATION.OPACITY_DISABLED,
          cursor: 'not-allowed',
        } : {}),
        margin: `${BUTTON_SIZES.OPERATION_BUTTON_MARGIN * 0.5}px`, // Reduced margin to condense horizontally
        border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
        ...style,
      }}
      onClick={handlePress}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        overflow: 'hidden',
      }}>
        <span style={{
          fontSize: `${BUTTON_SIZES.OPERATION_BUTTON_SIZE * 0.85}px`,
          fontWeight: '900',
          color: COLORS.TEXT_WHITE,
          fontFamily: 'Digital-7-Mono, monospace',
          textAlign: 'center',
          lineHeight: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          transform: getVerticalAdjustment(),
          margin: 0,
          padding: 0,
        }}>
          {displaySymbol}
        </span>
      </div>
    </div>
  );
}

