import React, { useRef, useEffect } from 'react'
import { Link, Links } from 'react-router-dom'

function Hero() {

  const audioRef = useRef(null);
  
      useEffect(() => {
          audioRef.current = new Audio("/sounds/select.mp3");
          
          audioRef.current.preload = 'auto';
      }, []);
  
      const sound = () => {
          if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
          }
      }

  return (
    <main className='pt-[80px] px-5 sm:px-10 min-h-screen bg-lightgrey grid auto-cols-min grid-cols-2 sm:grid-cols-5 auto-rows-min justify-items-center gap-7 sm:gap-6 '>
      <div>
      <img src="/images/websitelogo.png" alt="" className='size-[140px] sm:size-[170px] sm:min-h-[170px] sm:min-w-[170px]' />
      </div>
      <Link to={"/matchthechessman"}>
      <div className='relative flex justify-center items-center group'  onClick={sound}>
      <img src="/images/matchchess.png" alt="" className='size-[140px] sm:size-[170px] sm:min-h-[170px] sm:min-w-[170px] bg-lightgrey scorebox group-hover:brightness-[0.35] cursor-pointer ' />
      <h1 className=' hidden group-hover:block absolute text-white text-4xl text-center font-semibold text'>Match the chessman</h1>
      </div>     
      </Link>
      <Link to={"/matchthetiles"}>
      <div className='relative flex justify-center items-center group'  onClick={sound}>
      <img src="/images/mtt.png" alt="" className='size-[140px] sm:size-[170px] sm:min-h-[170px] sm:min-w-[170px] bg-lightgrey scorebox group-hover:brightness-[0.35] cursor-pointer ' />
      <h1 className=' hidden group-hover:block absolute text-white text-4xl text-center font-semibold text'>Match the tiles</h1>
      </div>     
      </Link>
      <Link to={"/rps"}>
      <div className='relative flex justify-center items-center group ' onClick={sound}>
      <img src="/images/rps.jpg" alt="" className='size-[140px] sm:size-[170px] sm:min-h-[170px] sm:min-w-[170px] brightness-[0.78] scorebox group-hover:brightness-[0.35] cursor-pointer ' />
      <h1 className=' hidden group-hover:block absolute text-white text-4xl text-center font-semibold text'>Rock Paper Scissor</h1>
      </div>     
      </Link>
      <Link to={"/2048"}>
      <div className='relative flex justify-center items-center group'  onClick={sound}>
      <img src="/images/2048.png" alt="" className='size-[140px] sm:size-[170px] sm:min-h-[170px] sm:min-w-[170px] bg-lightgrey scorebox group-hover:brightness-[0.35] cursor-pointer ' />
      <h1 className=' hidden group-hover:block absolute text-white text-4xl text-center font-semibold text'>2048</h1>
      </div>     
      </Link>
      <Link to={"/fastclicker"}>
      <div className='relative flex justify-center items-center group'  onClick={sound}>
      <img src="/images/click.png" alt="" className='size-[140px] sm:size-[170px] sm:min-h-[170px] sm:min-w-[170px] bg-lightgrey scorebox group-hover:brightness-[0.35] cursor-pointer ' />
      <h1 className=' hidden group-hover:block absolute text-white text-4xl text-center font-semibold text'>Fast Clicker</h1>
      </div>     
      </Link>
      <div className='scorebox'>
      <img src="/images/comingsoon.png" alt="" className='size-[140px] sm:size-[170px] sm:min-h-[170px] sm:min-w-[170px]' />
      </div>    
    </main>
  )
}

export default Hero