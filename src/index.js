import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return (
      <button className="square" 
      onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i, j) {
    return (
    <Square 
    value={this.props.squares[i][j]} 
    onClick={() => this.props.onClick(i, j)}
    />
    );
  }

  
  render() {

    let board = [];
    let i;
    for (i = 0; i < 3; i++) {

      let row = [];
      let j;
      for (j = 0; j < 3; j++) {
        row.push(this.renderSquare(i, j));
      }
      board.push(<div className="board-row">{row}</div>);
    }

    return (<div>{board}</div>);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      history: [{
        squares: Array(3).fill(Array(3).fill(null)),
        chosenSquare: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const row = squares[i].slice();
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }

    row[j] = this.state.xIsNext ? 'X' : 'O';
    squares[i] = row;
    this.setState({
      history: history.concat([{
        squares: squares,
        chosenSquare: 'Row: ' + i + ' Column: ' + j,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) { 
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const description = move ? 'Go to move #' + move : 'Go to game start';
      const position = step.chosenSquare;

      return (
      <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{description} {position}</button>
      </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          onClick={(i, j) => this.handleClick(i, j)}
          />

        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {

  var endIndex = 3 - 1;
  var firstDiagonalCheck = [];
  var secondDiagonalCheck = [];

  for (let i = 0; i < 3; i++) {

    var columnCheck = [];
    var rowCheck = [];

    for (let j = 0; j < 3; j++) {
      columnCheck.push(squares[i][j]);
      rowCheck.push(squares[j][i]);
    }

    if ( columnCheck.every( v => v === columnCheck[0]) ) {
      return columnCheck[0];
    }
    if ( rowCheck.every( v => v === rowCheck[0]) ) {
      return rowCheck[0];
    }

    firstDiagonalCheck.push(squares[i][i]);
    secondDiagonalCheck.push(squares[i][endIndex - i]);
  }

  if ( firstDiagonalCheck.every( v => v === firstDiagonalCheck[0]) ) {
      return firstDiagonalCheck[0];
  }
  if ( secondDiagonalCheck.every( v => v === secondDiagonalCheck[0]) ) {
      return secondDiagonalCheck[0];
  }

  return null;
}

// ========================================

 ReactDOM.render(
   <Game />,
     document.getElementById('root')
     );


