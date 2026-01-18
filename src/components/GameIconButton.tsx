import React from 'react';
import { FONT_SIZES, SPACING, COLORS, BUTTON_BORDER, BORDER_RADIUS } from '../constants/sizing';
import homeSvg from '../assets/svgs/home.svg';

// Calculate button size to match game screen title row
const titleFontSize = FONT_SIZES.TITLE * 0.5407479;
const titleVerticalPadding = SPACING.PADDING_MEDIUM * 0.421362;
const BUTTON_SIZE = titleFontSize + (titleVerticalPadding * 2) + (BUTTON_BORDER.WIDTH * 2);
const ICON_SIZE = BUTTON_SIZE * 0.5;

const SHADOW_OFFSET = 3;
const SHADOW_HOVER_OFFSET = 4;

interface GameIconButtonProps {
  href?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function GameIconButton({
  href = '/',
  onClick,
  style,
}: GameIconButtonProps) {
  const buttonStyle: React.CSSProperties = {
    width: `${BUTTON_SIZE}px`,
    height: `${BUTTON_SIZE}px`,
    minWidth: `${BUTTON_SIZE}px`,
    minHeight: `${BUTTON_SIZE}px`,
    maxWidth: `${BUTTON_SIZE}px`,
    maxHeight: `${BUTTON_SIZE}px`,
    borderRadius: `${BORDER_RADIUS.MEDIUM * 0.918}px`,
    backgroundColor: COLORS.BACKGROUND_WHITE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
    padding: 0,
    boxShadow: `${SHADOW_OFFSET}px ${SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`,
    transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    textDecoration: 'none',
    flexShrink: 0,
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'translate(-1px, -1px)';
    e.currentTarget.style.boxShadow = `${SHADOW_HOVER_OFFSET}px ${SHADOW_HOVER_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'translate(0, 0)';
    e.currentTarget.style.boxShadow = `${SHADOW_OFFSET}px ${SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = `translate(${SHADOW_OFFSET}px, ${SHADOW_OFFSET}px)`;
    e.currentTarget.style.boxShadow = 'none';
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'translate(0, 0)';
    e.currentTarget.style.boxShadow = `${SHADOW_OFFSET}px ${SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
  };

  return (
    <a
      href={href}
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <img
        src={homeSvg}
        alt="Home"
        width={ICON_SIZE}
        height={ICON_SIZE}
        style={{ display: 'block', pointerEvents: 'none' }}
      />
    </a>
  );
}
