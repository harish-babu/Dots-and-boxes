# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dots & Boxes is a turn-based strategy game implemented as a single-page web application. Players take turns drawing lines between dots; completing the fourth side of a box claims it and grants another turn. The game ends when all boxes are filled.

## Running the Application

Open `index.html` directly in a browser - no build step or server required. The application uses CDN-hosted dependencies:
- React 18 (via unpkg)
- Babel standalone for JSX transformation
- Tailwind CSS (via CDN)

## Architecture

The codebase consists of two versions of the same application:

1. **`index.html`** - Self-contained HTML file with embedded JSX, includes inline SVG icon components. This is the playable version.

2. **`dots-and-boxes.jsx`** - Standalone React component that imports from `lucide-react`. Designed for use in React artifact environments.

### Key Data Structures

Lines are stored in separate 2D arrays:
- `horizontalLines[row][col]` - For a 6x6 grid: 6 rows × 5 columns
- `verticalLines[row][col]` - For a 6x6 grid: 5 rows × 6 columns
- `boxes[row][col]` - Stores player index (owner) or null
- `lineOwners` - Tracks which player drew each line for coloring

### State Management

All state is managed via React hooks (`useState`, `useCallback`, `useMemo`). The game supports:
- Undo/redo via history array with index pointer
- Sound effects using Web Audio API oscillators (no external audio files)

### Game Flow

Three phases controlled by `gamePhase` state:
1. `setup` - Grid size (6-12), player count (2-6), and player names
2. `playing` - Main game loop with turn management
3. `finished` - Winner display with play again option

### Box Completion Logic

When a line is drawn, `checkBoxCompleted()` checks adjacent boxes (up to 2 boxes per line). Completing a box keeps the current player's turn; otherwise, turn advances to the next player.
