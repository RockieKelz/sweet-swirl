import { useEffect, useState } from 'react'
import { blue, green, orange, pink, purple, red, white } from '../assets'
import './Gameboard.css'

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
    //create the gameboard  
    const [squares, setSquares] = useState([])
    const width = 6
    
    useEffect(() => {
        const randomSquares = []
        for (let i = 0; i < width*width; i++) {
            const randomColor = cellColors[Math.floor(Math.random() * cellColors.length)]
            randomSquares.push(randomColor)
        }
        setSquares(randomSquares)
    }
    , [])

        
    return (
        <div className="game-container">
            <header className="game-header">
                <h1>Sweet Swirl</h1>
            </header>
            <main className="game-body">
                <section className="score-board">
                    <h3>score</h3>
                    <h1 id="score"></h1> 
                </section>
                <div className={`grid`}>
                    {squares.map((color, index) => (
                        <div 
                            key={index}                      
                            id={index}
                            draggable="true"
o                           onDragStart={(e) => e.dataTransfer.setData("text/plain", index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                const draggedIndex = e.dataTransfer.getData("text/plain")
                                const targetIndex = index
                                const newSquares = [...squares]
                                newSquares[targetIndex] = squares[draggedIndex]
                                newSquares[draggedIndex] = squares[targetIndex]
                                setSquares(newSquares)}}
                        style={{ backgroundImage: color }}></div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Gameboard
