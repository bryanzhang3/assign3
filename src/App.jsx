import { useState } from 'react';

function Square({ value, onSquareClick, highlighted }) {
  const className = 'square' + (highlighted ? ' highlighted' : '');
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isAdjacent(a, b) {
  if (a === b) return false;
  const ar = Math.floor(a / 3), ac = a % 3;
  const br = Math.floor(b / 3), bc = b % 3;
  return Math.abs(ar - br) <= 1 && Math.abs(ac - bc) <= 1;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [selected, setSelected] = useState(null);

  const winner = calculateWinner(squares);
  const currentPlayer = xIsNext ? 'X' : 'O';
  const currentPlayerCount = squares.filter((s) => s === currentPlayer).length;

  function handleClick(i) {
    if (winner) return;

    // Placement phase
    if (currentPlayerCount < 3) {
      if (squares[i] !== null) return;
      const next = squares.slice();
      next[i] = currentPlayer;
      setSquares(next);
      setXIsNext(!xIsNext);
      setSelected(null);
      return;
    }

    // Movement phase for first click: select one of your own pieces
    if (selected === null) {
      if (squares[i] === currentPlayer) setSelected(i);
      return;
    }

    // Movement phase for second click: must be an empty adjacent square
    if (squares[i] !== null || !isAdjacent(selected, i)) {
      setSelected(null);
      return;
    }

    const next = squares.slice();
    next[selected] = null;
    next[i] = currentPlayer;

    // Center rule: if the current player holds the center and isn't moving that center piece, the move must produce a win.
    if (squares[4] === currentPlayer && selected !== 4) {
      if (calculateWinner(next) !== currentPlayer) {
        setSelected(null);
        return;
      }
    }
    
    setSquares(next);
    setXIsNext(!xIsNext);
    setSelected(null);
  }

  const status = winner
    ? 'Winner: ' + winner
    : 'Next player: ' + currentPlayer;

  return (
    <>
      <div className="status">{status}</div>
      {[0, 3, 6].map((rowStart) => (
        <div key={rowStart} className="board-row">
          {[0, 1, 2].map((col) => {
            const i = rowStart + col;
            return (
              <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                highlighted={selected === i}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}