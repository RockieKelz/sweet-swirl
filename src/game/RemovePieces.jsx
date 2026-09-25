/* ===== FIND ALL MATCHES TO REMOVE PIECES IN THE GRID ===== */
export const findMatches = (grid, width) => {
    // Create a set to store the indices of matched pieces
    const matches = new Set()

    // Check for horizontal matches
    for (let row = 0; row < width; row++) {
        for (let column = 0; column <= width - 3; column++) {

            const index = row * width + column
            const color = grid[index]

            if (
                color &&
                grid[index + 1] === color &&
                grid[index + 2] === color
            ) {
                matches.add(index)
                matches.add(index + 1)
                matches.add(index + 2)
            }
        }
    }
    // Check for vertical matches
     for (let column = 0; column < width; column++) {
        for (let row = 0; row <= width - 3; row++) {

            const index = row * width + column
            const color = grid[index]

            if (
                color &&
                grid[index + width] === color &&
                grid[index + width * 2] === color
            ) {
                matches.add(index)
                matches.add(index + width)
                matches.add(index + width * 2)
            }
        }
    }

    return [...matches]
}
/* ====== MOVE PIECES DOWNWARD AFTER MATCHES ===== */
export const movePiecesDown = (grid, width) => {
    const newGrid = [...grid]
    for (let col = 0; col < width; col++) {
        let writeRow = width - 1
        for (let row = width - 1; row >= 0; row--) {
            const index = row * width + col
            if (newGrid[index] !== null) {
                const writeIndex = writeRow * width + col
                newGrid[writeIndex] = newGrid[index]
                if (writeIndex !== index) {
                    newGrid[index] = null
                }
                writeRow--
            }
        }
    }
    return newGrid
}
/* ======= AUTOMATIC MATCH CHECK AFTER REGENERATION ======*/
export const processMatches = async (grid, width, createRandomColor, showMatches) => {
    let newGrid = [...grid]
    let matchesMade = 0

    while (true) {
        //Find the matches in the array
        const matches = findMatches(newGrid, width)
        // If no matches → board is resolved
        if (matches.length === 0) {
            break
        }

        matchesMade += matches.length
        // Tell React which pieces are matched and need to be "animated" away
        await showMatches(matches)
        // Remove matched pieces
        matches.forEach(index => {
            newGrid[index] = null
        })
        // Drop existing pieces
        newGrid = movePiecesDown(newGrid, width)
        // Refill empty spaces
        newGrid = newGrid.map(
            cell => cell ?? createRandomColor()
        )
    }
    return { 
        procesedMatches: newGrid,
        matchCount: matchesMade
    }
}
