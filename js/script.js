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

let replayEl = document.getElementById("replay")

/*----- event listeners -----*/
gameboardEl.addEventListener('click', handleClick)

replayEl.addEventListener('click', function(evt) {
  init()
  render()
})

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

    // deselect selected coords and immediately return if the landing square cannot be landed into
    if (!containsCoords(arrAllLandableCoords, landingCoords)) {
      selectedCoords = null  
      return
    }
    
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
 
  // set winner if there is a winner
  // if(getRemainingPiece(1) === 0) 
  let playerToBeTested = 0
  // score index to player
  score.forEach(function(playerScore, idx) {
    if (idx === 0) playerToBeTested = -1
    if (idx === 1) playerToBeTested = 1

    console.log(playerToBeTested)
    console.log(getRemainingPiece(playerToBeTested))

    if (getRemainingPiece(playerToBeTested) === 0) winner = playerToBeTested*-1
    console.log(winner)
    
    // if (playerScore === 12) {
      // if (idx === 0) winner === -1
      // if (idx === 1) winner === 1
    // }
  })
  // if (score[0] === 12 || score[1] === 12) {
  //   winner = 
  // }

  // render the board at the end
  render();
  
}

function movePiece(selCoords, landCoords) {
  // console.log(board[selCoords[0]][selCoords[1]][0])
  let player = board[selCoords[0]][selCoords[1]][0]
  console.log(player)
  
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
  // board = getSpecialScenario(1)

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
  
  // board.forEach(function(row, rIdx) {
  //   row.forEach(function(square, sIdx) {
  //     if (rIdx === 3 && sIdx === 4) {
  //       square[0] = -1
  //       square[1] = 'K'
  //     } else if (rIdx === 4 && sIdx === 5) {
  //       square[0] = 1
  //       square[1] = 'K'
  //     } else {
  //       square[0] = 0
  //       square[0] = 'K'
  //     }
  //   })
  // })

   // Scenario for King with King pieces
  // board = [
  //   [[0,"K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
  //   [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [1, "K"], [0, "K"], [0, "K"], [0, "K"]],
  //   [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
  //   [[0, "N"], [0, "N"], [0, "N"], [0, "K"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
  //   [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
  //   [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0,"K"], [0, "K"]],
  //   [[0, "K"], [0, "K"], [0, "K"], [-1, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
  //   [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
  // ]

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
        if (!!squareEl.firstElementChild) { // if there is a piece in the square
          squareEl.removeChild(squareEl.childNodes[0])
        }
        let piece = createPiece(board[rIdx][sIdx])
        squareEl.appendChild(piece)
      } else { // the square is empty
        // console.log(squareEl.firstElementChild)
        if (squareEl.firstElementChild) { // there is already a piece in the square
          squareEl.removeChild(squareEl.childNodes[0])
        }
      }
    })
  })

  // render message board
  if (winner === null) {
    msgboardEl.textContent = `Turn: ${turn}`;
  } else {
    msgboardEl.textContent = `Congratulations: winner is ${winner}`;
  }
  


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

function getRemainingPiece(player) {
  let remainingNumPieces = 0
  board.forEach(function(row) {
    row.forEach(function(square) {
      if (square[0] === player) remainingNumPieces++
    })
  })
  return remainingNumPieces
}

// create a piece
function createPiece(sq) {
  // create label on piece
  let pieceLabel = document.createElement("div")
  pieceLabel.classList.add("pieceLabel")
  // console.log(sq[1])
  // sq[1] = 'K'

  // console.log("\u0x0001F451")
  // if (sq[1] === 'K') {
    pieceLabel.textContent=`${sq[0]} ${sq[1]}`
  // } else {
  //   pieceLabel.textContent=`${sq[0]} ${sq[1]}`
  // }
  
  
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

  // get all four corner coordinates of the selected coordinate
  let arrCornersCoords = getAllCornerCoords(selCoords)

  // filter for all inside-of-gameboard coordinates (effectively remove all out-all-gameboard coordinates) 
  arrCornersCoords = filterInBoardCoords(arrCornersCoords)

  // remove coordinates that contain one of player's pieces
  arrCornersCoords = filterOwnPieceCoords(arrCornersCoords, turn)
  // console.log("Coords inside gameboard without player's pieces:")
  // console.log(arrCornersCoords)
  
  // get all the empty coordinate and assign it to a new array 
  // provided that the ipnut array of corner is cleaned up
  let arrEmptyCoords = filterAllEmptyCoords(arrCornersCoords)
  // console.log("Coords for empty squares:")
  // console.log(arrEmptyCoords)


  // get all coordinates that contain opponent's piece, and assign it to a new array
  // provided that the ipnut array of corner is cleaned up
  let arrOppCoords = filterAllOpponentCoords(arrCornersCoords, turn)
  // console.log("Coords for opponent pieces:")
  // console.log(arrOppCoords)

  // get all coordinates one square further than opponent piece from 
  // selected piece in the same direction
  let arrFurtherCoords = getAllFurtherCoords(arrOppCoords, selCoords)
  // console.log("Further coordinates:")
  // console.log(arrFurtherCoords)

  // remove all out-of-gameboard coordinates in the array of further coordinate
  arrFurtherCoords = filterInBoardCoords(arrFurtherCoords)
  // console.log(arrFurtherCoords)

  // filter for empty coordinates in the array of further coordinates
  arrFurtherCoords = filterAllEmptyCoords(arrFurtherCoords)
  console.log("Further coords inside gameboard without player's pieces:")
  console.log(arrFurtherCoords)

  let arrJumpPathCoords = []
  arrJumpPathCoords = [...arrFurtherCoords]
  console.log(arrJumpPathCoords)

  // function getFurtherJumpCoords(landCoords) {

  // }

  

  // check the remaining 3 corners to see if they are opponent's piece
  // if yes, check the further remaining 3 corners to see if they are empty
  // if yes, 

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
  
  console.log(arrEmptyCoords)
  console.log(arrFurtherCoords)
  console.log(allLandableCoords)

  allLandableCoords = [...arrEmptyCoords, ...arrFurtherCoords];

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

  console.log('All landable coords:')
  console.log(allLandableCoords)
  return allLandableCoords
}

// return array of all corner coordinate of a coordinate
function getAllCornerCoords(coords) {
  let topLeftCoord = [coords[0]-1, coords[1]-1]
  let topRightCoord = [coords[0]-1, coords[1]+1]
  let bottomRightCoord = [coords[0]+1, coords[1]+1]
  let bottomLeftCoord = [coords[0]+1, coords[1]-1] 
  return [topLeftCoord, topRightCoord, bottomRightCoord, bottomLeftCoord]
}

// remove all coordinates that contains one of player's pieces from array of coordinates
function filterOwnPieceCoords(arrCoords, playerTurn) {
  let newCoords
  newCoords = arrCoords.filter(function(coords) {
    return (board[coords[0]][coords[1]][0] !== playerTurn)
  })
  return newCoords
}

function filterAllEmptyCoords(arrCoords) {
  let arrNewCoords = arrCoords.filter(function(coords) {
    return (board[coords[0]][coords[1]][0] === 0)
  })
  return arrNewCoords
}

function filterAllOpponentCoords(arrCoords, playerTurn) {
  let arrNewCoords
  arrNewCoords = arrCoords.filter(function(coords) {
      return (board[coords[0]][coords[1]][0] === playerTurn*-1)
    })
  return arrNewCoords
}

// get array of all coordinates one square further than opponent piece 
// from selected piece in the same direction
function getAllFurtherCoords(arrOppCoords, selCoords) {
  let arrNewCoords = []
  if (!!arrOppCoords.length) { //if there is at least one opponent coordinate
    arrOppCoords.forEach(function(oppCoords) {
      arrNewCoords.push(getFurtherCornerCoords(selCoords, oppCoords))
    })
  }
  return arrNewCoords
}

// return coordinate for further corner in the same direction from selected piece and opponent piece
function getFurtherCornerCoords(selCoords, oppCoords) {
  let rDiff = oppCoords[0]-selCoords[0]
  let sDiff = oppCoords[1]-selCoords[1]
  let furtherCoords = [oppCoords[0]+rDiff, oppCoords[1]+sDiff]
  return furtherCoords
}

function filterInBoardCoords(arrCoords) {
  let arrNewCoords = []
  arrNewCoords = arrCoords.filter(function(coords) {
    return (coords[0] >=0 && coords[0] <=7 && coords[1] >=0 && coords[1] <=7)  
  })
  return arrNewCoords
}

function increaseScore(player, pointIncrease) {
  if (player === 1) score[1]+=pointIncrease
  if (player === -1) score[0]+=pointIncrease
}


function captureOppPiece(selCoords, landCoords) {
  let oppRCoords = selCoords[0] + (landCoords[0] - selCoords[0])/2
  let oppSCoords = selCoords[1] + (landCoords[1] - selCoords[1])/2
  board[oppRCoords][oppSCoords][0] = 0
  board[oppRCoords][oppSCoords][1] = 'N'
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
    // Scenario for winner
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
    // Scenario for consecutive jump
    [
      [[0,"K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [-1, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"], [0, "K"]],
      [[0, "N"], [0, "N"], [-1, "N"], [0, "K"], [0, "N"], [0, "N"], [0, "N"], [0, "N"]],
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

