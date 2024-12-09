import React from 'react'
import { Link, Links } from 'react-router-dom'

function Hero() {
  return (
    <main className='pt-[80px] px-10 min-h-screen bg-lightgrey grid auto-cols-min grid-cols-5 auto-rows-min justify-items-center gap-6 '>
      <div>
      <img src="/images/websitelogo.png" alt="" className='size-[170px]' />
      </div>
      <Link to={"/rps"}>
      <div>
      <img src="/images/rps.jpg" alt="" className='size-[170px] hover:brightness-75 cursor-pointer' />
      </div>     
      </Link>    
    </main>
  )
}

export default Hero