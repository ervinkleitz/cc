import React from 'react';
import '../App.css';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: 6,
      columns: 7,
      grids: [],
      currentPlayer: 1, // player 1 is black
      hasWinner: false
    };
  }

  componentDidMount() {
    this.constructBoard();
  }
   
  render() {

    return (
      <div>
        <h3>BOARD</h3>
        {this.state.hasWinner &&
          <h2>
            {this.state.currentPlayer === 1 ? 'BLACK' : 'RED'} player has WON!
          </h2>
        }

        <button onClick={() => this.restartGame()}>Restart Game</button>

        <div className='board'>
          {this.state.grids.map((row, rowIndex) => {
            return (
              <div key={rowIndex}>
                {row.map((column, columnIndex) => {
                  const id = rowIndex.toString() + columnIndex;
                  return  <div className='grid' 
                    key={id}
                    id={id}
                    onClick={() => 
                      this.setGrid({row: rowIndex, column:columnIndex})
                    }>
                  </div>;
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /**
   * @desc Set the chip on the board
   */
  setGrid = (coordinates) => {
    // Prevent any more actions when a winner has been found
    if(this.state.hasWinner){
      return;
    }
    // find bottom of column
    let bottomEmptyRow;
    let gridValue;
    let grid;

    for( let row = this.state.rows -1; row > -1; row--) {
      let coordinateValue = this.state.grids[row][coordinates.column];
      if(coordinateValue === 0) {
        bottomEmptyRow = row;
        coordinateValue = this.state.currentPlayer;
        break;
      }
    }

    // If no empty grid is found, return.
    if(bottomEmptyRow === undefined) {
      return;
    }

    // Set the value of the grid
    gridValue = this.state.grids[bottomEmptyRow][coordinates.column];

    // If the grid is empty, set the grid with the players chip and toggle players.
    if( gridValue === 0){
      const chipColor = this.state.currentPlayer === 1 ? 'red' : 'black';
      grid = document.getElementById(bottomEmptyRow.toString() + coordinates.column);
      grid.classList.add(chipColor);

      let _grids = this.state.grids;
      _grids[bottomEmptyRow][coordinates.column] = this.state.currentPlayer;
      
      this.setState({
        grids: _grids
      });

      // check for winner
      this.setState({
        hasWinner: this.checkForWinner({row: bottomEmptyRow, column: coordinates.column})
      }, () => {
        this.setState({
          currentPlayer: this.state.currentPlayer === 1 ? -1 : 1
        });
      });
    } 
  }

  /**
   * @desc Construct Board in HTML
   */
  constructBoard = () => {
    let grids = [];
    let grid = [];

    for(let row = 0; row < this.state.rows; row++) {
      for(let column = 0; column < this.state.columns; column++) {
        grid.push(0);
      }
      grids.push(grid);
      grid = [];
    }

    this.setState({
      grids: grids
    });
  }

  restartGame() {
    window.location.reload();
  }

  /**
   * @desc Check for any winning combinations
   * @param {Object} coordinates 
   * @returns {Boolean}
   */
  checkForWinner(coordinates) {
    return this.checkForVerticalMatches(coordinates) ||
      this.checkHorizontalMatches(coordinates) || 
      this.checkForDiagonalMatches(coordinates);
  }

  /**
   * @desc Check for any horizontal winning combinations
   * @param {Object} coordinates 
   * @returns {Boolean}
   */
  checkHorizontalMatches(coordinates) {
    let winner = false;
    let sets = [];
  
    for(let col = 0; col <= 3; col++) {
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

  /**
   * @desc Check for diagonal winning combinations
   * @param {Object} coordinates 
   */
  checkForDiagonalMatches(coordinates) {
    let winner = false;
    // list of sets, one going top to bottom from the left and
    // one going bottom to top also from the left
    let sets = []; 
    let set = [];
    let startRow;
    let startColumn;

    // find start of diagonal
    startRow = coordinates.row;
    startColumn = coordinates.column;
    // going upperleft
    while(
      this.state.grids[startRow] &&
      this.state.grids[startColumn]
    ){
      set.unshift(this.state.grids[startRow][startColumn]);
      startColumn--;
      startRow--;
    }

    // going lower left
    startRow = coordinates.row + 1;
    startColumn = coordinates.column + 1;
    while(
      this.state.grids[startRow] &&
      this.state.grids[startRow][startColumn]
    ){
      set.push(this.state.grids[startRow][startColumn]);
      startColumn++;
      startRow++;
    }
    // add set to list of sets
    sets.push(set);

    // going upper right
    startRow = coordinates.row;
    startColumn = coordinates.column;
    set = [];
    while(
      this.state.grids[startRow] &&
      this.state.grids[startColumn]
    ){
      set.push(this.state.grids[startRow][startColumn]);
      startColumn++;
      startRow--;
    }

    // going lower left
    startRow = coordinates.row;
    startColumn = coordinates.column;
    while(
      this.state.grids[startRow] &&
      this.state.grids[startRow][startColumn]
    ){
      set.unshift(this.state.grids[startRow][startColumn]);
      startColumn--;
      startRow++;
    }
    // add the diagonal (lower left to upper right) to the list of
    // sets to check for winning combos
    sets.push(set);

    // check all the combinations if any of them are winning combos
    for(let setIndex = 0; setIndex < sets.length; setIndex++) {
      let _set = sets[setIndex].slice();
      let position = 0;
      while(position + 3 < _set.length) {
        let setToCheck = _set.slice().splice(position, 4);
        let sum = setToCheck.reduce((a, b) => a + b, 0);
        if(sum === 4 || sum === -4) {
          winner = true;
          break;
        }
        position++;
      }
    }
    return winner;
  }
}

export default Board;