import Gale from "./Gale.js";
import CellState from "./CellState.js";
import Cell from "./Cell.js";

class GUI {
    constructor() {
        this.game = null;
    }
    coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    printBoard(board) {
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < board.length; i++) {
            let tr = document.createElement("tr");
            tbody.appendChild(tr);
            for (let j = 0; j < board[i].length; j++) {
                let td = document.createElement("td");
                tr.appendChild(td);
                td.className = board[i][j];
                td.onclick = this.play.bind(this);
            }
        }
    }
    printPath(path) {
        let table = document.querySelector("table");
        path.forEach(({ x, y }, index) => {
            table.rows[x].cells[y].style.animationName = "path";
            table.rows[x].cells[y].textContent = index + 1;
        });
    }
    changeMessage(m) {
        let objs = { DRAW: "Draw!", PLAYER2: "Yellow's win!", PLAYER1: "Blue's win!" };
        if (objs[m]) {
            this.setMessage(`Game Over! ${objs[m]}`);
            let states = { PLAYER2: CellState.PLAYER2, PLAYER1: CellState.PLAYER1 };
            let path = [];
            this.game.checkPath(states[m], path);
            this.printPath(path);
        } else {
            let msgs = { PLAYER1: "Blue's turn.", PLAYER2: "Yellow's turn." };
            this.setMessage(msgs[this.game.getTurn()]);
        }
    }
    setMessage(message) {
        let msg = document.getElementById("message");
        msg.textContent = message;
    }
    init() {
        let iSize = document.getElementById("size");
        let iStart = document.getElementById("start");
        iSize.onchange = this.init.bind(this);
        iStart.onclick = this.init.bind(this);
        let size = parseInt(iSize.value);
        this.game = new Gale(size, size);
        let board = this.game.getBoard();
        this.printBoard(board);
        this.changeMessage();
    }
    play(evt) {
        let td = evt.currentTarget;
        try {
            let s = this.game.getTurn();
            let mr = this.game.move(this.coordinates(td));
            td.className = s;
            this.changeMessage(mr);
        } catch (ex) {
            this.setMessage(ex.message);
        }
    }
}
let gui = new GUI();
gui.init();