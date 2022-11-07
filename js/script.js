/*----- constants -----*/
const colors = {
    'null':'lightgray', 
    '1': 'black', // for black player 
    '-1': 'red' // for red player
}

/*----- app's state (variables) -----*/
let board = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
]
// console.log(board)

let score = []

let turn

let winner

let selectedCoords
let landingCoords

/*----- cached element references -----*/
let gameboardEl = document.getElementById('gameboard')
let squaresEl = document.querySelectorAll('.square')
let scoreEl = document.querySelectorAll('.bothScore')
let selectedEl = null;


/*----- event listeners -----*/
gameboardEl.addEventListener('click', handleClick)

function handleClick(evt) {
  let clickedEl = evt.target

  // console.log(clickedEl)
  let isSq = clickedEl.classList.contains('square')
  let isPieceSq = clickedEl.classList.contains('pieceSq')
  let isPiece = clickedEl.classList.contains('piece')
  let isPieceLabel = clickedEl.classList.contains('pieceLabel')

  // console.log(`square: ${isSq}`)
  // console.log(`piece: ${isPiece}`)
  // console.log(`piece mark: ${isPieceMark}`)
  // console.log(!evt.target.classList.contains('square'))
  // console.log(`${isSq || isPiece || isPieceMark}`)
  if (!(isSq || isPieceSq || isPiece || isPieceLabel)) return

  // retrieve coordinates of the selected piece or square
  let strCoords = []
  let clickedSqEl
  if (isSq) clickedSqEl = clickedEl
  if (isPieceSq) clickedSqEl = clickedEl.parentElement
  if (isPiece) clickedSqEl = clickedEl.parentElement.parentElement
  if (isPieceLabel) clickedSqEl = clickedEl.parentElement.parentElement.parentElement
  strCoords = clickedSqEl.id.split('-')
  
  // set background color
  // console.log(clickedSqEl.firstElementChild)
  // console.log(clickedSqEl.firstElementChild.style.backgroundColor)
  // let clickedSqColor = clickedSqEl.firstElementChild.style.backgroundColor
  // console.log(`bgcolor: ${clickedSqColor}`)
  // if (clickedSqColor ===)
  // selectedEl = clickedEl

  // console.log(clickedSqEl.firstElementChild.style.backgroundColor)
  // clickedSqEl.firstElementChild.style.backgroundColor = "transparent"
  // console.log(clickedSqEl.firstElementChild.style.backgroundColor)
  // clickedSqEl.firstElementChild.style.backgroundColor = ""

  // turn coordinates from array of strings into array of numbers
  let numCoords = []
  strCoords.forEach((strCoord) => numCoords.push(parseInt(strCoord, 10)))

  // select a piece
  // if clicked square contains a piece
  
  // if (a piece has not been selected)
  //    immediately return if the square does not contain a piece
  //    immediately return if the piece cannot be selected
  //    select the piece if the piece can be selected
  // else (a piece has been selected)
  //    immediately return if the landing square cannot be moved into
  //    move the piece if the landing square can be moved into

  console.log(!selectedEl)
  console.log(!selectedCoords)
  if (!selectedCoords) { // no piece has yet been selected
    
    // the square does not contain a piece, so immediately return
    if (!clickedSqEl.firstElementChild.firstElementChild) return

    // the piece cannot be selected, so immediately return
    if (!(board[numCoords[0]][numCoords[1]] === turn)) return 
    
    // Set selected coordinate to be the coordinate of the clicked square
    // selectedEl = numCoords
    selectedCoords = numCoords
    // console.log(selectedEl)
    console.log(selectedCoords)

  } else { // a piece has already been selected

    // immediately return if the landing square cannot be moved into

    // move the piece if the landing square can be moved into
    landingCoords = numCoords
    console.log(landingCoords)
    board[landingCoords[0]][landingCoords[1]] = turn
    board[selectedCoords[0]][selectedCoords[1]] = 0
    selectedCoords = null
    landingCoords = null
  }


  // console.log(clickedSqEl)
  // console.log(!clickedSqEl.firstElementChild.firstElementChild)
  // if (clickedSqEl.firstElementChild.firstElementChild)
  // console.log(board[numCoords[0]][numCoords[1]])
  // console.log(board[numCoords[0]][numCoords[1]] === turn)

  // test isPieceAvailable
  isPieceAvailable(numCoords)

  // render the board at the end
  render();
  
}


/*----- functions -----*/

function init() {
  // initialize scoreboard
  score = [1,1]
  
  // initialize gameboard
  board = [
    [0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
  ]

  // initialize turn
  turn = 1 // start with player '1'

  // initialize winner
  winner = null; // null represent no winner or tie yet

}

function render() {
  // render pieces
  let firstChild
  board.forEach(function(row, rIdx) {
    row.forEach(function(square, sIdx) {
      let squareEl = document.getElementById(`${rIdx}-${sIdx}`).firstElementChild
      if (board[rIdx][sIdx] !== 0) { // the square is not empty
        if (!squareEl.firstElementChild) { // no piece in the square
          let piece = createPiece(board[rIdx][sIdx])
          squareEl.appendChild(piece)
        }
      } else { // the square is empty
        // console.log(squareEl.firstElementChild)
        if (squareEl.firstElementChild) { // there is already a piece in the square
          squareEl.removeChild(squareEl.childNodes[0])
        }
      }
    })
  })

  // render effect on selected element
  // selectedEl = 

  // render scoreboard
  scoreEl.forEach((eachScore, idx) => eachScore.textContent = score[idx])
  // scoreEl[0].textContent = score[0]
  // scoreEl[1].textContent = score[1]
  // console.log(scoreEl[0].textContent)
  
  // render available piece
  calcAvailablePiece(turn)

}

// create a piece
function createPiece(player) {
  // create label on piece
  let pieceLabel = document.createElement("div")
  pieceLabel.classList.add("pieceLabel")
  pieceLabel.textContent=player
  
  // create piece
  let piece = document.createElement("div")
  piece.appendChild(pieceLabel)
  piece.classList.add("piece")
  if (player===-1) piece.classList.add("redPiece")
  if (player===1) piece.classList.add("blackPiece")
  // console.log(piece)

  // create square for effects for the piece
  // let pieceSquare = document.createElement("div")
  // pieceSquare.appendChild(piece)
  // pieceSquare.classList.add("pieceSq")

  return piece
}

// remove a piece
function removePiece(piece) {

}

function calcAvailablePiece(turn) {
  // let coords = 
  console.log(turn)
  
}

// Determine whehter a piece can move
// return array of coordinates that the piece can move into if the piece can move 
// return false if the piece cannot move
function isPieceAvailable(coords) {
  console.log(coords)
  let availCoords = []

  let diagonalSq = [coords[0]-1, coords[1]-1]
  // console.log(diagonalSq)
  isCornerAvailable(diagonalSq)

  // console.log(board)

  // console.log(board[diagonalSq[0]][diagonalSq[1]])

  // if (board[diagonalSq[0]][diagonalSq[1]] === turn) {
  //   console.log(false)
  // } else if (board[diagonalSq[0]][diagonalSq[1]] === turn*-1) { 
  //   console.log(true)
  // } else if (board[diagonalSq[0]][diagonalSq[1]] === 0) {
  //   console.log(true)
  // }
  
}

// Determine whehter a corner can be moved into
// return true if a corner can be moved into
// return false if a corner cannot be moved into
function isCornerAvailable(cornerCoords, player) {
  console.log(cornerCoords)
  if (cornerCoords[0] < 0 || cornerCoords[1] < 0) return false

  // console.log(board[cornerCoords[0]][cornerCoords[1]])

  // if (board[cornerCoords[0]][cornerCoords[1]] === turn) {
  //   console.log(false)
  // } else if (board[cornerCoords[0]][cornerCoords[1]] === turn*-1) { 
  //   console.log(true)
  // } else if (board[cornerCoords[0]][cornerCoords[1]] === 0) {
  //   console.log(true)
  // }
  
}

init()
render()

