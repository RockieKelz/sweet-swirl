import { useEffect, useState } from 'react'
import { blue, green, orange, pink, purple, red, white } from '../assets'
import './Gameboard.css'
import { hasPossibleMove, isPartOfAMatch } from './MatchLogic'
import { processMatches, rearrangeBoard } from './RemovePieces'
import { calculateScore } from './Scoring'

// Array of icons used to represent each cell's colors
const cellColors = [
    'url(' + blue + ')',
    'url(' + green + ')',
    'url(' + orange + ')',
    'url(' + pink + ')',
    'url(' + purple + ')',
    'url(' + red + ')',
    'url(' + white + ')'
]

function Gameboard() {
    const [cells, setCells] = useState([])
    const [cellBeingDragged, setCellBeingDragged] = useState(null)
    const [cellBeingReplaced, setCellBeingReplaced] = useState(null)
    const [matchedCells, setMatchedCells] = useState([])
    const [score, setScore] = useState(0)
    const [rearrangeCount, setRearrangeCount] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [reshuffling, setReshuffling] = useState(false)
    const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))}
    const [exited, setExited] = useState(false) //Track if the user has exited the game to prevent state updates on unmounted component
    const [levelingUp, setLevelingUp] = useState(false) // Track if the player is leveling up to prevent state updates on unmounted component
    const [boardSize, setBoardSize] = useState(4) // Track the current board size state based on score
    const getBoardSize = (score) => {
    if (score < 75) return 4;
    if (score <= 150) return 5;
    if (score <= 300) return 6;
    if (score <= 500) return 7;
    return 8;}

    // Function to delay immediate drop/clear action until its annimation finishes
    const showMatches = async (matches) => {
        setMatchedCells(matches)
        await new Promise (r => setTimeout(r, 300))
        setMatchedCells([])
    }
    // Function to check if there any moves availableon the gameboard
    const getPlayableBoard = async (board, rearranges = 0, size = boardSize, hasReshuffled = false) => {
        //Check to process any matches and/or score updates
        const { procesedMatches, matchCount} = await processMatches(board, size, createRandomColor, showMatches)
        //Grant points with any matches
        if (matchCount > 0) {
            setScore(prevScore => prevScore + calculateScore(matchCount))                
        }
        // Board has at least one possible move
        if (hasPossibleMove(procesedMatches, size)) {
            if (hasReshuffled){
                setRearrangeCount(prev => prev + 1)
            }
            setReshuffling(false)
            return procesedMatches
        }
        
        // Maximum # of rearranges reached
        if (rearranges >= 5) {
            console.log('Game Over!')
            setReshuffling(false)
            setGameOver(true)
            return procesedMatches
        }
        console.log(`No possible moves. Rearranging (${rearranges + 1}/5)`)
        //Tell the player that the board is being shuffled/rearranged
        setReshuffling(true)
        await delay(300)
        //Rearrange the board
        const rearranged = rearrangeBoard(procesedMatches)
        
        // Check the rearranged board again while reshuffling message is still available
        return await getPlayableBoard(rearranged, rearranges + 1, size, true)
    
    }

    const width = boardSize // Set the width of the board based on the current board size state
    const createRandomColor = () => { return cellColors[Math.floor(Math.random() * cellColors.length)] } //For random game piece selection

    /* ======== Initialize the board ========= */
    const createBoard = async (size = boardSize, rearranges = 0) => {
        const gameArray = []
        for (let i = 0; i < size * size; i++) {
            gameArray.push(createRandomColor())
        }
        //Make sure theres playable moves
        const playableBoard = await getPlayableBoard(gameArray, rearranges, size)
        setCells(playableBoard)
    }

    /* ======== Play again button handler ======== */
    const handlePlayAgain = async () => {
        // Reset all game states
        setGameOver(false)
        setScore(0)
        setBoardSize(4)
        setMatchedCells([])
        setLevelingUp(false)
        setRearrangeCount(0)
        setReshuffling(false)
        setMatchedCells([])
        setCellBeingDragged(null)
        setCellBeingReplaced(null)
        setExited(false)
        // Clear the board and create a new one
        setCells([])
        await createBoard(4, 0)
    }
    
    useEffect(() => {
        createBoard(4, 0) // Initialize the board with a 4x4 grid and 0 rearranges
    }, []) 

        useEffect(() => {
        const newBoardSize = getBoardSize(score) // Increase board size every level up from points, max size of 8
        if (newBoardSize > boardSize) {
            setLevelingUp(true)
            const newRearrangeCount = Math.max(0, rearrangeCount - 1)
            const timer = setTimeout(async () => {
                setBoardSize(newBoardSize)
                setRearrangeCount(newRearrangeCount) // Subtract one to increase number of rearranges avaiable when leveling up
                setLevelingUp(false)
                await createBoard(newBoardSize, newRearrangeCount) // Create a new board with the updated size
        }, 2000)

        return () => clearTimeout(timer)
    }
}, [score, boardSize]) // Check for level up whenever the score changes

    /* ========= Drag and Drop handlers ======== */
    const dragStart = (e) => {
        setCellBeingDragged(e.target)
    }

    const dragDrop = (e) => {
        setCellBeingReplaced(e.target)
    }

    const dragEnd = async () => {
        // Ensure both elements exist before reading attributes
        if (!cellBeingDragged || !cellBeingReplaced) return

        //Get the IDs of the dragged and replaced cells
        const draggedId = parseInt(cellBeingDragged.getAttribute('id'))
        const replacedId = parseInt(cellBeingReplaced.getAttribute('id'))
        // Calculate the row and column of the dragged and replaced cells
        const row = Math.floor(draggedId / width)
        const column = draggedId % width
        const replacedRow = Math.floor(replacedId / width)
        const replacedColumn = replacedId % width

        // Check if the dragged and replaced cells are adjacent
        const isAdjacent = Math.abs(row - replacedRow) + Math.abs(column - replacedColumn) === 1

        if (isAdjacent) {
            // Create a copy of the squares array to test the swap
            const newSpaces = [...cells]
            const temp = newSpaces[replacedId]
            newSpaces[replacedId] = newSpaces[draggedId]
            newSpaces[draggedId] = temp
            
            // Only allow the move if the dragged tile OR replaced tile caused a match
            if (isPartOfAMatch(draggedId, newSpaces, width) || isPartOfAMatch(replacedId, newSpaces, width)) {
                console.log("Valid move: This swap creates a match!")
                //Make sure there's playable moves
                const playableBoard = await getPlayableBoard(newSpaces, rearrangeCount, boardSize)               
                setCells(playableBoard)
            } else {
                console.log("Invalid move: This swap doesn't create a match!")            }
        } else {
            console.log("Invalid move: Tiles are not adjacent!")
        }
        // Reset drag tracking states
        setCellBeingDragged(null)
        setCellBeingReplaced(null)
    }

    return (
        <div className="game-container">
            <header className="game-header">
                <h1>Sweet Swirl</h1>
            </header>
            { exited ? (
                <div className="exit-container">
                    <div className="exit-message-card">
                        <h2>Thanks for playing Sweet Swirl!</h2>
                        <button onClick={handlePlayAgain} className="play-again-button">
                            Play Again
                        </button>                    
                    </div>
                </div>
            ) : (
                <main className="game-body">
                    <section className="score-board">
                        <h3>score</h3>
                        <h1 id="score">{score}</h1> 
                        <h8>Reshuffles Available:</h8>
                        <h7>{5-rearrangeCount}</h7>
                    </section>
                        <div className="grid"
                            style={{
                                gridTemplateColumns: `repeat(${width}, 1fr)`
                            }}>
                            {cells.map((color, index) => (
                                <div 
                                    key={index}                      
                                    id={index}
                                    className={matchedCells.includes(index) ? 'matched' : ''}
                                    draggable={!gameOver && !reshuffling}
                                    onDragStart={dragStart}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragEnter={(e) => e.preventDefault()}
                                    onDragLeave={(e) => e.preventDefault()}
                                    onDrop={dragDrop}
                                    onDragEnd={dragEnd}
                                    style={{ backgroundImage: color }}
                                />
                            ))}
                        
                        {reshuffling && (
                            <div className="board-message reshuffling-message">
                                <div className="thinking-text">
                                    RESHUFFLING<span className="dots">...</span>
                                </div>
                            </div>
                        )}
                        {levelingUp && (
                            <div className="board-message level-up-message">
                                <div className="thinking-text">
                                    LEVEL UP!
                                </div>
                                <p>Increasing board size...</p>
                            </div>
                        )}
                        {gameOver && (
                            <div className="game-over-message">
                                <h2> Game Over! </h2>
                                <p> No More Moves. Play again? </p>
                                <div className="game-over-buttons">
                                    <button className="play-again-button" onClick={handlePlayAgain}>Play Again</button>
                                    <button className="exit-button" onClick={() => setExited(true)}>Exit</button>
                                </div>
                            </div>
                        )}</div>
                </main>
            )}
        </div>
    )
}

export default Gameboard
