import React from 'react'
import { Link, Links } from 'react-router-dom'

function Hero() {
  return (
    <main className='pt-[80px] px-5 sm:px-10 min-h-screen bg-lightgrey grid auto-cols-min grid-cols-2 sm:grid-cols-5 auto-rows-min justify-items-center gap-7 sm:gap-6 '>
      <div>
      <img src="/images/websitelogo.png" alt="" className='size-[140px] sm:size-[170px] sm:min-h-[170px] sm:min-w-[170px]' />
      </div>
      <Link to={"/rps"}>
      <div className='relative flex justify-center items-center group '>
      <img src="/images/rps.jpg" alt="" className='size-[140px] sm:size-[170px] sm:min-h-[170px] sm:min-w-[170px] group-hover:brightness-[0.35] cursor-pointer ' />
      <h1 className=' hidden group-hover:block absolute text-white text-4xl text-center font-semibold text'>Rock Paper Sissor</h1>
      </div>     
      </Link>
      <div>
      <img src="/images/comingsoon.png" alt="" className='size-[140px] sm:size-[170px] sm:min-h-[170px] sm:min-w-[170px]' />
      </div>    
    </main>
  )
}

export default Hero