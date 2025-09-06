import React, { useState, useEffect, useCallback } from 'react';
import Btn from '../components/Btn';
import { supabase } from './../supabaseClient';
import Dialog from './../components/Dialog';
import { useUser } from "@clerk/clerk-react";

function G2048() {
  const [board, setBoard] = useState([]);
  const [score, setscore] = useState(0);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [isGameOver, setIsGameOver] = useState(true);
  const [gameOverProcessed, setGameOverProcessed] = useState(false);

  const [personalBest, setPersonalBest] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const [shared, setshared] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    initialize();
    fetchLeaderboard();
    fetchPersonalBest();
    
    // Disable pull-to-refresh on mobile
    const preventDefault = (e) => e.preventDefault();
    
    // Prevent overscroll/bounce effect
    document.body.style.overscrollBehavior = 'none';
    
    // Alternative CSS approach - add this to your CSS file:
    // body { overscroll-behavior: none; }
    
    return () => {
      document.body.style.overscrollBehavior = 'auto';
    };
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    const { data } = await supabase
      .from("two048score")
      .select("*")
      .order("score", { ascending: false })
      .limit(10);
    if (data) setLeaderboard(data);
  }, []);

  const fetchPersonalBest = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("two048score")
      .select("id, score, username")
      .eq("user_id", user.id)
      .single();
    if (data) setPersonalBest(data.score);
  }, [user]);

  const updateBestScore = useCallback(
    async (finalScore) => {
      if (!user) return;
      const currentUsername = user.username || user.firstName || "Guest";

      const { data: existing } = await supabase
        .from("two048score")
        .select("id, score, user_id, username")
        .eq("username", currentUsername)
        .single();

      if (existing) {
        if (finalScore > existing.score) {
          await supabase
            .from("two048score")
            .update({
              score: finalScore,
              user_id: user.id,
              username: currentUsername,
            })
            .eq("username", currentUsername)
            .select();
          await fetchLeaderboard();
        }
      } else {
        await supabase
          .from("two048score")
          .insert([
            {
              user_id: user.id,
              username: currentUsername,
              score: finalScore,
            },
          ])
          .select();
        await fetchLeaderboard();
      }
    },
    [user, fetchLeaderboard]
  );

  // Check if game is over
  const checkGameOver = (currentBoard) => {
    // Check for empty cells
    if (currentBoard.includes(0)) {
      return false;
    }

    // Check for possible horizontal merges
    for (let i = 0; i < 16; i += 4) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i + j] === currentBoard[i + j + 1]) {
          return false;
        }
      }
    }

    // Check for possible vertical merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i + j * 4] === currentBoard[i + (j + 1) * 4]) {
          return false;
        }
      }
    }

    return true;
  };

  // Check if board has changed (to determine if move was valid)
  const boardsEqual = (board1, board2) => {
    return board1.every((cell, index) => cell === board2[index]);
  };

  // Handle game over
  useEffect(() => {
    if (isGameOver && !gameOverProcessed) {
      setGameOverProcessed(true);
      // Only update database when game is over
      if (score > personalBest) {
        setPersonalBest(score);
        updateBestScore(score);
      }
    }
  }, [isGameOver, gameOverProcessed, score, personalBest, updateBestScore]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isGameOver) return; // Prevent moves when game is over
      
      if (event.key === 'ArrowRight') moveright();
      else if (event.key === 'ArrowLeft') moveleft();
      else if (event.key === 'ArrowDown') movedown();
      else if (event.key === 'ArrowUp') moveup();
    };

    const handleTouchStart = (event) => {
      // Prevent default to stop pull-to-refresh
      event.preventDefault();
      
      setTouchStart({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      });
    };

    const handleTouchMove = (event) => {
      // Prevent scrolling during touch moves on the game board
      event.preventDefault();
    };

    const handleTouchEnd = (event) => {
      if (isGameOver) return; // Prevent moves when game is over
      
      // Prevent default to stop any browser actions
      event.preventDefault();
      
      setTouchEnd({
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      });

      const deltaX = touchStart.x - event.changedTouches[0].clientX;
      const deltaY = touchStart.y - event.changedTouches[0].clientY;
      const minSwipeDistance = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) moveleft();
          else moveright();
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) moveup();
          else movedown();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    // Add touch listeners specifically to the game board
    const gameBoard = document.querySelector('.game-board');
    if (gameBoard) {
      gameBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
      gameBoard.addEventListener('touchmove', handleTouchMove, { passive: false });
      gameBoard.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (gameBoard) {
        gameBoard.removeEventListener('touchstart', handleTouchStart);
        gameBoard.removeEventListener('touchmove', handleTouchMove);
        gameBoard.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [board, touchStart, isGameOver]);

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
    setscore(0);
    setIsGameOver(false);
    setGameOverProcessed(false);
  };

  const moveright = () => {
    if (isGameOver) return;
    
    const oldBoard = [...board];
    const newboard = [...board];
    
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let first = board[i];
        let second = board[i + 1];
        let third = board[i + 2];
        let fourth = board[i + 3];
        let row = [Number(first), Number(second), Number(third), Number(fourth)];

        let filteredrow = row.filter(num => num);
        let missing = 4 - filteredrow.length;
        let zeros = Array(missing).fill(0);
        let newrow = zeros.concat(filteredrow);
        
        for (let j = 3; j >= 0; j--) {
          if (newrow[j] === newrow[j - 1]) {
            let newtile = newrow[j] + newrow[j - 1];
            newrow[j] = newtile;
            newrow[j - 1] = 0;
            setscore(prev => prev + newtile);
            filteredrow = newrow.filter(num => num);
            missing = 4 - filteredrow.length;
            zeros = Array(missing).fill(0);
            newrow = zeros.concat(filteredrow);
          }
        }
        newboard[i] = newrow[0];
        newboard[i + 1] = newrow[1];
        newboard[i + 2] = newrow[2];
        newboard[i + 3] = newrow[3];
      }
    }
    
    // Only update if board changed
    if (!boardsEqual(oldBoard, newboard)) {
      newrandomnum(newboard);
      setBoard(newboard);
      
      // Check for game over after the move
      if (checkGameOver(newboard)) {
        setIsGameOver(true);
      }
    }
  };

  const moveleft = () => {
    if (isGameOver) return;
    
    const oldBoard = [...board];
    const newboard = [...board];
    
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let first = board[i];
        let second = board[i + 1];
        let third = board[i + 2];
        let fourth = board[i + 3];
        let row = [Number(first), Number(second), Number(third), Number(fourth)];

        let filteredrow = row.filter(num => num);
        let missing = 4 - filteredrow.length;
        let zeros = Array(missing).fill(0);
        let newrow = filteredrow.concat(zeros);
        
        for (let j = 0; j <= 3; j++) {
          if (newrow[j] === newrow[j + 1] && (j + 1) < 4) {
            let newtile = newrow[j] + newrow[j + 1];
            newrow[j] = newtile;
            setscore(prev => prev + newtile);
            newrow[j + 1] = 0;
            filteredrow = newrow.filter(num => num);
            missing = 4 - filteredrow.length;
            zeros = Array(missing).fill(0);
            newrow = filteredrow.concat(zeros);
          }
        }
        newboard[i] = newrow[0];
        newboard[i + 1] = newrow[1];
        newboard[i + 2] = newrow[2];
        newboard[i + 3] = newrow[3];
      }
    }
    
    // Only update if board changed
    if (!boardsEqual(oldBoard, newboard)) {
      newrandomnum(newboard);
      setBoard(newboard);
      
      // Check for game over after the move
      if (checkGameOver(newboard)) {
        setIsGameOver(true);
      }
    }
  };

  const movedown = () => {
    if (isGameOver) return;
    
    const oldBoard = [...board];
    const newboard = [...board];
    
    for (let i = 0; i < 4; i++) {
      let first = board[i];
      let second = board[i + 4];
      let third = board[i + 8];
      let fourth = board[i + 12];
      let col = [Number(first), Number(second), Number(third), Number(fourth)];

      let filteredcol = col.filter(num => num);
      let missing = 4 - filteredcol.length;
      let zeros = Array(missing).fill(0);
      let newcol = zeros.concat(filteredcol);
      
      for (let j = 3; j >= 0; j--) {
        if (newcol[j] != 0 && newcol[j] === newcol[j - 1]) {
          let newtile = newcol[j] + newcol[j - 1];
          newcol[j] = newtile;
          setscore(prev => prev + newtile);
          newcol[j - 1] = 0;
          filteredcol = newcol.filter(num => num);
          missing = 4 - filteredcol.length;
          zeros = Array(missing).fill(0);
          newcol = zeros.concat(filteredcol);
        }
      }
      newboard[i] = newcol[0];
      newboard[i + 4] = newcol[1];
      newboard[i + 8] = newcol[2];
      newboard[i + 12] = newcol[3];
    }
    
    // Only update if board changed
    if (!boardsEqual(oldBoard, newboard)) {
      newrandomnum(newboard);
      setBoard(newboard);
      
      // Check for game over after the move
      if (checkGameOver(newboard)) {
        setIsGameOver(true);
      }
    }
  };

  const moveup = () => {
    if (isGameOver) return;
    
    const oldBoard = [...board];
    const newboard = [...board];
    
    for (let i = 0; i < 4; i++) {
      let first = board[i];
      let second = board[i + 4];
      let third = board[i + 8];
      let fourth = board[i + 12];
      let col = [Number(first), Number(second), Number(third), Number(fourth)];

      let filteredcol = col.filter(num => num);
      let missing = 4 - filteredcol.length;
      let zeros = Array(missing).fill(0);
      let newcol = filteredcol.concat(zeros);
      
      for (let j = 0; j < 4; j++) {
        if (newcol[j] === newcol[j + 1] && (j + 1) < 16) {
          let newtile = newcol[j] + newcol[j + 1];
          newcol[j] = newtile;
          setscore(prev => prev + newtile);
          newcol[j + 1] = 0;

          filteredcol = newcol.filter(num => num);
          missing = 4 - filteredcol.length;
          zeros = Array(missing).fill(0);
          newcol = filteredcol.concat(zeros);
        }
      }
      newboard[i] = newcol[0];
      newboard[i + 4] = newcol[1];
      newboard[i + 8] = newcol[2];
      newboard[i + 12] = newcol[3];
    }
    
    // Only update if board changed
    if (!boardsEqual(oldBoard, newboard)) {
      newrandomnum(newboard);
      setBoard(newboard);
      
      // Check for game over after the move
      if (checkGameOver(newboard)) {
        setIsGameOver(true);
      }
    }
  };

  const newrandomnum = (newboard) => {
    let randomposition = Math.floor(Math.random() * 16);
    while (newboard[randomposition]) {
      randomposition = Math.floor(Math.random() * 16);
    }
    let randomblock = Math.random() < 0.9 ? 2 : 4;
    newboard[randomposition] = randomblock;
  };

  const shareLink = () => {
    let url = window.location.href;
    window.navigator.clipboard.writeText(url);
    setshared(true);
    setTimeout(() => setshared(false), 2500);
  };

  return (
    <div className="min-h-screen bg-lightgrey pt-[75px] text-2xl w-screen" style={{ overscrollBehavior: 'none' }}>
      <div className='flex w-screen justify-between px-3 sm:px-20'>
        <Btn text="reset" ClickEvent={initialize}/>
        <div className='scorebox px-3'>
          Score : {score}
        </div>
        <div className='scorebox px-3'>
          Best : {personalBest}
        </div>
        <div className='hidden sm:flex gap-3 relative'>
          <Btn text="Leaderboard" ClickEvent={() => setIsLeaderboardOpen(true)}/>
        </div>
        <div className='relative hidden sm:flex'>
          <Btn text="Share" ClickEvent={shareLink}/>
          <div className={'absolute bg-lightgrey scorebox top-10 z-40 '+ (shared?"":"hidden")}>
            Link Copied
          </div>
        </div>
      </div>

      {isGameOver && (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className=" flex items-center flex-col bg-lightgrey scorebox text-center">
            <h2 className="text-3xl font-bold mb-4 text-white py-1 bg-blue-900 px-10 w-full">Game Over!</h2>
            <p className="text-2xl mb-4 text-black">
              Final Score: 
              <div className='scorebox'>{score}</div>
              </p>
            {score > personalBest && (
              <p className="text-xl mb-4 text-green-600">New Personal Best!</p>
            )}
            <button 
            onClick={initialize} 
            className="py-1 btn h-full"
          >
            Play Again
          </button>
          </div>
        </div>
      )}

      <div className='flex lg:flex-row flex-col items-center justify-center pt-7 lg:pt-12 gap-5 lg:gap-16'>
        <div className='border-[3px] border-neutral-600'>
          <div className={`game-board bg-lightgrey size-80 border-4 lg:size-[360px] scorebox grid grid-cols-4 auto-rows-[1fr] gap-1 text-3xl ${isGameOver ? 'opacity-50' : ''}`}>
            {board.map((block, index) => (
              <div
                key={index}
                className="flex items-center justify-center btnnohover h-full"
              >
                {block ? block : " "}
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col gap-4 lg:gap-10'>
          <div className='flex items-center justify-center gap-4'>
          <h1 className='text-4xl text-center'>2048</h1>
          <div className='flex sm:hidden gap-3 relative'>
            <Btn text="Leaderboard" ClickEvent={() => setIsLeaderboardOpen(true)}/>
          </div>
          </div>

          <h2 className='max-w-[600px] px-4 lg:hidden'>
            Slide tiles using arrow keys or swipes to combine matching numbers and reach the 2048 tile in this addictive puzzle game!
          </h2>
          <h2 className='max-w-[600px] px-4 hidden lg:block'>
            2048 is an addictive puzzle game where players slide numbered tiles to combine them, aiming to create a 2048 tile. Merge tiles by matching numbers, doubling their value with each move. Strategize to manage grid space and avoid running out of moves in this fun test of logic and planning!
          </h2>
        </div>
      </div>

      <Dialog
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        title="2048 Leaderboard"
        data={leaderboard}
      />
    </div>
  );
}

export default G2048;