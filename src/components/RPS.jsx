import React, { useState, useEffect } from 'react'
import Btn from './Btn'

function RPS() {

  const rock="/images/rock.png"
  const paper="/images/paper.png"
  const sissor="/images/sissor.png"

  const [win, countwin]=useState(0)
  const [lose, countlose]=useState(0)
  const [tie, counttie]=useState(0)
  const [usermove, setusermove] = useState(paper)
  const [compmove, setcompmove] = useState(paper)

  useEffect(() => {
    let randnum=Math.floor(Math.random()*3)
    if(randnum===0) setcompmove(rock)
    else if(randnum===1) setcompmove(paper)
    else if(randnum===2) setcompmove(sissor)
  }, [])
  

  return (
    <div className='pt-[75px] h-screen bg-lightgrey flex flex-col'>
        <div className='flex justify-between px-7 text-2xl'>
          <Btn text="Reset"/>
          <div className='border-2 border-neutral-700'><div className='scorebox bg-lightgrey flex items-center gap-[6px] px-4 py-[3px]'>Win : <span className='scorebox px-1'>{win}</span> Lose : <span className='scorebox px-1'>{lose}</span> Tie : <span className='scorebox px-1'>{tie}</span></div></div>
          <Btn text="Share"/>
        </div>
        <div className='w-screen pt-14 px-24 flex justify-center items-center gap-16'>
          <div className='bg-[#595959] size-[360px] shrink-0 border-4 scorebox overflow-hidden'>
            <img src={compmove} alt="" className=' h-36 relative left-14 top-6 rotate-[140deg]' />
            <img src={usermove} alt="" className=' h-36 relative left-48 top-10 -rotate-45'/>
          </div>
          <div className='flex flex-col gap-10'>
            <h1 className='text-4xl'>Rock Paper Sissor</h1>
            <p className='text-2xl font-medium w-[600px]'>Rock Paper Scissors is a simple hand game where two players simultaneously choose one of three shapes: Rock, Paper, or Scissors. The winner is determined by these rules: Rock beats Scissors, Scissors beats Paper, and Paper beats Rock. If both players choose the same shape, it's a tie. This game is often used to make quick decisions.</p>
            <div className='flex text-2xl justify-between w-72'>
              <Btn text="Rock"/>
              <Btn text="Paper"/>
              <Btn text="Sissor"/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default RPS