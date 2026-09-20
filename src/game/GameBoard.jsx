import './Gameboard.css'

function Gameboard() {

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
                <div className={`grid`} />
            </main>
        </div>
    )
}
export default Gameboard