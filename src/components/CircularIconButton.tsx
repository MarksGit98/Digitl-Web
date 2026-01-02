import React, { useState } from 'react';
import { BUTTON_SIZES, ANIMATION, COLORS } from '../constants/sizing';
import { createCircular3DButtonStyle } from '../styles/buttonStyles';

interface CircularIconButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function CircularIconButton({
  onPress,
  disabled = false,
  style,
  children,
}: CircularIconButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = createCircular3DButtonStyle(
    BUTTON_SIZES.NAV_ARROW_SIZE,
    disabled ? COLORS.BACKGROUND_DISABLED : COLORS.BUTTON_BLUE,
    COLORS.TEXT_WHITE
  );

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  return (
    <div
      style={{
        ...buttonStyle.base,
        ...(isPressed ? buttonStyle.pressed : {}),
        ...(isHovered && !isPressed && !disabled ? buttonStyle.hover : {}),
        ...(disabled ? { 
          backgroundColor: COLORS.BACKGROUND_DISABLED,
          opacity: ANIMATION.OPACITY_DISABLED,
          cursor: 'not-allowed',
        } : {}),
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
        {children}
      </div>
    </div>
  );
}

