import CellState from "./CellState.js";
import Cell from "./Cell.js";
import Player from "./Player.js";
import Winner from "./Winner.js";

export default class Gale {
    constructor(nrows, ncols) {
        this.rows = nrows;
        this.cols = ncols;
        this.board = this.startBoard();
        this.turn = Player.PLAYER1;    
    }
    startBoard() {
        let matrix = Array(this.rows).fill().map(() => Array(this.cols).fill(CellState.EMPTY));
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (i % 2 === 0 && j % 2 === 1) {
                    matrix[i][j] = CellState.PLAYER1;
                }
                if (i % 2 === 1 && j % 2 === 0) {
                    matrix[i][j] = CellState.PLAYER2;
                }
            }
        }
        return matrix;
    }
    getBoard() {
        return this.board;
    }
    move(endCell) {
        let { x, y } = endCell;
        if (!endCell) {
            throw new Error("The cell does not exist.");
        }
        if (!this.onBoard(endCell)) {
            throw new Error("The cell is not on the board.");
        }
        if (this.board[x][y] !== CellState.EMPTY) {
            throw new Error("The cell is not empty.");
        }
        this.board[x][y] = (this.turn === Player.PLAYER1) ? CellState.PLAYER1 : CellState.PLAYER2;
        this.turn = this.turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
        return this.endOfGame();
    }
    endOfGame() {
        if (this.checkPath(CellState.PLAYER1)) {
            return Winner.PLAYER1;
        } else if (this.checkPath(CellState.PLAYER2)) {
            return Winner.PLAYER2;
        } else {
            let countEmptySpaces = this.board.flat().filter(cs => cs === CellState.EMPTY).length;
            if (countEmptySpaces === 0) {
                return Winner.DRAW;
            }
        }
        return Winner.NONE;
    }
    checkPath(player, path = []) {
        if (player === CellState.PLAYER1) {
            for (let i = 0; i < this.board[0].length; i++) {
                if (this.board[0][i] === player && this.checkSpace(new Cell(0, i), player, path)) {
                    return true;
                }
            }
        }
        if (player === CellState.PLAYER2) {
            for (let i = 0; i < this.board.length; i++) {
                if (this.board[i][0] === player && this.checkSpace(new Cell(i, 0), player, path)) {
                    return true;
                }
            }
        }
        return false;
    }
    checkSpace(cCell, player, path = []) {
        path.push(cCell);
        let { x: row, y: col } = cCell;
        let coords = [new Cell(row - 1, col), new Cell(row + 1, col), new Cell(row, col - 1), new Cell(row, col + 1)];
        for (let i = 0; i < coords.length; i++) {
            let { x, y } = coords[i];
            let cells = path.filter(c => c.equals(coords[i]));
            if (cells.length === 0 && this.onBoard(coords[i]) && this.board[x][y] === player) {
                if (player === CellState.PLAYER1 && x === this.rows - 1) {
                    path.push(coords[i]);
                    return true;
                }
                if (player === CellState.PLAYER2 && y === this.cols - 1) {
                    path.push(coords[i]);
                    return true;
                }
                if (this.checkSpace(coords[i], player, path)) {
                    return true;
                }
            }
        }
        path.pop();
        return false;
    }
    getTurn() {
        return this.turn;
    }
    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return inLimit(x, this.rows) && inLimit(y, this.cols);
    }
}