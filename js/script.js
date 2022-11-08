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

let arrAllLandableCoords

/*----- cached element references -----*/
let gameboardEl = document.getElementById('gameboard')
let squaresEl = document.querySelectorAll('.square')
let scoreEl = document.querySelectorAll('.bothScore')
let selectedEl = null;

let msgboardEl = document.getElementById('msgboard')


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

  // console.log(!selectedEl)
  // console.log(!selectedCoords)
  if (!selectedCoords) { // no piece has yet been selected
    
    // the square does not contain a piece, so immediately return
    if (!clickedSqEl.firstElementChild.firstElementChild) return

    // the piece cannot be selected, so immediately return
    if (!(board[numCoords[0]][numCoords[1]][0] === turn)) return 
    
    // Set selected coordinate to be the coordinate of the clicked square
    // selectedEl = numCoords
    selectedCoords = numCoords
    // console.log(selectedEl)
    console.log(selectedCoords)

    console.log("just before executing findAllLandableCoords")
    arrAllLandableCoords = findAllLandableCoords(selectedCoords)
    console.log("just after executing findAllLandableCoords")
    console.log(arrAllLandableCoords)

    
    
    // let allLandable = findAllLandableCoords(selectedCoords)
    

  } else { // a piece has already been selected
    
    landingCoords = numCoords

    // immediately return if the landing square cannot be landed into
    if (!containsCoords(arrAllLandableCoords, landingCoords)) return
    
    // test isLandingSqAvailable
    // if (!isLandingSqAvailable(landingCoords, selectedCoords)) return

    // test isCornerAvailable
    // let diagonalCoords = [selectedCoords[0]-1, selectedCoords[1]+1]
    // console.log(diagonalCoords)
    // isCornerAvailable(diagonalCoords)
    // isCornerAvailable()

    // move the piece if the landing square can be moved into
    // landingCoords = numCoords
    // console.log(landingCoords)
    movePiece(selectedCoords, landingCoords)
    // board[landingCoords[0]][landingCoords[1]][0] = board[selectedCoords[0]][selectedCoords[1]][0]
    // board[landingCoords[0]][landingCoords[1]][1] = board[selectedCoords[0]][selectedCoords[1]][1]
    
    // board[selectedCoords[0]][selectedCoords[1]][0] = 0
    // board[landingCoords[0]][landingCoords[1]][1] = 'N'
    // selectedCoords = null
    // landingCoords = null

    // change turn
    turn *=-1
    console.log(turn)
  }

  // console.log(clickedSqEl)
  // console.log(!clickedSqEl.firstElementChild.firstElementChild)
  // if (clickedSqEl.firstElementChild.firstElementChild)
  // console.log(board[numCoords[0]][numCoords[1]])
  // console.log(board[numCoords[0]][numCoords[1]] === turn)
  
  // test isPieceAvailable
  // isPieceAvailable(numCoords)
 

  // render the board at the end
  render();
  
}

function movePiece(selCoords, landCoords) {
  board[landCoords[0]][landCoords[1]][0] = board[selCoords[0]][selCoords[1]][0]
  board[landCoords[0]][landCoords[1]][1] = board[selCoords[0]][selCoords[1]][1]
  
  board[selCoords[0]][selCoords[1]][0] = 0
  board[selCoords[0]][selCoords[1]][1] = 'N'
  selectedCoords = null
  landingCoords = null
}

// return true if the array of coordinate contains an individual coords, otherwise return false
function containsCoords(arrCoords, indCoords) {
  let booLandable = false;
  arrCoords.forEach(function(coords) {
    if (coords[0] === indCoords[0] && coords[1] === indCoords[1]) booLandable = true
  })
  return booLandable
}

/*----- functions -----*/

function init() {
  // initialize scoreboard
  score = [1,1]
  
  // initialize gameboard
  // board = [
  //   [0, -1, 0, -1, 0, -1, 0, -1],
  //   [-1, 0, -1, 0, -1, 0, -1, 0],
  //   [0, -1, 0, -1, 0, -1, 0, -1],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [1, 0, 1, 0, 1, 0, 1, 0],
  //   [0, 1, 0, 1, 0, 1, 0, 1],
  //   [1, 0, 1, 0, 1, 0, 1, 0],
  // ]

  // board = [
  //   [[0,"N"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"], [-1, "N"]],
  //   [[-1, "N"], [0, "N"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"]],
  //   [[0, "N"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"], [-1, "N"]],
  //   [[0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
  //   [[0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
  //   [[1, "N"], [0, "N"], [1, "N"], [0, "N"], [1, "N"], [0, "N"], [1,"N"], [0, "N"]],
  //   [[0, "N"], [1, "N"], [0, "N"], [1, "N"], [0, "N"], [1, "N"], [0, "N"], [1, "N"]],
  //   [[1, "N"], [0, "N"], [1, "N"], [0, "N"], [1, "N"], [0, "N"], [1, "N"], [0, "N"]],
  // ]

  board = [
    [[0,"K"], [-1, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1, "K"]],
    [[-1, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1, "K"], [0, "K"]],
    [[0, "K"], [-1, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1, "K"]],
    [[0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
    [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
    [[1, "K"], [0, "K"], [1, "K"], [0, "K"], [1, "K"], [0, "K"], [1,"K"], [0, "K"]],
    [[0, "K"], [1, "K"], [0, "K"], [1, "K"], [0, "K"], [1, "K"], [0, "K"], [1, "K"]],
    [[1, "K"], [0, "K"], [1, "K"], [0, "K"], [1, "K"], [0, "K"], [1, "K"], [0, "K"]],
  ]
  console.log(board)

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
      // console.log(board)
      let squareEl = document.getElementById(`${rIdx}-${sIdx}`).firstElementChild
      // console.log(board[rIdx][sIdx][0])
      if (board[rIdx][sIdx][0] !== 0) { // the square is not empty
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

  // render message board
  msgboardEl.textContent = `Turn: ${turn}`;


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
function createPiece(sq) {
  // create label on piece
  let pieceLabel = document.createElement("div")
  pieceLabel.classList.add("pieceLabel")
  // console.log(sq[1])
  // sq[1] = 'K'

  pieceLabel.textContent=`${sq[0]} ${sq[1]}`
  
  // create piece
  let piece = document.createElement("div")
  piece.appendChild(pieceLabel)
  piece.classList.add("piece")
  if (sq[0]===-1) piece.classList.add("redPiece")
  if (sq[0]===1) piece.classList.add("blackPiece")
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
  // console.log(turn)
  
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

// Determine whehter a square can be moved into ("landing square")
// return true if a square is a landing square
// return false if a square is not a landing square
function isLandingSqAvailable(landCoords, selCoords) {
  // console.log("isLandingSqAvailable")
  
  // coordinate is outside of gameboard, so immediately return false
  if (!(landCoords[0] >= 0 && landCoords[0] <= 7)) return false
  if (!(landCoords[1] >= 0 && landCoords[1] <= 7)) return false

  // coordinate contains a piece
  if (board[landCoords[0]][landCoords[1]][0] !== 0) {
    return false
    // the piece in the coordinate is one of the player's own piece, so immediately return false
    // if (board[landCoords[0]][landCoords[1]][0] === board[selCoords[0]][selCoords[1]][0]) {
    //   return false  
    // } else { //the piece in the coordinate is one of the opponent's own piece
    //   // no need - leave it here for now
    // }
    
  }

  // if 

  // coordinate is not a diagonal empty square

  // coordinate is a diagonal empty square
  return isDiagonalSq(landCoords, selCoords)

  // coordinate is a landing square, return true
  return true

}


function findAllLandableCoords(selCoords) {
  console.log("inside findAllLandableCoords")
  let allLandableCoords = []
  let player = board[selCoords[0]][selCoords[1]][0]
  let king = board[selCoords[0]][selCoords[1]][1] 
  let topLeftCoord = [selCoords[0]-1, selCoords[1]-1]
  let topRightCoord = [selCoords[0]-1, selCoords[1]+1]
  let bottomRightCoord = [selCoords[0]+1, selCoords[1]+1]
  let bottomLeftCoord = [selCoords[0]+1, selCoords[1]-1] 
  let arrCornersCoords = [topLeftCoord, topRightCoord, bottomRightCoord, bottomLeftCoord]
  
  // remove out-of-gameboard coordinates from array 
  arrCornersCoords = arrCornersCoords.filter(function(cornerCoords) {
    return (cornerCoords[0] >=0 && cornerCoords[0] <=7 && cornerCoords[1] >=0 && cornerCoords[1] <=7)
  })
  console.log('Coords inside gameboard:')
  console.log(arrCornersCoords)
  
  // remove coordinates that contains one of player's pieces from array
  arrCornersCoords = arrCornersCoords.filter(function(cornerCoords) {
    // console.log(board[cornerCoords[0]][cornerCoords[1]][0] !== turn)
    return (board[cornerCoords[0]][cornerCoords[1]][0] !== turn)
  })
  console.log("Coords inside gameboard without player's pieces:")
  console.log(arrCornersCoords)

  // get all the empty coordinate
  let arrEmptyCoords = arrCornersCoords.filter(function(cornerCoords) {
    return (board[cornerCoords[0]][cornerCoords[1]][0] === 0)
  })
  console.log("Coords for empty squares:")
  console.log(arrEmptyCoords)

  // get all coordinates that contain opponent's piece
  let arrOppCoords = arrCornersCoords.filter(function(cornerCoords) {
    return (board[cornerCoords[0]][cornerCoords[1]][0] === turn*-1)
  })
  console.log("Coords for opponent pieces:")
  console.log(arrOppCoords)

  // get all coordinates one square further than opponent piece from selected piece in the same direction
  let arrFurtherCoords = []
  if (!!arrOppCoords.length) { //if there is at least one opponent coordinate
    arrOppCoords.forEach(function(OppCoords, idx) {
      arrFurtherCoords.push(getFurtherCornerCoords(selCoords, arrOppCoords[idx]))
    })  
  }
  console.log("Further coordinates:")
  console.log(arrFurtherCoords)

  // remove all out-of-gameboard coordinates from further coordinates array
  arrFurtherCoords = arrFurtherCoords.filter(function(furtherCoords) {
    return (furtherCoords[0] >=0 && furtherCoords[0] <=7 && furtherCoords[1] >=0 && furtherCoords[1] <=7)  
  })
  console.log('Further coords inside gameboard:')
  console.log(arrFurtherCoords)

  // filter only the coords that does not contain a piece (effectively removes all coords containing a piece)
  arrFurtherCoords = arrFurtherCoords.filter(function(furtherCoords) {
    return (board[furtherCoords[0]][furtherCoords[1]][0] === 0)
  })
  console.log("Further coords inside gameboard without player's pieces:")
  console.log(arrFurtherCoords)

  // remove coordinates that contains one of player's pieces from array
  // arrCornersCoords = arrCornersCoords.filter(function(cornerCoords) {
  //   return (board[cornerCoords[0]][cornerCoords[1]][0] !== turn)
  // })
  // console.log("Coords inside gameboard without player's pieces:")
  // console.log(arrCornersCoords)

  // if the piece is king
    // look at each of the 4 corners
      // if the corner is out of gameboard, do not push to the array of landable coords
      // if the corner has a piece and it is one of the player's pieces
      // else if (the corner has a piece and it is one of the oppoonent's pieces)
        // check if further corner in the same direction is empty
          // it is landable and push to array
          // look further to each of all 4 corners
            // if (there is an opponent's piece)
              // look to further in the same direction
            // else (there is no opponent's piece in furhter corner)
              // (do not push)
        // else (further corner is occupied by a piece (red or black))
          // the coords is not landable, do not push
      // else (the corner is empty)
        // removable - add to the array of landable coords
  // else (the pice is not king)
    // if the piece is player '1''s piece
      // look at two upward corners
    // else if the piece is player '-1''s piece
      // look at two downward corners
  
  if (king === 'K') {
    // look at each of the 4 corners
    // console.log("inside K")
    // if each of the 4 corners are empty
    allLandableCoords = [...arrEmptyCoords, ...arrFurtherCoords];

    // allLandableCoords.concat(arrFurtherCoords)

    arrCornersCoords.forEach(function(CornerCoord) {
      // if (isSqEmpty(CornerCoord)) allLandableCoords.push(CornerCoord)
      
      // there is a piece and the piece is opponent's piece
      
      // console.log(board[CornerCoord[0]][CornerCoord[1]][0])
      if (board[CornerCoord[0]][CornerCoord[1]][0] === turn*-1) {
        // console.log(board[CornerCoord[0]][CornerCoord[1]][0])
      }
    })
    // if (isSqEmpty(topLeftCoord)) allLandableCoords.push(topLeftCoord)
    // if (isSqEmpty(topRightCoord)) allLandableCoords.push(topRightCoord)
    // if (isSqEmpty(bottomLeftCoord)) allLandableCoords.push(bottomLeftCoord)
    // if (isSqEmpty(bottomRightCoord)) allLandableCoords.push(bottomRightCoord)

    // if there is a piece and the piece is opponent's piece
    // console.log(board[topLeftCoord[0]][topLeftCoord[1]][0])
    // check to see if furhter corner is empty

  } else {
    if (player = '1') {
      // look at each of the 2 upward corners
    } else if (player = '-1') {
      // look at each of the 2 downward corners
    }
  }
  console.log('All landable coords:')
  console.log(allLandableCoords)
  return allLandableCoords
}

// return coordinate for further corner in the same direction from selected piece and opponent piece
function getFurtherCornerCoords(selCoords, oppCoords) {
  // console.log(oppCoords)
  // console.log(selCoords)
  let rDiff = oppCoords[0]-selCoords[0]
  let sDiff = oppCoords[1]-selCoords[1]
  // console.log(`row diff: ${rDiff} - sq diff: ${sDiff}`)
  // console.log(`further coords: `)
  let furtherCoords = [oppCoords[0]+rDiff, oppCoords[1]+sDiff]
  // console.log(furtherCoords)
  return furtherCoords

}


// determine if a corner is movable (empty)
function isSqEmpty(cornerCoords) {
  // coordinate is out of gameboard, return false
  if (!(cornerCoords[0] >= 0 && cornerCoords[0] <= 7)) return false 
  if (!(cornerCoords[1] >= 0 && cornerCoords[1] <= 7)) return false

  // if the corner has a piece
  if (board[cornerCoords[0]][cornerCoords[1]][0] !== 0) return false
  return true
}


// determine if a landing coordinate is a diagonal coordinate to the selected coordinate
// return true if the landing coordinate is a diagonal coordinate, otherwise return false
function isDiagonalSq(landCoords, selCoords) {
  let arrDiagonalCoords = []
  let booIsDiagonSq = false
  let player = board[selCoords[0]][selCoords[1]][0]
  let king = board[selCoords[0]][selCoords[1]][1]
  let topLeftCoord = [selCoords[0]-1, selCoords[1]-1]
  let topRightCoord = [selCoords[0]-1, selCoords[1]+1]
  let bottomLeftCoord = [selCoords[0]+1, selCoords[1]-1]
  let bottomRightCoord = [selCoords[0]+1, selCoords[1]+1]

  if (king === 'K') {
    arrDiagonalCoords.push(topLeftCoord, topRightCoord, bottomLeftCoord, bottomRightCoord)
  } else if (player === 1) {
    arrDiagonalCoords.push(topLeftCoord, topRightCoord)
  } else if (player === -1) {
    arrDiagonalCoords.push(bottomLeftCoord, bottomRightCoord)
  }
  // arrDiagonalCoords.push([selCoords[0]-1, selCoords[1]-1])
  // arrDiagonalCoords.push([selCoords[0]-1, selCoords[1]+1])
  // arrDiagonalCoords.push([selCoords[0]+1, selCoords[1]-1])
  // arrDiagonalCoords.push([selCoords[0]+1, selCoords[1]+1])
  
  arrDiagonalCoords.forEach(function(DiagonalCoords) {
    if (DiagonalCoords[0] === landCoords[0] && DiagonalCoords[1] === landCoords[1]) booIsDiagonSq = true
  })

  // console.log("false")
  console.log(booIsDiagonSq)
  return booIsDiagonSq

}

//

// Determine whehter a corner can be moved into
// return true if a corner can be moved into
// return false if a corner cannot be moved into
function isCornerAvailable(cornerCoords, selCoords) {
  console.log(cornerCoords)
  console.log(!(cornerCoords[0] >= 0 && cornerCoords[1] >= 0))
  
  // corner coordinate is outside of gameboard, so immediately return false
  if (!(cornerCoords[0] >= 0 && cornerCoords[1] >= 0)) return false

  // corner coordinate contains a piece, so immediately return false
  // console.log("haha")
  // console.log(!board[cornerCoords[0]][cornerCoords[1]][0])
  if (board[cornerCoords[0]][cornerCoords[1]][0] !== 0) return false

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

