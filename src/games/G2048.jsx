import React, { useState, useEffect } from 'react';
import Btn from '../components/Btn';

function G2048() {
  const [board, setBoard] = useState([]);
  const [score, setscore] = useState(0);
  const [pb, setpb] = useState(0)

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowRight') {
        handleright();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [board]);

  const initialize = () => {
    let initialblock1 = Math.random() < 0.9 ? 2 : 4;
    let initialblock2 = Math.random() < 0.9 ? 2 : 4;
    let initialposition1 = Math.floor(Math.random() * 16);
    let initialposition2 = Math.floor(Math.random() * 16);

    while (initialposition2 === initialposition1) {
      initialposition2 = Math.floor(Math.random() * 16);
    }

    const newBoard = [];
    for (let i = 0; i < 16; i++) {
      if (i === initialposition1) newBoard.push(initialblock1);
      else if (i === initialposition2) newBoard.push(initialblock2);
      else newBoard.push(0);
    }
    setBoard(newBoard);
  };

  window.addEventListener.key

  const handleright=()=>{
    console.log(board)
    for(let i=0; i<16;i++){
      if (i%4===0){
        console.log(i)
        let first=board[i]
        let second=board[i+1]
        let third=board[i+2]
        let fourth=board[i+3]
        let row=[Number(first),Number(second),Number(third),Number(fourth)]
        console.log(row)

        let filteredrow=row.filter(num=>num)
        console.log(filteredrow)
      }
  }}

    const [shared, setshared] = useState(false)
    const shareLink = () => {
      let url = window.location.href
      window.navigator.clipboard.writeText(url)
      setshared(true)
      setTimeout(() => setshared(false), 2500)
    }


  return (
    <div className="min-h-screen bg-lightgrey pt-[75px] text-2xl w-screen">
       <div className='flex w-screen justify-between px-20'>
        <Btn text="reset" ClickEvent={initialize}/>
        <div className='scorebox px-3'>
          Score : {score}
        </div>
        <div className='scorebox px-3'>
          PB : {pb}
        </div>
        <div className='relative'>
          <Btn text="Share" ClickEvent={shareLink}/>
          <div className={'absolute bg-lightgrey scorebox top-10 z-40 '+ (shared?"":"hidden")}>
            Link Copied
          </div>
        </div>
       </div>
      <div className='flex items-center justify-center pt-12 gap-16'>
        <div className='border-[3px] border-neutral-600'>
        <div className="bg-lightgrey size-80 border-4 lg:size-[360px] scorebox grid grid-cols-4 gap-1 ">
          {board.map((block, index) => (
            <div
              key={index}
              className="flex items-center justify-center btnnohover h-full"
            >
              {block}
            </div>
          ))}
        </div>
        </div>
        <div className='flex flex-col gap-10'>
          <h1 className='text-4xl text-center'>
            2048 (Not completed)
          </h1>
          <h2 className='max-w-[600px]'>
          2048 is a highly addictive puzzle game where players slide numbered tiles on a grid to combine them and create a tile with the number 2048. The goal is to strategize and merge tiles by matching numbers, doubling their value with each move. The challenge lies in managing the limited grid space and planning ahead to avoid running out of moves. Whether you're aiming for the elusive 2048 tile or challenging yourself to go even higher, this game is a fun and engaging way to test your logic, planning, and problem-solving skills!
          </h2>
        </div>
      </div>
    </div>
  );
}

export default G2048;
