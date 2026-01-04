// React web version of button styles with 3D depth effect
// Converted from mobile PressableButton3D styles

export interface Button3DStyle {
  base: React.CSSProperties;
  pressed: React.CSSProperties;
  hover?: React.CSSProperties;
}

// Standard shadow offset for 3D depth effect (reduced by 5%)
const SHADOW_OFFSET = 3.8; // 4 * 0.95
const SHADOW_OFFSET_SMALL = 2.85; // 3 * 0.95
const SHADOW_OFFSET_LARGE = 4.75; // 5 * 0.95

// Base 3D button style
const base3DButton: React.CSSProperties = {
  borderRadius: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  cursor: 'pointer',
  transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
  position: 'relative',
  boxShadow: `${SHADOW_OFFSET}px ${SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`,
};

// Pressed state (button moves down and right to cover shadow)
const pressed3DButton: React.CSSProperties = {
  transform: `translate(${SHADOW_OFFSET}px, ${SHADOW_OFFSET}px)`,
  boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
  borderColor: '#404040', // Dark gray border when pressed
};

// Hover state (slight lift)
const hover3DButton: React.CSSProperties = {
  transform: 'translateY(-1px)',
  boxShadow: `${SHADOW_OFFSET}px ${SHADOW_OFFSET + 1}px 0 0 rgba(0, 0, 0, 1)`,
};

// Button variants
export const BUTTON_VARIANTS = {
  primary: {
    backgroundColor: '#2196F3',
    color: '#fff',
  },
  secondary: {
    backgroundColor: '#9E9E9E',
    color: '#fff',
  },
  success: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  danger: {
    backgroundColor: '#F44336',
    color: '#fff',
  },
  warning: {
    backgroundColor: '#FF9800',
    color: '#fff',
  },
  neutral: {
    backgroundColor: '#6C757D',
    color: '#fff',
  },
};

// Button sizes
export const BUTTON_SIZES_STYLES = {
  small: {
    padding: '10px 16px',
    minWidth: 60,
    minHeight: 40,
    fontSize: 14,
    boxShadow: `${SHADOW_OFFSET_SMALL}px ${SHADOW_OFFSET_SMALL}px 0 0 rgba(0, 0, 0, 1)`,
  },
  medium: {
    padding: '14px 24px',
    minWidth: 75,
    minHeight: 50,
    fontSize: 18,
    boxShadow: `${SHADOW_OFFSET}px ${SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`,
  },
  large: {
    padding: '18px 32px',
    minWidth: 100,
    minHeight: 60,
    fontSize: 24,
    boxShadow: `${SHADOW_OFFSET_LARGE}px ${SHADOW_OFFSET_LARGE}px 0 0 rgba(0, 0, 0, 1)`,
  },
};

// Disabled state
export const DISABLED_STYLE: React.CSSProperties = {
  backgroundColor: '#E0E0E0',
  color: '#9E9E9E',
  cursor: 'not-allowed',
  opacity: 0.5,
  boxShadow: `${SHADOW_OFFSET_SMALL}px ${SHADOW_OFFSET_SMALL}px 0 0 rgba(0, 0, 0, 0.3)`,
};

// Helper function to create 3D button style
export function create3DButtonStyle(
  variant: keyof typeof BUTTON_VARIANTS = 'primary',
  size: keyof typeof BUTTON_SIZES_STYLES = 'medium'
): Button3DStyle {
  const variantStyle = BUTTON_VARIANTS[variant];
  const sizeStyle = BUTTON_SIZES_STYLES[size];
  const shadowOffset = size === 'small' ? SHADOW_OFFSET_SMALL : size === 'large' ? SHADOW_OFFSET_LARGE : SHADOW_OFFSET;

  return {
    base: {
      ...base3DButton,
      ...variantStyle,
      ...sizeStyle,
      fontWeight: 'bold',
    },
    pressed: {
      ...pressed3DButton,
      transform: `translate(${shadowOffset}px, ${shadowOffset}px)`,
    },
    hover: {
      ...hover3DButton,
      boxShadow: `${shadowOffset}px ${shadowOffset + 1}px 0 0 rgba(0, 0, 0, 1)`,
    },
  };
}

// Shadow offset constants (rounded down to integers)
const DIGIT_BUTTON_SHADOW_OFFSET = 3; // Shadow for digit buttons
const OPERATION_UNDO_BUTTON_SHADOW_OFFSET = 2; // Lower shadow for operation and undo buttons

// Circular button style (for digit and operation buttons)
export function createCircular3DButtonStyle(
  size: number,
  backgroundColor: string,
  color: string = '#fff',
  shadowOffset: number = DIGIT_BUTTON_SHADOW_OFFSET // Default to digit button shadow, can be overridden
): Button3DStyle {
  return {
    base: {
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
      maxWidth: size,
      maxHeight: size,
      borderRadius: '50%',
      backgroundColor,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
      boxShadow: `${shadowOffset}px ${shadowOffset}px 0 0 rgba(0, 0, 0, 1)`,
      fontWeight: 'bold',
      aspectRatio: '1 / 1',
    },
    pressed: {
      transform: `translate(${shadowOffset}px, ${shadowOffset}px)`,
      boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
    },
    hover: {
      transform: 'translateY(-1px)',
      boxShadow: `${shadowOffset}px ${shadowOffset + 1}px 0 0 rgba(0, 0, 0, 1)`,
    },
  };
}

// Export shadow offset constants for use in components
export const SHADOW_OFFSETS = {
  DIGIT: DIGIT_BUTTON_SHADOW_OFFSET,
  OPERATION_UNDO: OPERATION_UNDO_BUTTON_SHADOW_OFFSET,
};

