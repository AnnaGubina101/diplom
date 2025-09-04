import { useState } from 'react'
import './Components/Seats/Seats.css'
import Hall from './Components/Hall'
import { movies } from './data'
import Button from './Components/Button'
import Seats from './Components/Seats/Seats'

function App() {

  return (
    <>
    <div className="wrap">
      <div className='header'>
        <h1 className='header-main'>Идем<span className='header__letter'>В</span>Кино </h1>
      </div>
      <div className="main">
         {/* {movies.map( movie => <Hall key={movie.title} {...movie} />)}  */}
        <Hall {...movies[0]} />
        <Seats />
        <div className="button-wrap">
          <Button>Забронировать</Button>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
