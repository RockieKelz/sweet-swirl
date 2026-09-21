/* ===== CHECK FOR MATCHES IN A COLUMN ===== */
export const checkForColumnMatches = (grid, index, color, width) => {
    // Calculate the column of the index
    const column = index % width
    let matched = false
    // Check for matches in the column containing the index
    for (
        let row = Math.max(0, Math.floor(index / width) - 2);
        row <= Math.min(Math.floor(index / width), Math.floor(grid.length / width) - 3);
        row++
    ) {
        // Calculate the index of the cell in the current row and column
        const i = row * width + column
        // Check if the current cell and the next two cells in the column have the same color
        if ( grid[i] === color && 
            grid[i + width] === color && 
            grid[i + width * 2] === color) { 
                matched = true
            }
        }
        return matched 
    }

/* ===== CHECK FOR MATCHES IN A ROW ===== */
export const checkForRowMatches = (grid, index, color, width) => {
    // Calculate the starting index of the row containing the index
    const rowStart = Math.floor(index / width) * width
    let matched = false
    // Check for matches in the row containing the index
    for ( 
        let i = Math.max(rowStart, index - 2); 
        i <= Math.min(rowStart + width - 3, index); i++) {
            // Check if the current cell and the next two cells in the row have the same color
            if (grid[i] === color && grid[i+1] === color && grid[i+2] === color) {
                matched = true 
            }
        }
        return matched 
    }


