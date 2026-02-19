import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Determine winner and winning line (if any).
 * @param {Array<"X"|"O"|null>} board
 * @returns {{ winner: ("X"|"O"|null), winningLine: number[] | null }}
 */
function calculateWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: [a, b, c] };
    }
  }
  return { winner: null, winningLine: null };
}

/**
 * Whether the board has any empty squares left.
 * @param {Array<"X"|"O"|null>} board
 * @returns {boolean}
 */
function isBoardFull(board) {
  return board.every((cell) => cell !== null);
}

/**
 * Maps a numeric key press ("1".."9") to a board index.
 * The mapping is left-to-right, top-to-bottom.
 * @param {string} key
 * @returns {number|null}
 */
function keyToIndex(key) {
  if (!/^[1-9]$/.test(key)) return null;
  return Number(key) - 1;
}

// PUBLIC_INTERFACE
function App() {
  /** @type {[Array<"X"|"O"|null>, Function]} */
  const [board, setBoard] = useState(Array(9).fill(null));
  /** @type {[("X"|"O"), Function]} */
  const [nextPlayer, setNextPlayer] = useState("X");

  const { winner, winningLine } = useMemo(() => calculateWinner(board), [board]);
  const isDraw = !winner && isBoardFull(board);
  const isGameOver = Boolean(winner) || isDraw;

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    // Lock board after game ends and prevent overwriting moves.
    if (isGameOver || board[index]) return;

    setBoard((prev) => {
      const copy = [...prev];
      copy[index] = nextPlayer;
      return copy;
    });
    setNextPlayer((p) => (p === "X" ? "O" : "X"));
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setNextPlayer("X");
  };

  // Keyboard shortcuts:
  // - Press 1..9 to place a mark (if allowed)
  // - Press R to reset
  useEffect(() => {
    const onKeyDown = (e) => {
      // Avoid interfering with typing in any future inputs
      if (e.target && /** @type {HTMLElement} */ (e.target).tagName) {
        const tag = /** @type {HTMLElement} */ (e.target).tagName.toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return;
      }

      if (e.key === "r" || e.key === "R") {
        resetGame();
        return;
      }

      const idx = keyToIndex(e.key);
      if (idx === null) return;
      handleSquareClick(idx);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // Intentionally include relevant deps so shortcuts match current game state.
  }, [board, isGameOver, nextPlayer, winningLine]);

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
      ? "It's a draw!"
      : `Turn: ${nextPlayer}`;

  const subStatusText = winner
    ? "Game over. Hit RESET to play again."
    : isDraw
      ? "No more moves. Hit RESET for a rematch."
      : "Tip: press 1–9 to play, or R to reset.";

  const nextUpText = !isGameOver ? `Next up: ${nextPlayer}` : "Match complete";

  return (
    <div className="App">
      <main className="ttt" aria-label="Tic Tac Toe game">
        <header className="ttt__header">
          <div className="ttt__titleBlock">
            <h1 className="ttt__title">Tic Tac Toe</h1>
            <p className="ttt__tagline">Retro arcade edition</p>
          </div>

          <div className="ttt__status" aria-live="polite" aria-atomic="true">
            <div className="ttt__statusMain" data-testid="status">
              {statusText}
            </div>
            <div className="ttt__statusSub">{subStatusText}</div>

            <div className="ttt__statusHint" aria-hidden="true">
              {nextUpText}
            </div>
          </div>
        </header>

        <section className="ttt__boardWrap" aria-label="Game board">
          <div className="ttt__board" role="grid" aria-label="Tic Tac Toe board">
            {board.map((value, idx) => {
              const isWinningSquare = winningLine?.includes(idx) ?? false;
              const isDisabled = isGameOver || Boolean(value);

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "ttt__square",
                    value ? "ttt__square--filled" : "",
                    value === "X" ? "ttt__square--x" : "",
                    value === "O" ? "ttt__square--o" : "",
                    isWinningSquare ? "ttt__square--win" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  disabled={isDisabled}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}${value ? `, ${value}` : ""}${
                    isWinningSquare ? ", winning square" : ""
                  }`}
                  aria-disabled={isDisabled ? "true" : "false"}
                >
                  <span className="ttt__mark" aria-hidden="true">
                    {value ?? ""}
                  </span>
                  <span className="ttt__srOnly">
                    {value
                      ? `Filled with ${value}.`
                      : `Empty. Press ${idx + 1} or click to place ${nextPlayer}.`}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <footer className="ttt__footer">
          <button className="ttt__btn" type="button" onClick={resetGame}>
            RESET
          </button>

          <div className="ttt__legend" aria-label="Legend">
            <span className="ttt__legendItem">
              <span className="ttt__chip ttt__chip--x" aria-hidden="true">
                X
              </span>
              Player 1
            </span>
            <span className="ttt__legendItem">
              <span className="ttt__chip ttt__chip--o" aria-hidden="true">
                O
              </span>
              Player 2
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
