import React, { useState, useEffect } from 'react';
import Btn from '../components/Btn';

function G2048() {
  const [board, setBoard] = useState([]);
  const [score, setscore] = useState(0);
  const [pb, setpb] = useState(0)

  useEffect(() => {
    initialize();
  }, []);

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

    console.log(newBoard);
    setBoard(newBoard);
  };

  return (
    <div className="min-h-screen bg-lightgrey pt-[75px] text-2xl w-screen">
       <div className='flex w-screen justify-between px-20'>
        <Btn text="reset"/>
        <div className='scorebox px-3'>
          Score : {score}
        </div>
        <div className='scorebox px-3'>
          PB : {pb}
        </div>
        <Btn text="share"/>
       </div>
      <div className='flex items-center justify-center'>
        <div className="bg-lightgrey size-80 lg:size-[360px] scorebox grid grid-cols-4 gap-2">
          {board.map((block, index) => (
            <div
              key={index} // Provide a unique key for each element
              className="flex items-center justify-center"
            >
              {block}
            </div>
          ))}
        </div>
        <div>
          <h1 className='text-4xl text-center'>
            2048
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
