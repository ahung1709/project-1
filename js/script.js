/*----- constants -----*/
const colors = {
    'null':'lightgray', 
    '1': 'black', // for black player 
    '-1': 'red' // for red player
}

/*----- app's state (variables) -----*/
let board = []

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
let replayEl = document.getElementById("replay")

/*----- event listeners -----*/
gameboardEl.addEventListener('click', handleClick)

function handleClick(evt) {
  let clickedEl = evt.target

  // console.log(clickedEl)
  let isSq = clickedEl.classList.contains('square')
  let isPieceSq = clickedEl.classList.contains('pieceSq')
  let isPiece = clickedEl.classList.contains('piece')
  let isPieceLabel = clickedEl.classList.contains('pieceLabel')

  if (winner !== null) return

  if (!(isSq || isPieceSq || isPiece || isPieceLabel)) return

  // retrieve coordinates of the selected piece or square
  let strCoords = []
  let clickedSqEl
  if (isSq) clickedSqEl = clickedEl
  if (isPieceSq) clickedSqEl = clickedEl.parentElement
  if (isPiece) clickedSqEl = clickedEl.parentElement.parentElement
  if (isPieceLabel) clickedSqEl = clickedEl.parentElement.parentElement.parentElement
  strCoords = clickedSqEl.id.split('-')
  
  // turn coordinates from array of strings into array of numbers
  let numCoords = []
  strCoords.forEach((strCoord) => numCoords.push(parseInt(strCoord, 10)))

  if (!selectedCoords) { // no piece has yet been selected
    
    // the square does not contain a piece, so immediately return
    if (!clickedSqEl.firstElementChild.firstElementChild) return

    // the piece cannot be selected, so immediately return
    if (!(board[numCoords[0]][numCoords[1]][0] === turn)) return 
    
    selectedCoords = numCoords
    arrAllLandableCoords = findAllLandableCoords(selectedCoords)   

  } else { // a piece has already been selected
    
    landingCoords = numCoords

    // deselect selected coords and immediately return if the landing square cannot be landed into
    if (!containsCoords(arrAllLandableCoords, landingCoords)) {
      selectedCoords = null  
      return
    }
    
    // move the piece from selected coordinate to landing coordinate
    movePiece(selectedCoords, landingCoords)
    
    // change turn
    turn *=-1
  }

  // set winner if there is a winner
  let playerToBeTested = 0
  // set score index for players
  score.forEach(function(playerScore, idx) {
    if (idx === 0) playerToBeTested = -1
    if (idx === 1) playerToBeTested = 1
    if (getRemainingPiece(playerToBeTested) === 0) winner = playerToBeTested*-1
  })

  // render the board at the end
  render();
  
}

replayEl.addEventListener('click', function(evt) {
  init()
  render()
})

function movePiece(selCoords, landCoords) {
  let player = board[selCoords[0]][selCoords[1]][0]
  
  // move the piece at selected coordinate to the landing coordinate
  board[landCoords[0]][landCoords[1]][0] = board[selCoords[0]][selCoords[1]][0]

  // change the piece to a 'King' piece if it reaches the opponent's baseline
  if (landCoords[0] === 0 && player === 1) {
    board[landCoords[0]][landCoords[1]][1] = 'K'
  } else if (landCoords[0] === 7 && player === -1)
    board[landCoords[0]][landCoords[1]][1] = 'K' 
  else {
    board[landCoords[0]][landCoords[1]][1] = board[selCoords[0]][selCoords[1]][1]
  }
  
  board[selCoords[0]][selCoords[1]][0] = 0
  board[selCoords[0]][selCoords[1]][1] = 'N'
  selectedCoords = null
  landingCoords = null

  // no more work needed and immediately return if landing coordinate is immediate corner to selected coordinate  
  if (isImmediateCornerCoords(selCoords, landCoords)) return
  
  // landing coordinate is further corner to selected coordinate
  if (isFurtherCornerCoords(selCoords, landCoords)) { 
    // capture the opponent piece between the piece at selected coordinate and the piece at landing coorindate
    captureOppPiece(selCoords, landCoords)
    increaseScore(player, 1)
    return
  }
}


function isImmediateCornerCoords(selCoords, landCoords) {
  let rDiff = landCoords[0] - selCoords[0]
  let sDiff = landCoords[1] - selCoords[1]
  return (Math.abs(rDiff) === 1 && Math.abs(sDiff) === 1)
}

function isFurtherCornerCoords(selCoords, landCoords) {
  let rDiff = landCoords[0] - selCoords[0]
  let sDiff = landCoords[1] - selCoords[1]
  return (Math.abs(rDiff) === 2 && Math.abs(sDiff) === 2)
}

// return true if the array of coordinate contains an individual coords, otherwise return false
function containsCoords(arrCoords, indCoords) {
  let booLandable = false
  arrCoords.forEach(function(coords) {
    if (coords[0] === indCoords[0] && coords[1] === indCoords[1]) booLandable = true
  })
  return booLandable
}

/*----- functions -----*/

function init() {
  // initialize scoreboard
  score = [0,0]
  
  // initialize gameboard
  
  board = getStandardScenario(0)
  // board = getSpecialScenario(0)

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
      if (board[rIdx][sIdx][0] !== 0) { // the square is not empty
        if (!!squareEl.firstElementChild) { // if there is a piece in the square
          squareEl.removeChild(squareEl.childNodes[0])
        }
        let piece = createPiece(board[rIdx][sIdx])
        squareEl.appendChild(piece)
      } else { // the square is empty
        if (squareEl.firstElementChild) { // there is already a piece in the square
          squareEl.removeChild(squareEl.childNodes[0])
        }
      }
    })
  })

  // render message board
  let displayMsg = ""
  if (winner === null) {
    displayMsg = `${turn} (${colors[turn]})'s Turn`;
  } else {
    displayMsg = `Congratulations! Winner is ${winner} (${colors[winner]})`;
  }
  msgboardEl.textContent = displayMsg

  // render scoreboard
  scoreEl.forEach((eachScore, idx) => eachScore.textContent = score[idx])
}

// return number of remaining piece for a player
function getRemainingPiece(player) {
  let remainingNumPieces = 0
  board.forEach(function(row) {
    row.forEach(function(square) {
      if (square[0] === player) remainingNumPieces++
    })
  })
  return remainingNumPieces
}

// create a piece on a specific square
function createPiece(sq) {
  // create label on piece
  let pieceLabel = document.createElement("div")
  pieceLabel.classList.add("pieceLabel")
  if (sq[1] === 'K') {
    let textCrown = document.createTextNode("👑").textContent;
    pieceLabel.textContent=`${sq[0]} ${textCrown}`
  } else {
    pieceLabel.textContent=`${sq[0]} ${sq[1]}`
  }
  pieceLabel.style.fontFamily = "sans-serif"
    
  // create piece
  let piece = document.createElement("div")
  piece.appendChild(pieceLabel)
  piece.classList.add("piece")
  if (sq[0]===-1) piece.classList.add("redPiece")
  if (sq[0]===1) piece.classList.add("blackPiece")

  return piece
}

function findAllLandableCoords(selCoords) {
  let allLandableCoords = []
  let player = board[selCoords[0]][selCoords[1]][0]
  let king = board[selCoords[0]][selCoords[1]][1] 

  // get all four corner coordinates of the selected coordinate
  let arrCornersCoords = getAllCornerCoords(selCoords)

  // filter for all inside-of-gameboard coordinates (effectively remove all out-all-gameboard coordinates) 
  arrCornersCoords = filterInBoardCoords(arrCornersCoords)

  // remove coordinates that contain one of player's pieces
  arrCornersCoords = removePlayerPieceCoords(arrCornersCoords, turn)
  
  // get all the empty coordinate and assign it to a new array 
  // provided that the ipnut array of corner is cleaned up
  let arrEmptyCoords = filterAllEmptyCoords(arrCornersCoords)

  // get all coordinates that contain opponent's piece, and assign it to a new array
  // provided that the ipnut array of corner is cleaned up
  let arrOppCoords = filterAllOpponentCoords(arrCornersCoords, turn)

  // get all coordinates one square further than opponent piece from 
  // selected piece in the same direction
  let arrClosestJumpCoords = getAllClosestJumpCoords(arrOppCoords, selCoords)

  // remove all out-of-gameboard coordinates in the array of further coordinate
  arrClosestJumpCoords = filterInBoardCoords(arrClosestJumpCoords)
  // console.log(arrClosestJumpCoords)

  // filter for empty coordinates in the array of further coordinates
  arrClosestJumpCoords = filterAllEmptyCoords(arrClosestJumpCoords)

  allLandableCoords = [...arrEmptyCoords, ...arrClosestJumpCoords];
  if (king != 'K') {
    if (player === 1) {
      allLandableCoords = allLandableCoords.filter(function(landableCoords) {
        return landableCoords[0] < selectedCoords[0]
      })
    } else if (player === -1) {
      allLandableCoords = allLandableCoords.filter(function(landableCoords) {
        return landableCoords[0] > selectedCoords[0]
      })
    }
  }

  return allLandableCoords
}

// remove an excluded coordinate from array of coordinates
function removeCoords(arrCoords, excludedCoords) {
  let newCoords
  newCoords = arrCoords.filter(function(coords) {
    return !isSameCoords(coords, excludedCoords)
  })
  return newCoords
}

// return true if two coordinates are the same, otherwise return false
function isSameCoords(aCoords, bCoords) {
  console.log((aCoords[0] === bCoords[0] && aCoords[1] === bCoords[1]))
  return (aCoords[0] === bCoords[0] && aCoords[1] === bCoords[1])
}

// filter array of coordinates to coordinate that contain a specific player's pieces
function filterPlayerPieceCoords(arrCoords, playerTurn) {
  let newCoords
  newCoords = arrCoords.filter(function(coords) {
    return (board[coords[0]][coords[1]][0] === playerTurn)
  })
  return newCoords
}

// return array of all corner coordinate of a coordinate within gameboard
function getAllCornerCoords(coords) {
  let topLeftCoord = [coords[0]-1, coords[1]-1]
  let topRightCoord = [coords[0]-1, coords[1]+1]
  let bottomRightCoord = [coords[0]+1, coords[1]+1]
  let bottomLeftCoord = [coords[0]+1, coords[1]-1] 
  let newCoords = [topLeftCoord, topRightCoord, bottomRightCoord, bottomLeftCoord]
  newCoords = filterInBoardCoords(newCoords)
  return newCoords
}

// remove all coordinates that contains one of player's pieces from array of coordinates
function removePlayerPieceCoords(arrCoords, playerTurn) {
  let newCoords
  newCoords = arrCoords.filter(function(coords) {
    return (board[coords[0]][coords[1]][0] !== playerTurn)
  })
  return newCoords
}

// filter array of coordinates to coordinates that represent empty square
function filterAllEmptyCoords(arrCoords) {
  let arrNewCoords = arrCoords.filter(function(coords) {
    return (board[coords[0]][coords[1]][0] === 0)
  })
  return arrNewCoords
}

// filter array of coordinates to coordinates that contain opponent's piece
function filterAllOpponentCoords(arrCoords, playerTurn) {
  let arrNewCoords
  arrNewCoords = arrCoords.filter(function(coords) {
      return (board[coords[0]][coords[1]][0] === playerTurn*-1)
    })
  return arrNewCoords
}

// get array of all coordinates one square further than opponent piece 
// from selected piece in the same direction
function getAllClosestJumpCoords(arrOppCoords, selCoords) {
  let arrNewCoords = []
  if (!!arrOppCoords.length) { //if there is at least one opponent coordinate
    arrOppCoords.forEach(function(oppCoords) {
      arrNewCoords.push(getOneFurtherCoords(selCoords, oppCoords))
    })
  }
  return arrNewCoords
}

// return coordinate for further corner in the same direction from selected piece and opponent piece
function getOneFurtherCoords(selCoords, oppCoords) {
  let rDiff = oppCoords[0]-selCoords[0]
  let sDiff = oppCoords[1]-selCoords[1]
  let furtherCoords = [oppCoords[0]+rDiff, oppCoords[1]+sDiff]
  return furtherCoords
}

// filter coordinates to coordinates inside gameboard, so it effectively remove all out-of-gameboard coordinates
function filterInBoardCoords(arrCoords) {
  let arrNewCoords = []
  arrNewCoords = arrCoords.filter(function(coords) {
    return (coords[0] >=0 && coords[0] <=7 && coords[1] >=0 && coords[1] <=7)  
  })
  return arrNewCoords
}

// increase score of a specific player by specific points
function increaseScore(player, pointIncrease) {
  if (player === 1) score[1]+=pointIncrease
  if (player === -1) score[0]+=pointIncrease
}

// set the coordinate for captured piece to an empty square 
// when selected coordinate and landing coordinate is provided
function captureOppPiece(selCoords, landCoords) {
  let oppRCoords = selCoords[0] + (landCoords[0] - selCoords[0])/2
  let oppSCoords = selCoords[1] + (landCoords[1] - selCoords[1])/2
  board[oppRCoords][oppSCoords][0] = 0
  board[oppRCoords][oppSCoords][1] = 'N'
}

// determine if a corner is movable (empty)
function isEmptyCoords(coords) {
  // coordinate is out of gameboard, return false
  if (!(coords[0] >= 0 && coords[0] <= 7)) return false 
  if (!(coords[1] >= 0 && coords[1] <= 7)) return false

  // if the corner has a piece
  if (board[coords[0]][coords[1]][0] !== 0) return false
  return true
}

function getStandardScenario(idxScenario) {
  let scenario = [
    [
      [[0,"N"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"], [-1, "N"]],
      [[-1, "N"], [0, "N"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"]],
      [[0, "N"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"], [-1, "N"]],
      [[0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
      [[0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
      [[1, "N"], [0, "N"], [1, "N"], [0, "N"], [1, "N"], [0, "N"], [1,"N"], [0, "N"]],
      [[0, "N"], [1, "N"], [0, "N"], [1, "N"], [0, "N"], [1, "N"], [0, "N"], [1, "N"]],
      [[1, "N"], [0, "N"], [1, "N"], [0, "N"], [1, "N"], [0, "N"], [1, "N"], [0, "N"]],
    ], 
    [
      [[0,"K"], [-1, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1, "K"]],
      [[-1, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1, "K"], [0, "K"]],
      [[0, "K"], [-1, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1, "K"]],
      [[0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[1, "K"], [0, "K"], [1, "K"], [0, "K"], [1, "K"], [0, "K"], [1,"K"], [0, "K"]],
      [[0, "K"], [1, "K"], [0, "K"], [1, "K"], [0, "K"], [1, "K"], [0, "K"], [1, "K"]],
      [[1, "K"], [0, "K"], [1, "K"], [0, "K"], [1, "K"], [0, "K"], [1, "K"], [0, "K"]],
  ]

  ]
  return scenario[idxScenario]
}



function getSpecialScenario(idxScenario) {
  let scenario = [
    // Scenario '0' for testing winner
    [
      [[0,"K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "N"], [0, "N"], [0, "K"], [0, "K"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [-1, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [1,"K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
    ], 
    // Scenario for consecutive jump case #1
    [
      [[0,"K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [-1, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "N"], [0, "N"], [-1, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1,"K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [1, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
    ], 
    // Scenario for consecutive jump case #2
    [
      [[0,"K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [-1, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "N"], [0, "N"], [-1, "N"], [0, "K"], [-1, "N"], [0, "N"], [-1, "N"], [0, "N"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [-1, "K"], [0, "K"], [-1,"K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [1, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
    ], 
    // Scenario for turning 'Normal' piece to a 'King' piece
    [
      [[0,"N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
      [[0, "N"], [0, "N"], [0, "N"], [0, "N"], [1, "N"], [0, "N"], [0, "N"], [0, "N"]],
      [[0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
      [[0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
      [[0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
      [[0, "K"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0,"N"], [0, "N"]],
      [[0, "N"], [0, "N"], [0, "N"], [-1, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
      [[0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
    ]
  ]
  return scenario[idxScenario]
}

init()
render()

