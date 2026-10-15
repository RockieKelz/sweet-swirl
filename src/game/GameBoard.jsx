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
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

    // Function to delay immediate drop/clear action until its annimation finishes
    const showMatches = async (matches) => {
        setMatchedCells(matches)
        await new Promise (r => setTimeout(r, 300))
        setMatchedCells([])
    }
    // Function to check if there any moves availableon the gameboard
    const getPlayableBoard = async (board, rearranges = 0) => {
        //Check to process any matches and/or score updates
        const { procesedMatches, matchCount} = await processMatches(board, width, createRandomColor, showMatches)
        //Grant points with any matches
        if (matchCount > 0) {
            setScore(prevScore => prevScore + calculateScore(matchCount))                
        }
        // Board has at least one possible move
        if (hasPossibleMove(procesedMatches, width)) {
            return procesedMatches
        }
        // Maximum # of rearranges reached
        if (rearranges >= 5) {
            console.log('Game Over!')
            setGameOver(true)
            return procesedMatches
        }
        console.log(`No possible moves. Rearranging (${rearranges + 1}/5)`)
        //Tell the player that the board is being shuffled/rearranged
        setReshuffling(true)
        await delay(300)
        //Rearrange the board
        const rearranged = rearrangeBoard(procesedMatches)
        setRearrangeCount(rearranges + 1)
        // Check the rearranged board again while reshuffling message is still available
        const playableBoard = await getPlayableBoard(rearranged, rearranges - 1)
        setReshuffling(false)
        return playableBoard
    }

    const width = 6 // Default width of the game board (6x6 grid)
    const createRandomColor = () => { return cellColors[Math.floor(Math.random() * cellColors.length)] } //For random game piece selection

    /* ======== Initialize the board ========= */
    const createBoard = async () => {
        const gameArray = []
        for (let i = 0; i < width * width; i++) {
            gameArray.push(createRandomColor())
        }
        //Make sure theres playable moves
        const playableBoard = await getPlayableBoard(gameArray, rearrangeCount)
        setCells(playableBoard)
    }

    useEffect(() => {
        createBoard()
    }, [])

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
                const playableBoard = await getPlayableBoard(newSpaces, rearrangeCount)               
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
            <main className="game-body">
                <section className="score-board">
                    <h3>score</h3>
                    <h1 id="score">{score}</h1> 
                    <h8>Reshuffles Available:</h8>
                    <h7>{5-rearrangeCount}</h7>
                </section>
                    <div className="grid">
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
                    {gameOver && (
                        <div className="game-over-message">
                            Game Over!
                        </div>
                    )}</div>
            </main>
        </div>
    )
}

export default Gameboard
