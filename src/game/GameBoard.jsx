import { useEffect, useState } from 'react'
import { blue, green, orange, pink, purple, red, white } from '../assets'
import './Gameboard.css'
import { checkForColumnMatches, checkForRowMatches } from './MatchLogic'
import { processMatches } from './RemovePieces'

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

    // Function to delay immediate drop/clear action until its annimation finishes
    const showMatches = async (matches) => {
        setMatchedCells(matches)
        await new Promise (r => setTimeout(r, 300))
        setMatchedCells([])
}

    const width = 6 // Default width of the game board (6x6 grid)
    const createRandomColor = () => { return cellColors[Math.floor(Math.random() * cellColors.length)] } //For random game piece selection

    /* ======== Initialize the board ========= */
    const createBoard = async () => {
        const gameArray = []
        for (let i = 0; i < width * width; i++) {
            gameArray.push(createRandomColor())
        }
        setCells(await processMatches(gameArray, width, createRandomColor, showMatches))
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
            
            const isPartOfAMatch = (index, grid) => {
                const color = grid[index]
                if (!color) return false
                
                // Check if there is a horizontal match containing this index
                const rowMatchCheck = checkForRowMatches(grid, index, color, width)
                // Check if there is a vertical match containing this index
                const columnMatchCheck = checkForColumnMatches(grid, index, color, width)
                if (rowMatchCheck || columnMatchCheck) {
                    return true
                }
            }
            // Only allow the move if the dragged tile OR replaced tile caused a match
            if (isPartOfAMatch(draggedId, newSpaces) || isPartOfAMatch(replacedId, newSpaces)) {
                console.log("Valid move: This swap creates a match!")
                const procesedMatches = await processMatches(newSpaces, width, createRandomColor, showMatches)
                setCells(procesedMatches)
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
                    <h1 id="score">{/*score*/}</h1> 
                </section>
                <div className="grid">
                    {cells.map((color, index) => (
                        <div 
                            key={index}                      
                            id={index}
                            className={matchedCells.includes(index) ? 'matched' : ''}
                            draggable="true"
                            onDragStart={dragStart}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={(e) => e.preventDefault()}
                            onDragLeave={(e) => e.preventDefault()}
                            onDrop={dragDrop}
                            onDragEnd={dragEnd}
                            style={{ backgroundImage: color }}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Gameboard
