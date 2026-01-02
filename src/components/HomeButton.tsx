import React from 'react';
import { FONT_SIZES, NUMERIC_CONSTANTS } from '../constants/sizing';
import CircularIconButton from './CircularIconButton';

interface HomeButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function HomeButton({
  onPress,
  disabled = false,
  style,
}: HomeButtonProps) {
  const iconSize = FONT_SIZES.BUTTON_TEXT * NUMERIC_CONSTANTS.FONT_MULTIPLIER_NAV_ARROW;

  return (
    <CircularIconButton
      onPress={onPress}
      disabled={disabled}
      style={style}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 122.88 112.07"
        style={{ display: 'block' }}
      >
        <path
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M61.44,0L0,60.18l14.99,7.87L61.04,19.7l46.85,48.36l14.99-7.87L61.44,0L61.44,0z M18.26,69.63L18.26,69.63 L61.5,26.38l43.11,43.25h0v0v42.43H73.12V82.09H49.49v29.97H18.26V69.63L18.26,69.63L18.26,69.63z"
        />
      </svg>
    </CircularIconButton>
  );
}

