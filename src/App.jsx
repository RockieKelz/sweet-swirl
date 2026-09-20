import './App.css'
import winkFace from './assets/face.png'
import stackImg from './assets/hero.png'
import swirlCup from './assets/swirl cup.png'
import Gameboard from './game/GameBoard'

import { useEffect, useState } from 'react'

function App() {
  // State to manage the fade-in and fade-out effect
  const [fadeState, setFadeState] = useState('fade-in')

  useEffect(() => {
    // Instantly set the fade state to 'fade-in' when the component mounts
    const fadeInTimer = setTimeout(() => { setFadeState('visible') }, 50)
    // Keep text fully visible for 3 seconds before starting the fade-out effect
    const setVisibleTimer = setTimeout(() => {
      setFadeState('fade-out')
    }, 3050) // 3 seconds of visibility + 50ms for fade-in

    // Redirect to the next page after the fade-out effect completes (3.5 seconds)
    const redirectTimer = setTimeout(() => {
      setFadeState('game')
    }, 3050)
     
    // Clear the timeouts when the component unmounts to prevent memory leaks
    return () => {
      clearTimeout(fadeInTimer)
      clearTimeout(setVisibleTimer)
      clearTimeout(redirectTimer)
    }
  }, [])
  // Optional: Prevent rendering if we are in the middle of redirecting
  if (fadeState === 'game') {
    return < Gameboard />
  }
  return (
    <>
      <section id="center">
        <div className={`text-container ${fadeState}`}>
          <h1>Let's get swirling</h1>
        </div>
        <div className="stacker">
          <img src={stackImg} className="base" width="170" height="179" alt="" />
          <img src={winkFace} className="top" alt="" />
          <img src={swirlCup} className="bottom" alt="cup" />

        </div>
      </section>
    </>
  )
}

export default App
