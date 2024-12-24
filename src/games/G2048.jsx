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
        moveright();
      } 
      else if (event.key === 'ArrowLeft') {
        moveleft();
      }
      else if (event.key === 'ArrowDown') {
        movedown();
      }
      else if (event.key === 'ArrowUp') {
        moveup();
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



  const moveright=()=>{
    const newboard=[...board]
    for(let i=0; i<16;i++){
      if (i%4===0){
        let first=board[i]
        let second=board[i+1]
        let third=board[i+2]
        let fourth=board[i+3]
        let row=[Number(first),Number(second),Number(third),Number(fourth)]

        let filteredrow=row.filter(num=>num)
        let missing=4-filteredrow.length
        let zeros=Array(missing).fill(0)
        let newrow=zeros.concat(filteredrow)
        newboard[i]=newrow[0]
        newboard[i+1]=newrow[1]
        newboard[i+2]=newrow[2]
        newboard[i+3]=newrow[3]
        for(let j=i+4;j>=i;j--){
          if(newboard[j]===newboard[j-1]){
            newboard[j]=newboard[j]+newboard[j-1]
            newboard[j-1]=0
          }
        }
      }
  }
  newrandomnum(newboard)
  setBoard(newboard)
}

const moveleft=()=>{
  const newboard=[...board]
  for(let i=0; i<16;i++){
    if (i%4===0){
      let first=board[i]
      let second=board[i+1]
      let third=board[i+2]
      let fourth=board[i+3]
      let row=[Number(first),Number(second),Number(third),Number(fourth)]

      let filteredrow=row.filter(num=>num)
      let missing=4-filteredrow.length
      let zeros=Array(missing).fill(0)
      let newrow=filteredrow.concat(zeros)
      newboard[i]=newrow[0]
      newboard[i+1]=newrow[1]
      newboard[i+2]=newrow[2]
      newboard[i+3]=newrow[3]
      for(let j=i;j<=i+4;j++){
        if(newboard[j]===newboard[j+1]&&(j+1)<16){
          newboard[j]=newboard[j]+newboard[j+1]
          newboard[j+1]=0
        }
      }
    }
}
newrandomnum(newboard)
setBoard(newboard)
}

const movedown=()=>{
  const newboard=[...board]
  for(let i=0; i<4;i++){
      let first=board[i]
      let second=board[i+4]
      let third=board[i+8]
      let fourth=board[i+12]
      let col=[Number(first),Number(second),Number(third),Number(fourth)]

      let filteredcol=col.filter(num=>num)
      let missing=4-filteredcol.length
      let zeros=Array(missing).fill(0)
      let newcol=zeros.concat(filteredcol)
      newboard[i]=newcol[0]
      newboard[i+4]=newcol[1]
      newboard[i+8]=newcol[2]
      newboard[i+12]=newcol[3]
      for(let j=i+12;j>=i;j=j-4){
        console.log(j,(j-4))
        if(newboard[j]===newboard[j-4]&&(j-4)<16&&(j-4)>0){
          newboard[j]=newboard[j]+newboard[j-4]
          newboard[j-4]=0
        }
      }
    }
newrandomnum(newboard)
setBoard(newboard)
}

const moveup=()=>{
  const newboard=[...board]
  for(let i=0; i<4;i++){
      let first=board[i]
      let second=board[i+4]
      let third=board[i+8]
      let fourth=board[i+12]
      let col=[Number(first),Number(second),Number(third),Number(fourth)]

      let filteredcol=col.filter(num=>num)
      let missing=4-filteredcol.length
      let zeros=Array(missing).fill(0)
      let newcol=filteredcol.concat(zeros)
      newboard[i]=newcol[0]
      newboard[i+4]=newcol[1]
      newboard[i+8]=newcol[2]
      newboard[i+12]=newcol[3]
      for(let j=i;j<=i;j=j+4){
        if(newboard[j]===newboard[j+4]&&(j+4)<16){
          newboard[j]=newboard[j]+newboard[j+4]
          newboard[j+4]=0
        }
      }
    }
newrandomnum(newboard)
setBoard(newboard)
}

  const newrandomnum=(newboard)=>{
  let randomposition = Math.floor(Math.random() * 16);
  while(newboard[randomposition]){
    randomposition= Math.floor(Math.random() * 16);
  }
  let randomblock = Math.random() < 0.9 ? 2 : 4;
  newboard[randomposition]=randomblock
}

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
      <div className='flex lg:flex-row flex-col items-center justify-center pt-12 gap-16'>
        <div className='border-[3px] border-neutral-600'>
        <div className="bg-lightgrey size-80 border-4 lg:size-[360px] scorebox grid grid-cols-4 gap-1 text-3xl">
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
