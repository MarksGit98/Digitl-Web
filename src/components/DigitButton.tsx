import React, { useState } from 'react';
import { BUTTON_SIZES, FONT_SIZES, BUTTON_BORDER, ANIMATION, COLORS, BORDER_RADIUS } from '../constants/sizing';
import { TEXT_SHADOW_BOLD_MEDIUM } from '../constants/fonts';
import { createCircular3DButtonStyle } from '../styles/buttonStyles';

interface DigitButtonProps {
  digit: number;
  onPress: () => void;
  disabled?: boolean;
  isFirstSelected?: boolean;
  isSecondSelected?: boolean;
  isError?: boolean;
  isAnimating?: boolean;
  isShaking?: boolean;
  isBouncing?: boolean;
  style?: React.CSSProperties;
}

export default function DigitButton({
  digit,
  onPress,
  disabled = false,
  isFirstSelected = false,
  isSecondSelected = false,
  isError = false,
  isAnimating = false,
  isShaking = false,
  isBouncing = false,
  style,
}: DigitButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getBackgroundColor = () => {
    if (isError) return COLORS.DIGIT_ERROR;
    if (isFirstSelected) return COLORS.DIGIT_FIRST_SELECTED;
    if (isSecondSelected) return COLORS.DIGIT_SECOND_SELECTED;
    return COLORS.BACKGROUND_WHITE;
  };

  const getTextColor = () => {
    if (isError || isFirstSelected || isSecondSelected) return COLORS.TEXT_WHITE;
    return COLORS.TEXT_SECONDARY;
  };

  const isSelected = isFirstSelected || isSecondSelected || isError;
  const backgroundColor = getBackgroundColor();
  const textColor = getTextColor();

  const buttonStyle = createCircular3DButtonStyle(
    BUTTON_SIZES.DIGIT_BUTTON_SIZE,
    backgroundColor,
    textColor
  );

  const handlePress = () => {
    if (!disabled && !isAnimating) {
      onPress();
    }
  };

  // Calculate font size based on digit length
  const fontSize = digit.toString().length > 2 
    ? FONT_SIZES.DIGIT_TEXT * 0.7 
    : FONT_SIZES.DIGIT_TEXT;

  return (
    <div
      style={{
        ...buttonStyle.base,
        borderRadius: `${BORDER_RADIUS.XLARGE}px`, // Override circular to rounded square
        ...(isSelected ? {
          transform: `translate(${ANIMATION.TRANSLATE_X_SELECTED}px, ${ANIMATION.TRANSLATE_Y_SELECTED}px)`,
          boxShadow: 'none',
          transition: `transform ${ANIMATION.DURATION_FAST}ms ease-out, box-shadow ${ANIMATION.DURATION_FAST}ms ease-out`,
        } : {
          transition: `transform ${ANIMATION.DURATION_FAST}ms ease-out, box-shadow ${ANIMATION.DURATION_FAST}ms ease-out`,
        }),
        ...(isShaking ? {
          animation: 'shake 0.55s ease-in-out',
        } : {}),
        ...(isBouncing ? {
          animation: 'bounce 1.1s ease-in-out infinite',
        } : {}),
        ...(isPressed && !isSelected ? buttonStyle.pressed : {}),
        ...(isHovered && !isPressed && !isSelected && !disabled ? buttonStyle.hover : {}),
        ...(disabled || isAnimating ? { 
          opacity: ANIMATION.OPACITY_DISABLED,
          cursor: 'not-allowed',
        } : {}),
        ...(isAnimating ? { opacity: ANIMATION.OPACITY_HIDDEN } : {}),
        margin: `${BUTTON_SIZES.DIGIT_BUTTON_MARGIN}px`,
        border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
        ...style,
      }}
      onClick={handlePress}
      onMouseEnter={() => !disabled && !isAnimating && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !disabled && !isAnimating && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: `${BORDER_RADIUS.XLARGE}px`,
        overflow: 'hidden',
      }}>
        <span style={{
          fontSize,
          fontWeight: 'bold',
          color: textColor,
          fontFamily: 'Digital-7-Mono, monospace',
          ...TEXT_SHADOW_BOLD_MEDIUM,
        }}>
          {digit}
        </span>
      </div>
    </div>
  );
}

