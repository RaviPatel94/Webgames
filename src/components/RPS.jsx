import React, { useState } from 'react'

function RPS() {
  const [win, countwin]=useState(0)
  const [lose, countlose]=useState(0)
  const [tie, counttie]=useState(0)

  return (
    <div className='pt-16 h-screen bg-lightgrey'>
        <div className='flex justify-between px-7 text-3xl'>
          <div className='border-2 border-black h-max'>
          <div className='leftbtn'>Reset</div></div>
          <div className='border-2 border-black flex items-center gap-1 px-3 py-[2px]'>Win : <span className='border-2 border-black py-[1px]'><span className='scorebox'>{win}</span></span> Lose : <span className='border-2 border-black py-[1px]'><span className='scorebox'>{lose}</span></span> Tie : <span className='border-2 border-black py-[1px]'><span className='scorebox'>{tie}</span></span></div>
          <div className='border-2 border-black h-max'>
          <div className="rightbtn">Share</div></div>
        </div>
        <div></div>
    </div>
  )
}

export default RPS