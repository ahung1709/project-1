console.log("Connected!")

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



/*----- cached element references -----*/
let gameBoardEl = document.getElementById('gameboard')
gameBoardEl.addEventListener('click', handleClick)

/*----- event listeners -----*/


/*----- functions -----*/

