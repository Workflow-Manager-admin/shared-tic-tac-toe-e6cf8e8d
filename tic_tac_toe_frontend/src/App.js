import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * Main App component rendering a responsive, modern Tic Tac Toe game.
 * - 3x3 grid game board
 * - Player move selection
 * - Win/draw/game over detection
 * - Status message and restart button
 * - Minimalistic, light-themed modern UI, using accent (X), primary (O), secondary for highlights
 */
function App() {
  // State for board (9 cells: null | 'X' | 'O')
  const [board, setBoard] = useState(Array(9).fill(null));
  // 'X' starts first
  const [isXNext, setIsXNext] = useState(true);
  // 'X' or 'O' or null (if no winner)
  const [winner, setWinner] = useState(null);
  // Track if game ended in a draw
  const [isDraw, setIsDraw] = useState(false);

  // Effect to check win/draw after changes
  useEffect(() => {
    const win = calculateWinner(board);
    if (win) {
      setWinner(win);
      setIsDraw(false);
    } else if (board.every(cell => cell !== null)) {
      setIsDraw(true);
      setWinner(null);
    } else {
      setWinner(null);
      setIsDraw(false);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  // Handles a player's move
  function handleCellClick(idx) {
    // Don't allow move if occupied, or game over
    if (board[idx] || winner || isDraw) return;

    const newBoard = board.slice();
    newBoard[idx] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  }

  // PUBLIC_INTERFACE
  // Resets game state
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsDraw(false);
  }

  // Dynamic status message
  function getStatusMessage() {
    if (winner) {
      return `Player ${winner === 'X' ? '❌' : '⭕'} wins!`;
    } else if (isDraw) {
      return "It's a draw!";
    } else {
      return `Next move: Player ${isXNext ? '❌' : '⭕'}`;
    }
  }

  return (
    <div className="tictactoe-app">
      <h1 className="game-title">Tic Tac Toe</h1>
      <div className="game-status">{getStatusMessage()}</div>
      <div className="game-board">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className={`cell${cell === 'X' ? ' x' : cell === 'O' ? ' o' : ''}`}
            onClick={() => handleCellClick(idx)}
            aria-label={`Cell ${idx + 1}${cell ? `: ${cell}` : ''}`}
            disabled={Boolean(cell) || Boolean(winner) || isDraw}
            tabIndex={0}
          >
            <span>
              {cell === 'X' ? '❌' : cell === 'O' ? '⭕' : ''}
            </span>
          </button>
        ))}
      </div>
      <div className="controls">
        <button className="restart-btn" onClick={handleRestart}>
          Restart Game
        </button>
      </div>
      <footer className="brand-footer">
        <span className="accent">Made with <strong>Tic Tac Toe</strong></span>
      </footer>
      <style>{customCSS(themeColors)}</style>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Determines the winner: returns 'X', 'O', or null.
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];
  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Color palette per requirements
const themeColors = {
  accent: '#e74c3c',   // X's color, highlight
  primary: '#3498db',  // O's color
  secondary: '#2ecc71',// Button/hover/secondary
  boardBG: '#fafbfc',  // light neutral board bkg
  cellBorder: '#dedede',
  boardBorder: '#d1d8e0'
};

/**
 * Returns CSS as template string, using the provided color theme.
 */
function customCSS(c) {
  return `
.tictactoe-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${c.boardBG};
  color: #233045;
  font-family: 'Inter', system-ui, Arial, sans-serif;
  padding: 2rem 1rem;
  transition: background 0.3s;
}
.game-title {
  font-size: 2.5rem;
  margin-bottom: 0.2em;
  font-weight: 700;
  color: ${c.primary};
  letter-spacing: 1px;
}
.game-status {
  margin: 0.6em 0 1.2em 0;
  font-size: 1.34rem;
  font-weight: 500;
  min-height: 2em;
  color: #1a1a1a;
}
.game-board {
  display: grid;
  grid-template-columns: repeat(3, 64px);
  grid-template-rows: repeat(3, 64px);
  gap: 0.6em;
  background: #fff;
  border: 2.5px solid ${c.boardBorder};
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(80,120,200,0.09);
  margin-bottom: 1.5em;
  padding: 1.1em 1.1em 0.7em 1.1em;
}
.cell {
  width: 64px; height: 64px;
  font-size: 2.1rem;
  border: 1.6px solid ${c.cellBorder};
  border-radius: 10px;
  background: ${c.boardBG};
  color: #202c39;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.18s, color 0.13s, border 0.18s;
  font-weight: 700;
}
.cell.x span { color: ${c.accent}; }
.cell.o span { color: ${c.primary}; }
.cell:disabled { 
  cursor: default;
  background: #f5f6fa;
  opacity: .65;
}
.cell:focus {
  outline: 2.7px solid ${c.secondary};
  z-index: 2;
}
.controls {
  margin-top: 0.3em;
  display: flex;
  justify-content: center;
}
.restart-btn {
  padding: 0.6em 1.3em;
  background: ${c.secondary};
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 1.06rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 4px 0 rgba(120,170,80,0.05);
  letter-spacing: 0.5px;
  transition: background 0.16s, transform 0.15s;
}
.restart-btn:hover, .restart-btn:focus {
  background: ${c.primary};
  color: #fff;
  outline: none;
  transform: translateY(-1.3px) scale(1.035);
}
.brand-footer {
  margin: 2.2em 0 0.5em;
  font-size: 1rem;
  color: ${c.secondary};
  opacity: 0.62;
  font-weight: 400;
  letter-spacing: 0.5px;
}
.brand-footer .accent {
  color: ${c.accent};
}
/* Responsive design */
@media (max-width: 600px) {
  .game-title { font-size: 1.7rem; }
  .game-board {
    grid-template-columns: repeat(3, 46vw);
    grid-template-rows: repeat(3, 46vw);
    padding: 0.7em 0.3em 0.7em 0.3em;
  }
  .cell { width: 46vw; height: 46vw; font-size: 2.4rem;}
}
`.trim();
}

export default App;
