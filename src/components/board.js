import React from 'react';
import '../App.css';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: 6,
      columns: 7,
      grids: [],
      currentPlayer: 1 // player 1 is black
    };

    this.constructBoard();
  }
   
  render() {

    const Row = (props) => {
      return props.row.map((column, columnIndex) => {

        const id = props.rowindex.toString() + columnIndex;
        const grid = 
          <div className='grid' 
            key={columnIndex}
            id={id}
            onClick={event => this.setGrid(event, {row: props.rowindex, column:columnIndex})}>
          </div>;

        return grid;
      });
    }

    return (
      <div>
        <h3>BOARD</h3>
        {this.state.grids.map((row, rowIndex) => {
          return (
            <div key={rowIndex}>
              <Row row={row} rowindex={rowIndex}/>
            </div>
          )
        })}
      </div>
    )
  }

  /**
   * @desc Set the chip on the board
   */
  setGrid = (event, coordinates) => {
    // find bottom of column
    let bottomEmptyRow;
    let gridValue;
    let grid;
    let hasWinner;

    for( let row = this.state.rows -1; row !== 0; row--) {
      let coordinateValue = this.state.grids[row][coordinates.column];
      if(coordinateValue === 0) {
        bottomEmptyRow = row;
        coordinateValue = this.state.currentPlayer;
        break;
      }
    }

    // If no empty grid is found, return.
    if(!bottomEmptyRow){
      return;
    }

    // Set the value of the grid
    gridValue = this.state.grids[bottomEmptyRow][coordinates.column];

    // If the grid is empty, set the grid with the players chip and toggle players.
    if( gridValue === 0){
      const chipColor = this.state.currentPlayer === 1 ? 'red' : 'black';
      grid = document.getElementById(bottomEmptyRow.toString() + coordinates.column);
      this.state.grids[bottomEmptyRow][coordinates.column] = this.state.currentPlayer;
      
      grid.classList.add(chipColor);

      // check for winner
      hasWinner = this.checkForWinnder({row: bottomEmptyRow, column: coordinates.column});

      if(hasWinner) {
        const player = this.state.currentPlayer === 1 ? 'Red' : 'Black';
        const message = player + ' has won!';
        alert(message);
        window.location.reload();
      } else {
        this.state.currentPlayer = this.state.currentPlayer === 1 ? -1 : 1;
      }
    } 
  }

  /**
   * @desc Construct Board in HTML
   */
  constructBoard = () => {
    let grid = [];
    for(let row = 0; row < this.state.rows; row++) {
      for(let column = 0; column < this.state.columns; column++) {
        grid.push(0);
      }
      this.state.grids.push(grid);
      grid = [];
    }
  }

  /**
   * @desc Check for any winning combinations
   * @param {Object} coordinates 
   * @returns {Boolean}
   */
  checkForWinnder(coordinates) {
    return this.checkForVerticalMatches(coordinates) ||
      this.checkHorizontalMatches(coordinates);
  }

  /**
   * @desc Check for any horizontal winning combinations
   * @param {Object} coordinates 
   * @returns {Boolean}
   */
  checkHorizontalMatches(coordinates) {
    let winner = false;
    let sets = [];
  
    for(let col = 0; col <= 2; col++) {
      let start = col;
      let set = [];
      
      while(set.length < 4) {
        set.push(this.state.grids[coordinates.row][start]);
        start++;
      }
      sets.push(set);
    }

    for(let setIndex = 0; setIndex < sets.length; setIndex++) {
      let sum = sets[setIndex].reduce((a, b) => a + b, 0);
      if(sum === 4 || sum === -4) {
        winner = true;
        break;
      }
    }
    return winner;
  }

  /**
   * @desc Check for any vertical winning combinations
   * @param {Object} coordinates 
   * @returns {Boolean}
   */
  checkForVerticalMatches(coordinates) {
    let winner = false;
    let sets = [];
  
    for(let row = 0; row <= 2; row++) {
      let start = row;
      let set = [];
      
      while(set.length < 4) {
        set.push(this.state.grids[start][coordinates.column]);
        start++;
      }
      sets.push(set);
    }

    for(let setIndex = 0; setIndex < sets.length; setIndex++) {
      let sum = sets[setIndex].reduce((a, b) => a + b, 0);
      if(sum === 4 || sum === -4) {
        winner = true;
        break;
      }
    }
    return winner;
  }
}

export default Board;