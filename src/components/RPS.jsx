import React, { useState } from 'react'
import Btn from './Btn'

function RPS() {
  const [win, countwin]=useState(0)
  const [lose, countlose]=useState(0)
  const [tie, counttie]=useState(0)

  return (
    <div className='pt-[75px] h-screen bg-lightgrey'>
        <div className='flex justify-between px-7 text-2xl'>
          <Btn text="Reset"/>
          <div className='border-2 border-neutral-700'><div className='scorebox bg-lightgrey flex items-center gap-[6px] px-4 py-[3px]'>Win : <span className='scorebox px-1'>{win}</span> Lose : <span className='scorebox px-1'>{lose}</span> Tie : <span className='scorebox px-1'>{tie}</span></div></div>
          <Btn text="Share"/>
        </div>
        <div></div>
    </div>
  )
}

export default RPS