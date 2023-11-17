document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid")
    let squares= Array.from(document.querySelectorAll(".grid div")) //Converts those div's into an array
    const scoreDisplay = document.getElementById("score")
    const startBtn = document.getElementById("start-button")
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'green',
        'red',
        'blue',
        'purple'
    ]
    
//The Tetrominoes
    const lTetrominos = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetrominos = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]

    const tTetrominos = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oTetrominos = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iTetrominos = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]
    const theTetrominoes = [lTetrominos, zTetrominos, tTetrominos, oTetrominos, iTetrominos]
    
    let currentPosition = 4; 
    let currentRotation = 0;         //The currentPosition variable represents where on the grid's array we currently are.
    //let current = theTetrominoes[0][0] //this is the tetromino's shape
    
    //randomly select a Tetromino and its first iteration
    let random =  Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]
    
    //draw the tetrominos
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //undraw the tetrominos
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    //make the tetromino move down every second
    // timerId= setInterval(moveDown, 1000)

    //assign functions to keycodes
    function control(e){
        if(e.keyCode === 37){
            moveLeft()
        } else if (e.keyCode === 38){
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    //move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }
    
    //freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //move the tetromino left, unless it is at the edge or there is a blockage

    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0) //This statement to check if there's any tetromino in the left edge
        if(!isAtLeftEdge) currentPosition -= 1 //If there are no tetromino's in the left edge then the value of currentPosition decreases by 1 which moves our tetromino to the left.
    
        if(current.some(index => squares[currentPosition + index].classList.contains("taken")))
        {
            currentPosition += 1
        }

        draw()
    }

    //move the tetromino right, unless it is at the edge or there is a blockage.

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

        if (!isAtRightEdge) currentPosition += 1 //this is because to move the tetromino to the right, which increases the value.
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -=1 //to move the tetromino back to left when there is a conflict.
        }
        draw()
    }

    //rotate the tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length){ //if the current rotation gets to 4, make it go back to 0
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    //show up the next tetromino in mini grid
    const displaySquares = document.querySelectorAll(".mini-grid div")
    const displayWidth = 4
    const displayIndex = 0
    

    //The tetromino's without rotation
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

  // display the shape in the mini-grid display
    function displayShape() {
    // remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
    })
        upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
    }

    //add functionality to the button
    startBtn.addEventListener("click", () => {
        if (timerId) {
            clearInterval(timerId) //if timerId is true then game is running, it stops the game by saying timerId is null
            timerId = null
        }   else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    function addScore(){
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains("taken"))){
                score +=10
                scoreDisplay.innerHTML = score
                row.forEach(index =>{
                    squares[index].classList.remove("taken")
                    squares[index].classList.remove("tetromino")
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
        
    }

    //game over
    function gameOver(){
        if (current.some(index => squares[currentPosition + index].classList.contains("taken"))){
            scoreDisplay.innerHTML = 'End'
            clearInterval(timerId)
        }
    }

    
    })