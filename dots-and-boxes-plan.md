# Dots & Boxes - Implementation Plan

## Game Overview

**Dots & Boxes** is a turn-based strategy game where players take turns drawing lines between adjacent dots. When a player completes the fourth side of a box, they claim it, score a point, and get another turn. The game ends when all boxes are filled.

---

## Requirements Summary

| Requirement | Choice |
|-------------|--------|
| **Platform** | Web-based (HTML/CSS/JS React) |
| **Players** | 2+ (selectable at start), human only |
| **Grid Size** | Default 6×6, configurable at start |
| **Visual Style** | Minimalist & clean, but playful |
| **Features** | Score tracking, undo/redo, sound effects, player name customization |
| **Goal** | Working game quickly |

---

## Technical Approach

**Single React JSX file** using:
- React with hooks for state management
- Tailwind CSS for styling
- Web Audio API for sound effects (generated programmatically, no external files)

---

## Architecture

### Data Structures

```
Grid: 6x6 dots = 5x5 boxes

Lines stored as:
- Horizontal lines: [row][col] where row 0-5, col 0-4 (6 rows × 5 cols = 30 lines)
- Vertical lines: [row][col] where row 0-4, col 0-5 (5 rows × 6 cols = 30 lines)

Box ownership: [row][col] → player index or null
```

### State Structure

```javascript
{
  // Game setup
  gamePhase: 'setup' | 'playing' | 'finished',
  gridSize: 6,  // dots per side
  players: [{ name: 'Player 1', color: '#E63946' }, ...],
  
  // Game state
  horizontalLines: boolean[][],  // which lines are drawn
  verticalLines: boolean[][],
  boxes: (number | null)[][],    // player index who owns each box
  currentPlayer: 0,
  scores: [0, 0, ...],
  
  // History for undo/redo
  history: [...past states],
  historyIndex: number
}
```

---

## Components Breakdown

```
<App>
├── <SetupScreen>          // Configure players, grid size, start game
│   ├── Grid size selector (4-8)
│   ├── Player count selector (2-4)
│   └── Player name inputs with color indicators
│
├── <GameBoard>            // Main game area
│   ├── <Dot>              // Corner dots
│   ├── <Line>             // Clickable horizontal/vertical lines
│   └── <Box>              // Filled boxes showing owner's color
│
├── <ScoreBoard>           // Current scores and turn indicator
│
├── <Controls>             // Undo, Redo, New Game, Sound toggle
│
└── <GameOverModal>        // Winner announcement, play again option
```

---

## Game Logic Flow

```
1. SETUP PHASE
   └── Select grid size → Enter player names → Start game

2. PLAYING PHASE (loop)
   ├── Display current player's turn
   ├── Player clicks an undrawn line
   ├── Check if any box(es) completed
   │   ├── YES → Award box(es), add to score, SAME player continues
   │   └── NO  → Switch to next player
   ├── Save state to history
   └── Check if all boxes filled → END GAME

3. FINISHED PHASE
   └── Show winner → Option to play again
```

---

## Features Implementation

| Feature | Approach |
|---------|----------|
| **Score tracking** | Array indexed by player, update on box completion |
| **Undo/Redo** | Store snapshots in history array, navigate with index |
| **Sound effects** | Web Audio API oscillator - different tones for: line draw, box complete, game over |
| **Player names** | Input fields in setup, stored in player objects |
| **Turn indicator** | Highlight current player in scoreboard, subtle animation |

---

## Visual Design (Minimalist + Playful)

- **Colors**: Soft background, distinct player colors (coral, teal, amber, violet)
- **Dots**: Small, subtle gray circles
- **Lines**: 
  - Undrawn: Faint dashed on hover
  - Drawn: Solid in the drawing player's color
- **Boxes**: Filled with owner's color (low opacity), initial "pop" animation
- **Typography**: Clean sans-serif, good contrast
- **Feedback**: Hover states, subtle transitions, current player glow

---

## File Deliverable

Single `dots-and-boxes.jsx` file that:
- Runs as a React artifact
- No external dependencies beyond what's available (React, Tailwind, Lucide icons)
- All sounds generated in-code
- Fully self-contained and playable immediately

---

## Estimated Complexity

| Component | Lines (approx) |
|-----------|----------------|
| Setup screen | 80 |
| Game board rendering | 150 |
| Game logic (moves, scoring) | 100 |
| Undo/redo system | 40 |
| Sound effects | 30 |
| Styling & animations | 50 |
| **Total** | **~450 lines** |

---

## Next Steps

1. Implement the React component with all features
2. Test with 2-4 players
3. Verify undo/redo functionality
4. Fine-tune sound effects and animations
