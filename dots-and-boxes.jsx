import React, { useState, useCallback, useMemo } from 'react';
import { Volume2, VolumeX, Undo2, Redo2, RotateCcw } from 'lucide-react';

// Player colors
const PLAYER_COLORS = ['#E63946', '#2A9D8F', '#E9C46A', '#9B5DE5', '#F77F00', '#4361EE'];
const PLAYER_BG_COLORS = ['rgba(230, 57, 70, 0.3)', 'rgba(42, 157, 143, 0.3)', 'rgba(233, 196, 106, 0.3)', 'rgba(155, 93, 229, 0.3)', 'rgba(247, 127, 0, 0.3)', 'rgba(67, 97, 238, 0.3)'];

// Sound effects using Web Audio API
const playSound = (type, enabled) => {
  if (!enabled) return;

  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'line':
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'box':
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'gameOver':
        oscillator.type = 'triangle';
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.15);
        });
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.6);
        break;
      default:
        break;
    }
  } catch (e) {
    console.log('Audio not supported');
  }
};

// Setup Screen Component
const SetupScreen = ({ onStartGame }) => {
  const [gridSize, setGridSize] = useState(6);
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6']);

  const handleStart = () => {
    const players = playerNames.slice(0, playerCount).map((name, i) => ({
      name: name || `Player ${i + 1}`,
      color: PLAYER_COLORS[i],
      bgColor: PLAYER_BG_COLORS[i]
    }));
    onStartGame(gridSize, players);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">Dots & Boxes</h1>

        <div className="space-y-6">
          {/* Grid Size */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Grid Size</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="6"
                max="12"
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
              />
              <span className="text-lg font-semibold text-slate-800 w-16 text-center">{gridSize}×{gridSize}</span>
            </div>
          </div>

          {/* Player Count */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Players</label>
            <div className="flex gap-2 flex-wrap">
              {[2, 3, 4, 5, 6].map(count => (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    playerCount === count
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Player Names */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Player Names</label>
            <div className="space-y-2">
              {Array.from({ length: playerCount }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PLAYER_COLORS[i] }}
                  />
                  <input
                    type="text"
                    value={playerNames[i]}
                    onChange={(e) => {
                      const newNames = [...playerNames];
                      newNames[i] = e.target.value;
                      setPlayerNames(newNames);
                    }}
                    placeholder={`Player ${i + 1}`}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

// Game Over Modal
const GameOverModal = ({ players, scores, onPlayAgain, onNewGame }) => {
  const maxScore = Math.max(...scores);
  const winners = players.filter((_, i) => scores[i] === maxScore);
  const isTie = winners.length > 1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 animate-bounce-in">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">
          {isTie ? "It's a Tie!" : `${winners[0].name} Wins!`}
        </h2>

        <div className="space-y-2 mb-6">
          {players.map((player, i) => (
            <div
              key={i}
              className={`flex justify-between items-center p-3 rounded-lg ${
                scores[i] === maxScore ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: player.color }}
                />
                <span className="font-medium">{player.name}</span>
              </div>
              <span className="font-bold text-lg">{scores[i]}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={onNewGame}
            className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Game Component
const DotsAndBoxes = () => {
  const [gamePhase, setGamePhase] = useState('setup');
  const [gridSize, setGridSize] = useState(6);
  const [players, setPlayers] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Game state
  const [horizontalLines, setHorizontalLines] = useState([]);
  const [verticalLines, setVerticalLines] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState([]);

  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize game state
  const initializeGame = useCallback((size, playerList) => {
    const boxCount = size - 1;
    const hLines = Array(size).fill(null).map(() => Array(boxCount).fill(false));
    const vLines = Array(boxCount).fill(null).map(() => Array(size).fill(false));
    const boxState = Array(boxCount).fill(null).map(() => Array(boxCount).fill(null));
    const initialScores = Array(playerList.length).fill(0);

    setGridSize(size);
    setPlayers(playerList);
    setHorizontalLines(hLines);
    setVerticalLines(vLines);
    setBoxes(boxState);
    setCurrentPlayer(0);
    setScores(initialScores);
    setHistory([]);
    setHistoryIndex(-1);
    setGamePhase('playing');
  }, []);

  // Save state to history
  const saveToHistory = useCallback((hLines, vLines, boxState, player, scoreState) => {
    const newState = {
      horizontalLines: JSON.parse(JSON.stringify(hLines)),
      verticalLines: JSON.parse(JSON.stringify(vLines)),
      boxes: JSON.parse(JSON.stringify(boxState)),
      currentPlayer: player,
      scores: [...scoreState]
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Check if a box is completed
  const checkBoxCompleted = useCallback((row, col, hLines, vLines) => {
    const top = hLines[row]?.[col] ?? false;
    const bottom = hLines[row + 1]?.[col] ?? false;
    const left = vLines[row]?.[col] ?? false;
    const right = vLines[row]?.[col + 1] ?? false;
    return top && bottom && left && right;
  }, []);

  // Handle line click
  const handleLineClick = useCallback((type, row, col) => {
    if (gamePhase !== 'playing') return;

    const isHorizontal = type === 'horizontal';
    const lines = isHorizontal ? horizontalLines : verticalLines;

    if (lines[row][col]) return; // Already drawn

    playSound('line', soundEnabled);

    // Draw the line
    const newLines = lines.map(r => [...r]);
    newLines[row][col] = true;

    const newHLines = isHorizontal ? newLines : horizontalLines;
    const newVLines = isHorizontal ? verticalLines : newLines;

    // Check for completed boxes
    let completedBoxes = [];
    const boxCount = gridSize - 1;

    if (isHorizontal) {
      // Check box above
      if (row > 0 && checkBoxCompleted(row - 1, col, newHLines, newVLines)) {
        completedBoxes.push([row - 1, col]);
      }
      // Check box below
      if (row < boxCount && checkBoxCompleted(row, col, newHLines, newVLines)) {
        completedBoxes.push([row, col]);
      }
    } else {
      // Check box to the left
      if (col > 0 && checkBoxCompleted(row, col - 1, newHLines, newVLines)) {
        completedBoxes.push([row, col - 1]);
      }
      // Check box to the right
      if (col < boxCount && checkBoxCompleted(row, col, newHLines, newVLines)) {
        completedBoxes.push([row, col]);
      }
    }

    // Update boxes and scores
    const newBoxes = boxes.map(r => [...r]);
    const newScores = [...scores];

    completedBoxes.forEach(([bRow, bCol]) => {
      if (newBoxes[bRow][bCol] === null) {
        newBoxes[bRow][bCol] = currentPlayer;
        newScores[currentPlayer]++;
      }
    });

    if (completedBoxes.length > 0) {
      playSound('box', soundEnabled);
    }

    // Update state
    if (isHorizontal) {
      setHorizontalLines(newLines);
    } else {
      setVerticalLines(newLines);
    }
    setBoxes(newBoxes);
    setScores(newScores);

    // Determine next player
    const nextPlayer = completedBoxes.length > 0 ? currentPlayer : (currentPlayer + 1) % players.length;
    setCurrentPlayer(nextPlayer);

    // Save to history
    saveToHistory(newHLines, newVLines, newBoxes, nextPlayer, newScores);

    // Check for game over
    const totalBoxes = boxCount * boxCount;
    const filledBoxes = newBoxes.flat().filter(b => b !== null).length;

    if (filledBoxes === totalBoxes) {
      playSound('gameOver', soundEnabled);
      setGamePhase('finished');
    }
  }, [gamePhase, horizontalLines, verticalLines, boxes, scores, currentPlayer, gridSize, players.length, soundEnabled, checkBoxCompleted, saveToHistory]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;

    const prevState = history[historyIndex - 1];
    setHorizontalLines(prevState.horizontalLines);
    setVerticalLines(prevState.verticalLines);
    setBoxes(prevState.boxes);
    setCurrentPlayer(prevState.currentPlayer);
    setScores(prevState.scores);
    setHistoryIndex(prev => prev - 1);
  }, [history, historyIndex]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const nextState = history[historyIndex + 1];
    setHorizontalLines(nextState.horizontalLines);
    setVerticalLines(nextState.verticalLines);
    setBoxes(nextState.boxes);
    setCurrentPlayer(nextState.currentPlayer);
    setScores(nextState.scores);
    setHistoryIndex(prev => prev + 1);
  }, [history, historyIndex]);

  // Play again with same settings
  const handlePlayAgain = useCallback(() => {
    initializeGame(gridSize, players);
  }, [gridSize, players, initializeGame]);

  // New game (back to setup)
  const handleNewGame = useCallback(() => {
    setGamePhase('setup');
  }, []);

  // Calculate cell size based on grid
  const cellSize = useMemo(() => {
    const maxSize = Math.min(window.innerWidth - 80, 700);
    const calculated = Math.floor(maxSize / gridSize);
    return Math.max(calculated, 50); // Minimum 50px per cell
  }, [gridSize]);

  if (gamePhase === 'setup') {
    return <SetupScreen onStartGame={initializeGame} />;
  }

  const boxCount = gridSize - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center py-6 px-4">
      {/* Header */}
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Dots & Boxes</h1>

      {/* Score Board */}
      <div className="flex gap-4 mb-6 flex-wrap justify-center">
        {players.map((player, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              currentPlayer === i ? 'ring-2 ring-offset-2 scale-105' : ''
            }`}
            style={{
              backgroundColor: player.bgColor,
              ringColor: player.color
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: player.color }}
            />
            <span className="font-medium text-slate-700">{player.name}</span>
            <span className="font-bold text-lg ml-2">{scores[i]}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleUndo}
          disabled={historyIndex <= 0}
          className="p-2 rounded-lg bg-white shadow hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Undo"
        >
          <Undo2 size={20} className="text-slate-600" />
        </button>
        <button
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
          className="p-2 rounded-lg bg-white shadow hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Redo"
        >
          <Redo2 size={20} className="text-slate-600" />
        </button>
        <button
          onClick={handleNewGame}
          className="p-2 rounded-lg bg-white shadow hover:bg-slate-50 transition-all"
          title="New Game"
        >
          <RotateCcw size={20} className="text-slate-600" />
        </button>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg bg-white shadow hover:bg-slate-50 transition-all"
          title={soundEnabled ? 'Mute' : 'Unmute'}
        >
          {soundEnabled ? (
            <Volume2 size={20} className="text-slate-600" />
          ) : (
            <VolumeX size={20} className="text-slate-400" />
          )}
        </button>
      </div>

      {/* Game Board */}
      <div
        className="relative bg-white rounded-2xl shadow-lg"
        style={{
          width: (gridSize - 1) * cellSize + 48,
          height: (gridSize - 1) * cellSize + 48
        }}
      >
        {/* Boxes */}
        {Array.from({ length: boxCount }).map((_, row) =>
          Array.from({ length: boxCount }).map((_, col) => (
            <div
              key={`box-${row}-${col}`}
              className="absolute transition-all duration-300"
              style={{
                left: col * cellSize + 24 + 8,
                top: row * cellSize + 24 + 8,
                width: cellSize - 16,
                height: cellSize - 16,
                backgroundColor: boxes[row][col] !== null ? players[boxes[row][col]].bgColor : 'transparent',
                borderRadius: 4,
                transform: boxes[row][col] !== null ? 'scale(1)' : 'scale(0.8)',
                opacity: boxes[row][col] !== null ? 1 : 0
              }}
            />
          ))
        )}

        {/* Horizontal Lines */}
        {Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: boxCount }).map((_, col) => (
            <div
              key={`h-${row}-${col}`}
              onClick={() => handleLineClick('horizontal', row, col)}
              className={`absolute cursor-pointer transition-all group ${
                horizontalLines[row]?.[col] ? '' : 'hover:opacity-100'
              }`}
              style={{
                left: col * cellSize + 24 + 8,
                top: row * cellSize + 24 - 6,
                width: cellSize - 16,
                height: 12,
              }}
            >
              <div
                className={`absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full transition-all ${
                  horizontalLines[row]?.[col]
                    ? 'h-1.5'
                    : 'h-1 bg-slate-200 group-hover:bg-slate-400 group-hover:h-1.5'
                }`}
                style={{
                  backgroundColor: horizontalLines[row]?.[col]
                    ? players[currentPlayer]?.color || PLAYER_COLORS[0]
                    : undefined
                }}
              />
            </div>
          ))
        )}

        {/* Vertical Lines */}
        {Array.from({ length: boxCount }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => (
            <div
              key={`v-${row}-${col}`}
              onClick={() => handleLineClick('vertical', row, col)}
              className={`absolute cursor-pointer transition-all group ${
                verticalLines[row]?.[col] ? '' : 'hover:opacity-100'
              }`}
              style={{
                left: col * cellSize + 24 - 6,
                top: row * cellSize + 24 + 8,
                width: 12,
                height: cellSize - 16,
              }}
            >
              <div
                className={`absolute inset-y-0 left-1/2 -translate-x-1/2 rounded-full transition-all ${
                  verticalLines[row]?.[col]
                    ? 'w-1.5'
                    : 'w-1 bg-slate-200 group-hover:bg-slate-400 group-hover:w-1.5'
                }`}
                style={{
                  backgroundColor: verticalLines[row]?.[col]
                    ? players[currentPlayer]?.color || PLAYER_COLORS[0]
                    : undefined
                }}
              />
            </div>
          ))
        )}

        {/* Dots */}
        {Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => (
            <div
              key={`dot-${row}-${col}`}
              className="absolute w-3 h-3 bg-slate-400 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{
                left: col * cellSize + 24,
                top: row * cellSize + 24
              }}
            />
          ))
        )}
      </div>

      {/* Current Turn Indicator */}
      <div className="mt-6 text-center">
        <span className="text-slate-500">Current turn: </span>
        <span
          className="font-semibold"
          style={{ color: players[currentPlayer]?.color }}
        >
          {players[currentPlayer]?.name}
        </span>
      </div>

      {/* Game Over Modal */}
      {gamePhase === 'finished' && (
        <GameOverModal
          players={players}
          scores={scores}
          onPlayAgain={handlePlayAgain}
          onNewGame={handleNewGame}
        />
      )}

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DotsAndBoxes;
