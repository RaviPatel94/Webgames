import React, { useState, useEffect } from 'react'
import Btn from './Btn'

function RPS() {

  const rock="/images/rock.png"
  const paper="/images/paper.png"
  const sissor="/images/sissor.png"

  const [win, setwin]=useState(0)
  const [lose, setlose]=useState(0)
  const [tie, settie]=useState(0)
  const [usermove, setusermove] = useState(null)
  const [compmove, setcompmove] = useState(null)
  const [btnclicked, setbtnclicked] = useState(false)
  const [shared, setshared] = useState(false)
  const handleMove = (userChoice) => {

    if (!btnclicked) {setbtnclicked(true)}

    const randnum = Math.floor(Math.random() * 3);
    let computerChoice;
    if (randnum === 0) computerChoice = rock;
    else if (randnum === 1) computerChoice = paper;
    else computerChoice = sissor;
    console.log(randnum)

    setusermove(userChoice);
    setcompmove(computerChoice);

    if (computerChoice === userChoice) { 
      settie(prev => prev + 1); 
      console.log(computerChoice, userChoice, 'tie')
    } else if (
      (computerChoice === rock && userChoice === paper) ||
      (computerChoice === paper && userChoice === sissor) ||
      (computerChoice === sissor && userChoice === rock)
    ) { 
      setwin(prev => prev + 1); 
      console.log(computerChoice, userChoice, "win")
    } else { 
      setlose(prev => prev + 1); 
      console.log(computerChoice, userChoice, "lose")
    }
  };
  
  const rockclick = () => handleMove(rock);
  const paperclick = () => handleMove(paper);
  const sissorclick = () => handleMove(sissor);

  useEffect(()=>{
    scorereset()
  },[])

  function scorereset(){
    setlose(0)
    setwin(0)
    settie(0)
  }

  function share(){
    let url=window.location.href
    window.navigator.clipboard.writeText(url)
    setshared(true)
    setInterval(() => {
      setshared(false)
    }, 2500);
  }

  return (
    <div className='pt-[75px] min-h-screen bg-lightgrey flex flex-col items-center'>
      <div className=' sm:hidden border-2 border-neutral-700 w-max text-2xl mb-[15px]'><div className='scorebox bg-lightgrey flex items-center gap-[12px] px-6 py-[3px]'>Win : <span className='scorebox px-1'>{win}</span> Lose : <span className='scorebox px-1'>{lose}</span> Tie : <span className='scorebox px-1'>{tie}</span></div></div>
        <div className='relative w-screen flex justify-between px-3 sm:px-7 text-2xl '>
          <Btn text="Reset" ClickEvent={scorereset}/>
          <div className='hidden sm:block border-2 border-neutral-700'><div className='scorebox bg-lightgrey flex items-center gap-[6px] px-4 py-[3px]'>Win : <span className='scorebox px-1'>{win}</span> Lose : <span className='scorebox px-1'>{lose}</span> Tie : <span className='scorebox px-1'>{tie}</span></div></div>
          <Btn text="Share" ClickEvent={share}/>
          <div className={'absolute bg-lightgrey scorebox right-2 top-12 z-40 '+ (shared?"":"hidden")}>Link Copied</div>
        </div>
        <div className='w-screen pt-6 lg:pt-14 px-4 lg:px-24 flex-col lg:flex-row flex justify-center items-center gap-8 lg:gap-16'>
          <div className={' relative bg-[#595959] size-80 lg:size-[360px] shrink-0 border-4 scorebox overflow-hidden '+ (btnclicked ? "":"flex justify-center items-center")}>
            <h1 className={'text-4xl text-white absolute'+(btnclicked?"static hidden":"")}>Choose a move</h1>
            <img src={compmove} alt="" className=' h-36 relative left-14 top-6 rotate-[140deg]' />
            <img src={usermove} alt="" className=' h-36 relative left-40 lg:left-48 lg:top-10 -rotate-45'/>
          </div>
          <div className='lg:hidden flex text-2xl justify-between w-72'>
              <Btn text="Rock" ClickEvent={rockclick}/>
              <Btn text="Paper" ClickEvent={paperclick}/>
              <Btn text="Sissor" ClickEvent={sissorclick}/>
            </div>
          <div className='flex flex-col gap-10'>
            <h1 className='text-4xl text-center'>Rock Paper Sissor</h1>
            <p className='text-2xl font-medium lg:w-[600px] pb-7 lg:pb-0'>Rock Paper Scissors is a simple hand game where two players simultaneously choose one of three shapes: Rock, Paper, or Scissors. The winner is determined by these rules: Rock beats Scissors, Scissors beats Paper, and Paper beats Rock. If both players choose the same shape, it's a tie. This game is often used to make quick decisions.</p>
            <div className=' hidden lg:flex text-2xl justify-between w-72'>
              <Btn text="Rock" ClickEvent={rockclick}/>
              <Btn text="Paper" ClickEvent={paperclick}/>
              <Btn text="Sissor" ClickEvent={sissorclick}/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default RPS