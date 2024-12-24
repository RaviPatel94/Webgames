import React, { useState, useEffect } from 'react';
import Btn from '../components/Btn';

function G2048() {
  const [board, setBoard] = useState([]);
  const [score, setscore] = useState(0);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

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
    
    const handleTouchStart = (event) => {
      setTouchStart({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      });
    };

    const handleTouchEnd = (event) => {
      setTouchEnd({
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      });
      
      const deltaX = touchStart.x - event.changedTouches[0].clientX;
      const deltaY = touchStart.y - event.changedTouches[0].clientY;
      

      const minSwipeDistance = 50;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {

        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            moveleft();
          } else {
            moveright();
          }
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            moveup();
          } else {
            movedown();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [board, touchStart]);

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
    setscore(0)
  };

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
        for(let j=3;j>=0;j--){  
          if(newrow[j]===newrow[j-1]){
            let newtile=newrow[j]+newrow[j-1]
            newrow[j]=newtile
            newrow[j-1]=0
            setscore(prev=>prev+newtile)
            filteredrow=newrow.filter(num=>num)
            missing=4-filteredrow.length
            zeros=Array(missing).fill(0)
            newrow=zeros.concat(filteredrow)
          }
        }
        newboard[i]=newrow[0]
        newboard[i+1]=newrow[1]
        newboard[i+2]=newrow[2]
        newboard[i+3]=newrow[3]
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
      for(let j=0;j<=3;j++){
        if(newrow[j]===newrow[j+1]&&(j+1)<4){
          let newtile=newrow[j]+newrow[j+1]
          newrow[j]=newtile
          setscore(prev=>prev+newtile)
          newrow[j+1]=0
          filteredrow=newrow.filter(num=>num)
          missing=4-filteredrow.length
          zeros=Array(missing).fill(0)
          newrow=filteredrow.concat(zeros)
        }
      }
      newboard[i]=newrow[0]
      newboard[i+1]=newrow[1]
      newboard[i+2]=newrow[2]
      newboard[i+3]=newrow[3]
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
      for(let j=3;j>=0;j--){
        if(newcol[j]!=0 && newcol[j]===newcol[j-1]){
          let newtile=newcol[j]+newcol[j-1]
          newcol[j]=newtile
          setscore(prev=>prev+newtile)
          newcol[j-1]=0
        filteredcol=newcol.filter(num=>num)
        missing=4-filteredcol.length
        zeros=Array(missing).fill(0)
        newcol=zeros.concat(filteredcol)
        }
      }
      newboard[i]=newcol[0]
      newboard[i+4]=newcol[1]
      newboard[i+8]=newcol[2]
      newboard[i+12]=newcol[3]
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
      for(let j=0;j<4;j++){
        if(newcol[j]===newcol[j+1]&&(j+1)<16){
          let newtile=newcol[j]+newcol[j+1]
          newcol[j]=newtile
          setscore(prev=>prev+newtile)
          newcol[j+1]=0

          filteredcol=newcol.filter(num=>num)
          missing=4-filteredcol.length
          zeros=Array(missing).fill(0)
          newcol=filteredcol.concat(zeros)
        }
      }
      newboard[i]=newcol[0]
      newboard[i+4]=newcol[1]
      newboard[i+8]=newcol[2]
      newboard[i+12]=newcol[3]
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
       <div className='flex w-screen justify-between px-3 sm:px-20'>
        <Btn text="reset" ClickEvent={initialize}/>
        <div className='scorebox px-3'>
          Score : {score}
        </div>
        <div className='relative'>
          <Btn text="Share" ClickEvent={shareLink}/>
          <div className={'absolute bg-lightgrey scorebox top-10 z-40 '+ (shared?"":"hidden")}>
            Link Copied
          </div>
        </div>
       </div>
      <div className='flex lg:flex-row flex-col items-center justify-center pt-7 lg:pt-12 gap-5 lg:gap-16'>
        <div className='border-[3px] border-neutral-600'>
        <div className="bg-lightgrey size-80 border-4 lg:size-[360px] scorebox grid grid-cols-4 auto-rows-[1fr] gap-1 text-3xl">
          {board.map((block, index) => (
            <div
              key={index}
              className="flex items-center justify-center btnnohover h-full"
            >
              {block? block : " "}
            </div>
          ))}
        </div>
        </div>
        <div className='flex flex-col gap-4 lg:gap-10'>
          <h1 className='text-4xl text-center'>
            2048
          </h1>
          <h2 className='max-w-[600px] px-4 lg:hidden'>
          Slide tiles using arrow keys or swipes to combine matching numbers and reach the 2048 tile in this addictive puzzle game!
          </h2>
          <h2 className='max-w-[600px] px-4 hidden lg:block'>
          2048 is an addictive puzzle game where players slide numbered tiles to combine them, aiming to create a 2048 tile. Merge tiles by matching numbers, doubling their value with each move. Strategize to manage grid space and avoid running out of moves in this fun test of logic and planning!
          </h2>
        </div>
      </div>
    </div>
  );
}

export default G2048;