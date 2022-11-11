/*----- constants -----*/
const colors = {
    'null':'lightgray', 
    '1': 'black', // for black player 
    '-1': 'red' // for red player
}

/*----- app's state (variables) -----*/
let board = [] // track coordineate of each player's pieces

let score = [] // track score of each player

let turn // track turn

let winner // track winner

let selectedCoords // track coordinate selected by player
let landingCoords // track landing coordinate chosen by player

let arrAllLandableCornerCoords // track all immediate landable corners
let arrAllLandableJumpCoords // track all landable jumps Inot including immediate corners)
let arrAllLandableCoords // track all landalbe corners or jumps

/*----- cached element references -----*/
let gameboardEl = document.getElementById('gameboard')
let squaresEl = document.querySelectorAll('.square')
let pieceSqsEl = document.querySelectorAll('.pieceSq')

let scoreEl = document.querySelectorAll('.bothScore')
let selectedEl = null;
let msgboardEl = document.getElementById('msgboard')
let replayEl = document.getElementById("replay")

/*----- event listeners -----*/
gameboardEl.addEventListener('click', handleClick)

function handleClick(evt) {
  let clickedEl = evt.target

  let isSq = clickedEl.classList.contains('square')
  let isPieceSq = clickedEl.classList.contains('pieceSq')
  let isPiece = clickedEl.classList.contains('piece')
  let isPieceLabel = clickedEl.classList.contains('pieceLabel')

  if (winner !== null) return

  if (!(isSq || isPieceSq || isPiece || isPieceLabel)) return

  // retrieve coordinates of the selected piece or square
  let strClickedCoords = []
  let clickedSqEl
  if (isSq) clickedSqEl = clickedEl
  if (isPieceSq) clickedSqEl = clickedEl.parentElement
  if (isPiece) clickedSqEl = clickedEl.parentElement.parentElement
  if (isPieceLabel) clickedSqEl = clickedEl.parentElement.parentElement.parentElement
  strClickedCoords = clickedSqEl.id.split('-')
  
  // turn coordinates from array of strings into array of numbers
  let numClickedCoords = []
  strClickedCoords.forEach((strCoord) => numClickedCoords.push(parseInt(strCoord, 10)))

  if (!selectedCoords) { // no piece has yet been selected
    
    // the square does not contain a piece, so immediately return
    if (!clickedSqEl.firstElementChild.firstElementChild) return

    // the piece cannot be selected, so immediately return
    if (!(board[numClickedCoords[0]][numClickedCoords[1]][0] === turn)) return 
    
    selectedCoords = numClickedCoords
    arrAllLandableCoords = findAllLandableCoords(selectedCoords) 

  } else { // a piece has already been selected
    
    landingCoords = numClickedCoords
    
    // if the landing coordinate selected by player is not landable
    if (!containsCoords(arrAllLandableCoords, landingCoords)) { 
      // if the coordinate clicked is coordinate of the player's own piece
      if (board[numClickedCoords[0]][numClickedCoords[1]][0] === turn) {
        selectedCoords = numClickedCoords
        arrAllLandableCoords = findAllLandableCoords(selectedCoords)   
      } else { // the coordinate clicked is not coordinate of the player's own piece
        // deselect selected coords and immediately return
        selectedCoords = null
        landingCoords = null 
      }
    } 
    else { // the landing coordinate selected by player is landable
    
      // move the piece from selected coordinate to landing coordinate
      movePiece(selectedCoords, landingCoords)
      
      // change turn; turn can only be changed if a piece is moved
      turn *=-1
    }
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

// return true if a a landing coordinate is immediate corner to the selected coordinate
// otherwise return false
function isImmediateCornerCoords(selCoords, landCoords) {
  let rDiff = landCoords[0] - selCoords[0]
  let sDiff = landCoords[1] - selCoords[1]
  return (Math.abs(rDiff) === 1 && Math.abs(sDiff) === 1)
}

// return true if a landing coordinate is further corner to the selected coordinate
// otherwise return false
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

  // initialize selected coordinate and landing coordinate to be selected by player
  selectedCoords = null // null represent no coordinate is selected
  landingCoords = null // null represent no landing coordinate is chosen

  // initialize landable coordinates
  arrAllLandableCornerCoords = null
  arrAllLandableJumpCoords = null
  arrAllLandableCoords = null // null represent there is no landable coordinate to a selected coordinate
}

function render() {
  // render pieces
  let firstChild
  board.forEach(function(row, rIdx) {
    row.forEach(function(square, sIdx) {
      let squareEl = document.getElementById(`${rIdx}-${sIdx}`).firstElementChild
      
      // clear the board: if there is a piece in the square, remove the piece
      if (squareEl.firstElementChild) squareEl.removeChild(squareEl.childNodes[0])

      if (board[rIdx][sIdx][0] !== 0) { // if the board square coordinate is not empty (0)
        // create pieces for each of the players
        let piece = createPiece(board[rIdx][sIdx])
        squareEl.appendChild(piece)
      } 
    })
  })

  // render piece selection effect when a piece is selected  
  board.forEach(function(row, rIdx) {
    row.forEach(function(square, sIdx) {
      let pieceSqEl = document.getElementById(`${rIdx}-${sIdx}`).firstElementChild
      
      // remove all previously set classes (effects) from a square
      pieceSqEl.classList.remove("selectedPieceSq", "landableCornerSq", "landableJumpsq")
      
      // set classes (effects) to a square if it is selected
      if (!!selectedCoords) {// if a coordinate is selected
        if (isSameCoords([rIdx, sIdx], selectedCoords)) {
          pieceSqEl.classList.add("selectedPieceSq")
        }
        if (containsCoords(arrAllLandableCornerCoords, [rIdx, sIdx])) {
          pieceSqEl.classList.add("landableCornerSq")
        }
        if (containsCoords(arrAllLandableJumpCoords, [rIdx, sIdx])) {
          pieceSqEl.classList.add("landableJumpsq")  
        }
      }
    })
  })
  
  // render message board
  let displayMsg = ""
  if (winner === null) {
    displayMsg = `Turn for player '${colors[turn]}'`;
  } else {
    displayMsg = `Congratulations! Winner is player '${colors[winner]}'`;
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
  pieceLabel.classList.add("noTextSelection")
  
  if (sq[1] === 'K') {
    let textCrown = document.createTextNode("👑").textContent;
    pieceLabel.textContent=`${textCrown}`
    // pieceLabel.textContent=`${sq[0]} ${textCrown}`
  } else {
    let textNormal = document.createTextNode("❀").textContent;
    pieceLabel.textContent=`${textNormal}`
    // pieceLabel.textContent=`${sq[0]} ${sq[1]}`
  }
      
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

  // find all landable corner coordinates for a selected piece
  arrAllLandableCornerCoords = findAllLandableCornerCoords(selCoords)

  // find all immediate corners of selected coordinate that does not contain pieces of a specific player
  let arrCornersCoords = findAllEmptyOrOpponentCornerCoords(selCoords)

  // get all coordinates that contain opponent's piece, and assign it to a new array
  // provided that the ipnut array of corner is cleaned up
  let arrOppCoords = filterAllOpponentCoords(arrCornersCoords, turn)

  // get all coordinates one square further than opponent piece from 
  // selected piece in the same direction
  let arrClosestJumpCoords = getAllClosestJumpCoords(arrOppCoords, selCoords)

  // remove all out-of-gameboard coordinates in the array of further coordinate
  arrClosestJumpCoords = filterInBoardCoords(arrClosestJumpCoords)

  // filter for empty coordinates in the array of further coordinates
  arrClosestJumpCoords = filterAllEmptyCoords(arrClosestJumpCoords)

  arrClosestJumpCoords = filterAllForwardMovesCoords(arrClosestJumpCoords, selCoords)

  arrAllLandableJumpCoords = arrClosestJumpCoords

  allLandableCoords = [...arrAllLandableCornerCoords, ...arrAllLandableJumpCoords];

  return allLandableCoords
}

// return an array of all landable corner coordinates that are empty 
// or contain opponent's piece of a coordinate of a player's piece
function findAllEmptyOrOpponentCornerCoords(selCoords) {
  // get all four corner coordinates of the selected coordinate
  let arrCornersCoords = getAllCornerCoords(selCoords)

  // filter for all inside-of-gameboard coordinates (effectively remove all out-all-gameboard coordinates) 
  arrCornersCoords = filterInBoardCoords(arrCornersCoords)

  // remove coordinates that contain one of player's pieces
  arrCornersCoords = removePlayerPieceCoords(arrCornersCoords, turn)  

  return arrCornersCoords
}

// return an array of all landable (empty) diagonal coordinate to a coordinate of a player's piece
function findAllLandableCornerCoords(selCoords) {
  let allLandableEmptyCoords = []

  let arrCornersCoords = findAllEmptyOrOpponentCornerCoords(selCoords)

  // get all the empty coordinate and assign it to a new array 
  // provided that the ipnut array of corner is cleaned up
  allLandableEmptyCoords = filterAllEmptyCoords(arrCornersCoords)

  // filter array of coordiantes of moves for only forward moves for a player
  allLandableEmptyCoords = filterAllForwardMovesCoords(allLandableEmptyCoords, selCoords)

  return allLandableEmptyCoords
}

function filterAllForwardMovesCoords(arrCoords, selCoords) {
  let player = board[selCoords[0]][selCoords[1]][0]
  let king = board[selCoords[0]][selCoords[1]][1]

  // filter for all forward coordinates (upward for player '1' 
  // and downward for player '-1') if the selected coordinate is not king
  if (king != 'K') {
    if (player === 1) {
      arrCoords = arrCoords.filter(function(landableCoords) {
        return landableCoords[0] < selCoords[0]
      })
    } else if (player === -1) {
      arrCoords = arrCoords.filter(function(landableCoords) {
        return landableCoords[0] > selCoords[0]
      })
    }
  }
  return arrCoords
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
