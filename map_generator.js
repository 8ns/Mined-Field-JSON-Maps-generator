// creates <num> boards for Mined Field game with <dim>x<dim> dimensiom
function createMaps(num, dim) {
  // creates the list of maps
  let maps = [];
  for (let i = 0; i < num; i++) {
    // fills maps enties with randomly created boards JSON maps
    maps.push(createBoard(dim));
    showTest(maps[i]);
  }
  // transfer maps into a JSON file s.t. it can be loaded by the app
  fs.writeFile("maps.json", JSON.stringify(maps), function(error) {
    if (error) {
      return console.log(error);
    }
    console.log("File saved succesfully!\n");
  });
}

// returns a game board with <dim>x<dim> values, all initialized to the empty cell
const createBoard = (dim) => {
  let board = [];
  for (let i = 0; i < dim; i++) {
    board.push([]);
    let line = board[i];
    for (let j = 0; j < dim; j++) {
      line.push({ value: " " });
    }
  }
  // randomly sets proper amount of bombs
  board = setBombs(board, dim);
  // fills the other spaces with proper numbers
  board = fillWithNumbers(board);
  return board;
}

// returns a random number included between <start> value and <end> value, if no parameter is provided it will return a random value between 1 and 6
function getRandomNum(start, end) {
  let s = start || 1;
  let e = end || 6;
  return Math.floor(Math.random() * e) + s;
}

// clones the <board>, sets the value of <board.length> random cells to * (representing a bomb) and returns it
const setBombs = (board, dim) => {
  const newBoard = [...board];
  const markedCells = [{row: -1, col: -1}];
  for (let i = 0; i <= board.length; i++) {
    let line = getRandomNum(0, dim-1);
    let column = getRandomNum(0, dim-1);
    if (markedCells.find(item => {return item.row === line && item.col === column})) {
      i--;
    } else {
      newBoard[line][column].value = "*";
      markedCells.push({row: line, col: column});
    }
  }
  return newBoard;
}

// checks on the given <board> how many bombs are there in the surroundings of the cell in given <line> and <column>
// returns a count (if at least one is found) or a space
const checkSurroundings = (board, line, column) => {
  const newBoard = [...board];
  // surrounding indexes
  let leftColumn = column - 1;
  let rightColumn = column + 1;
  let upperLine = line - 1;
  let lowerLine = line + 1;
  let count = 0;

  // from now on all IFs are needed to validate the cell indexes
  if (leftColumn >= 0) {
    // checks left side of the same line
    if (board[line][leftColumn].value === "*") {
      count += 1;
    }
    if (lowerLine < newBoard.length) {
      // checks lower left corner cell
      if (board[lowerLine][leftColumn].value === "*") {
        count += 1;
      }
    }
    if (upperLine >= 0) {
      // checks upper left corner cell
      if (board[upperLine][leftColumn].value === "*") {
        count += 1;
      }
    }
  }
  if (rightColumn < newBoard[0].length) {
    // checks right side of the same line
    if (board[line][rightColumn].value === "*") {
      count += 1;
    }
    if (lowerLine < newBoard.length) {
      // checks lower right corner cell
      if (board[lowerLine][rightColumn].value === "*") {
        count += 1;
      }
    }
    if (upperLine >= 0) {
      // checks upper right cell
      if (board[upperLine][rightColumn].value === "*") {
        count += 1;
      }
    }
  }
  if (lowerLine < newBoard.length) {
    // checks lower cell on the same column
    if (board[lowerLine][column].value === "*") {
      count += 1;
    }
  }
  // checks upper cell on the same column
  if (upperLine >= 0) {
    if (board[upperLine][column].value === "*") {
      count += 1;
    }
  }
  return (count === 0 ? " " : count);
}

// fills the <board> with the numbers to identify how many bombs are there in the surroundings
const fillWithNumbers = (board) => {
  let newBoard = [...board];
  for (let i = 0; i < newBoard.length; i++) {
    let line = board[i];
    for (let j = 0; j < newBoard[0].length; j++) {
      let item = line[j];
      if (item.value !== "*") {
        item.value = "".concat(checkSurroundings(newBoard, i, j));
      }
    }
  }
  return newBoard;
}

// testing function to display in readable way the Mined Field boards
const showTest = (board) => {
  let lastLine = " " + " " + " " + " ";
  for (let i = 0; i < board.length; i++) {
    lastLine = lastLine.concat(i + " " + " " + " ");
    let line = board[i];
    let outputLine = i + ": ";
    for (let j = 0; j < line.length; j++) {
      let item = line[j];
      outputLine = outputLine.concat('|' + item.value + '| ');
    }
    console.log(outputLine);
    console.log("---------------------------------------");
  }
  console.log(lastLine);
}
