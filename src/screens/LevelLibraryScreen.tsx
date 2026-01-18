import { Difficulty, Puzzle } from '../types';
import { getPuzzlesByDifficulty, getPuzzleKey } from '../utils';
import { FONT_SIZES, SPACING, COLORS, BUTTON_BORDER, BORDER_RADIUS } from '../constants/sizing';

interface LevelLibraryScreenProps {
  libraryTab: Difficulty;
  onTabChange: (tab: Difficulty) => void;
  onClose: () => void;
  onReturnToMenu: () => void;
  onSelectPuzzle: (difficulty: Difficulty, puzzle: Puzzle, index: number) => void;
  completedPuzzles: Set<string>;
  developerMode: boolean;
}

export default function LevelLibraryScreen({
  libraryTab,
  onTabChange,
  onClose,
  onReturnToMenu,
  onSelectPuzzle,
  completedPuzzles,
  developerMode,
}: LevelLibraryScreenProps) {
  const puzzles = getPuzzlesByDifficulty(libraryTab);

  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '20px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.MARGIN_LARGE,
      position: 'relative' as const,
    },
    title: {
      backgroundColor: COLORS.BACKGROUND_WHITE,
      padding: `${SPACING.PADDING_SMALL}px ${SPACING.PADDING_LARGE}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM}px`,
      fontSize: FONT_SIZES.TITLE * 0.7,
      fontFamily: 'Digital-7-Mono, monospace',
      color: COLORS.BACKGROUND_DARK,
      fontWeight: 'bold' as const,
      textAlign: 'center' as const,
      boxShadow: '3px 3px 0 0 rgba(0, 0, 0, 1)',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: SPACING.MARGIN_MEDIUM,
    },
    tab: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      cursor: 'pointer',
      fontSize: FONT_SIZES.DIFFICULTY_BUTTON,
    },
    puzzlesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
      overflowY: 'auto' as const,
    },
    puzzleCard: {
      width: '64px',
      height: '64px',
      borderRadius: '20px',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: FONT_SIZES.DIGIT_TEXT,
      fontFamily: 'Digital-7-Mono, monospace',
      fontWeight: 'bold' as const,
    },
    homeButton: {
      width: '40px',
      height: '40px',
      borderRadius: `${BORDER_RADIUS.MEDIUM}px`,
      backgroundColor: COLORS.BACKGROUND_WHITE,
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: COLORS.TEXT_SECONDARY,
      fontSize: '18px',
      boxShadow: '3px 3px 0 0 rgba(0, 0, 0, 1)',
      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div
          style={styles.homeButton}
          onClick={onReturnToMenu}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-1px, -1px)';
            e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '3px 3px 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translate(3px, 3px)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '3px 3px 0 0 rgba(0, 0, 0, 1)';
          }}
        >
          ←
        </div>
        <div style={styles.title}>LEVELS</div>
        <div
          style={styles.homeButton}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-1px, -1px)';
            e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '3px 3px 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translate(3px, 3px)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '3px 3px 0 0 rgba(0, 0, 0, 1)';
          }}
        >
          ✕
        </div>
      </div>
      <div style={styles.tabs}>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              backgroundColor: libraryTab === tab ? COLORS.DIFFICULTY_EASY : COLORS.BACKGROUND_WHITE,
              color: libraryTab === tab ? COLORS.TEXT_WHITE : COLORS.TEXT_BLACK,
            }}
            onClick={() => onTabChange(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={styles.puzzlesGrid}>
        {puzzles.map((puzzle, index) => {
          const puzzleKey = getPuzzleKey(libraryTab, index);
          const isCompleted = completedPuzzles.has(puzzleKey);
          const isLocked = !developerMode && index > 0 && !completedPuzzles.has(getPuzzleKey(libraryTab, index - 1));
          
          return (
            <div
              key={index}
              style={{
                ...styles.puzzleCard,
                backgroundColor: isLocked ? COLORS.BACKGROUND_DISABLED : (isCompleted ? COLORS.DIFFICULTY_EASY : COLORS.DIFFICULTY_HARD),
                color: isLocked ? COLORS.TEXT_DISABLED : COLORS.TEXT_WHITE,
                opacity: isLocked ? 0.6 : 1,
                cursor: isLocked ? 'not-allowed' : 'pointer',
              }}
              onClick={() => !isLocked && onSelectPuzzle(libraryTab, puzzle, index)}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

