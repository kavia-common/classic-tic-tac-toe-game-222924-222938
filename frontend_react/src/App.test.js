import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Tic Tac Toe title and initial status", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /tic tac toe/i })).toBeInTheDocument();
  expect(screen.getByTestId("status")).toHaveTextContent(/turn:\s*x/i);
});

test("renders a 3x3 board (9 squares) and reset button", () => {
  render(<App />);

  // Squares are implemented as buttons.
  const squares = screen.getAllByRole("button", { name: /square/i });
  expect(squares).toHaveLength(9);

  expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
});
