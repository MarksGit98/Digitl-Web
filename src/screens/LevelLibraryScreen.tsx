import { Difficulty, Puzzle } from '../types';
import { getPuzzlesByDifficulty, getPuzzleKey } from '../utils';
import { FONT_SIZES, SPACING, COLORS, BUTTON_BORDER } from '../constants/sizing';

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
    },
    title: {
      fontSize: FONT_SIZES.TITLE,
      fontFamily: 'Digital-7-Mono, monospace',
      color: COLORS.TEXT_SUCCESS,
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
      width: '45px',
      height: '45px',
      borderRadius: '50%',
      backgroundColor: COLORS.BACKGROUND_DARK,
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: COLORS.TEXT_WHITE,
      fontSize: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.homeButton} onClick={onReturnToMenu}>🏠</div>
        <h1 style={styles.title}>LEVELS</h1>
        <div style={styles.homeButton} onClick={onClose}>✕</div>
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

