import { useState } from 'react'
import './App.css'
import winkFace from './assets/face.png'
import stackImg from './assets/hero.png'
import swirlCup from './assets/swirl cup.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={stackImg} className="base" width="170" height="179" alt="" />
          <img src={swirlCup} className="bottom" alt="cup" />
          <img src={winkFace} className="top" alt="" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">

        </div>
      </section>
      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
