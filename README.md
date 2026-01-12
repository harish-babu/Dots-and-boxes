# Dots & Boxes

A classic pen-and-paper strategy game brought to life as a web application. Players take turns drawing lines between dots, competing to complete boxes and claim territory.

## Features

- **2-6 Players** - Play with friends on the same device
- **Customizable Grid** - Choose grid sizes from 6×6 to 12×12
- **Player Names** - Personalize each player's display name
- **Undo/Redo** - Made a mistake? Go back and try again
- **Sound Effects** - Audio feedback using Web Audio API (no external files)
- **Responsive Design** - Works on desktop and mobile browsers
- **No Installation Required** - Just open and play

## How to Play

1. **Setup**: Choose your grid size, number of players, and optionally customize player names
2. **Take Turns**: Click on the space between two dots to draw a line
3. **Complete Boxes**: When you draw the fourth side of a box, you claim it and get another turn
4. **Win**: The player with the most boxes when the grid is full wins

### Rules

- Players take turns drawing one line at a time
- Lines connect two adjacent dots (horizontally or vertically)
- Completing a box (drawing its 4th side) scores 1 point and grants a bonus turn
- You can complete multiple boxes in one turn if you keep closing them
- The game ends when all possible boxes are claimed

## Getting Started

### Quick Start

Simply open `index.html` in any modern web browser:

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Or double-click the `index.html` file in your file explorer.

### With a Local Server (Optional)

If you prefer running a local server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if http-server is installed)
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## Project Structure

```
dots-and-boxes/
├── index.html              # Main game file (self-contained, playable)
├── dots-and-boxes.jsx      # React component for artifact environments
├── dots-and-boxes-plan.md  # Original implementation plan
├── CLAUDE.md               # AI assistant guidance
└── README.md               # This file
```

### File Descriptions

| File | Purpose |
|------|---------|
| `index.html` | Complete game with embedded React, Babel, and Tailwind via CDN. Open directly in browser. |
| `dots-and-boxes.jsx` | Standalone React component that imports from `lucide-react`. For use in React environments like Claude artifacts. |

## Technical Details

### Dependencies (loaded via CDN)

- **React 18** - UI framework
- **Babel Standalone** - JSX transformation in browser
- **Tailwind CSS** - Utility-first styling

### Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- Web Audio API
- CSS Grid and Flexbox

### Architecture

The game uses React functional components with hooks:

- `useState` - Game state management
- `useCallback` - Memoized event handlers
- `useMemo` - Computed values like cell sizing

State includes:
- Grid configuration and player setup
- Line positions (horizontal and vertical arrays)
- Box ownership tracking
- Full move history for undo/redo

## Game Controls

| Control | Action |
|---------|--------|
| Click between dots | Draw a line |
| ↩️ Undo button | Undo last move |
| ↪️ Redo button | Redo undone move |
| 🔄 Reset button | Return to setup screen |
| 🔊 Sound button | Toggle sound effects |

## Customization

### Grid Size
- Minimum: 6×6 dots (25 boxes)
- Maximum: 12×12 dots (121 boxes)

### Players
- Minimum: 2 players
- Maximum: 6 players
- Each player has a unique color assigned automatically

### Player Colors

| Player | Color |
|--------|-------|
| 1 | Coral (#E63946) |
| 2 | Teal (#2A9D8F) |
| 3 | Amber (#E9C46A) |
| 4 | Violet (#9B5DE5) |
| 5 | Orange (#F77F00) |
| 6 | Blue (#4361EE) |

## Sound Effects

The game generates sounds programmatically using the Web Audio API:

- **Line Draw** - Quick ascending tone
- **Box Complete** - Triumphant three-note arpeggio
- **Game Over** - Celebratory four-note fanfare

Sounds can be muted using the speaker icon in the controls.

## License

This project is open source and available for personal and educational use.
