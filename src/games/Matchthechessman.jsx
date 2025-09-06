import React, { useState, useEffect, useRef, useCallback } from 'react'
import Btn from '../components/Btn'
import { MdLeaderboard } from "react-icons/md";
import { supabase } from './../supabaseClient'
import Dialog from './../components/Dialog'
import { useUser } from "@clerk/clerk-react";

function Matchthechessman() {
  const [tiles, settiles] = useState([
    {
      id: 1,
      matchid: "king",
      image: "/images/king.png",
      isflipped: false,
      ismatched: false,
      coupleid: "a"
    },
    {
      id: 2,
      matchid: "king",
      image: "/images/queen.png",
      isflipped: false,
      ismatched: false,
      coupleid: "a"
    },
    {
      id: 3,
      matchid: "knight",
      image: "/images/knight.png",
      isflipped: false,
      ismatched: false,
      coupleid: "b"
    },
    {
      id: 4,
      matchid: "knight",
      image: "/images/knight.png",
      isflipped: false,
      ismatched: false,
      coupleid: "b"
    },
    {
      id: 5,
      matchid: "rook",
      image: "/images/rook.png",
      isflipped: false,
      ismatched: false,
      coupleid: "c"
    },
    {
      id: 6,
      matchid: "rook",
      image: "/images/rook.png",
      isflipped: false,
      ismatched: false,
      coupleid: "c"
    },
    {
      id: 7,
      matchid: "bishop",
      image: "/images/bisop.png",
      isflipped: false,
      ismatched: false,
      coupleid: "d"
    },
    {
      id: 8,
      matchid: "bishop",
      image: "/images/bisop.png",
      isflipped: false,
      ismatched: false,
      coupleid: "d"
    },
    {
      id: 9,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false,
      coupleid: "e"
    },
    {
      id: 10,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false,
      coupleid: "e"
    },
    {
      id: 11,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false,
      coupleid: "f"
    },
    {
      id: 12,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false,
      coupleid: "f"
    },
    {
      id: 13,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false,
      coupleid: "g"
    },
    {
      id: 14,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false,
      coupleid: "g"
    },
    {
      id: 15,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false,
      coupleid: "h"
    },
    {
      id: 16,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false,
      coupleid: "h"
    }
  ]);
  const [matched, setmatched] = useState([])
  const [selected, setselected] = useState([])
  const [gameover, setgameover] = useState(false)
  const [score, setscore] = useState(0)
  const [pb, setpb] = useState(0)
  const notpawnref = useRef(0)
  const clickref=useRef(0)
  const audioRef = useRef(null);
  const swordRef2 = useRef(null);
  const correctref = useRef(null);
  const [result, setresult] = useState("lose")
  const [popup, setpopup] = useState(true)
  const [hint,sethint]=useState(0)
  const [shared, setshared] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  
  const { user } = useUser();

    useEffect(() => {
        audioRef.current = new Audio("/sounds/chessmove.mp3");
        audioRef.current.preload = 'auto';
        swordRef2.current = new Audio("/sounds/sword2.mp3");
        swordRef2.current.preload = 'auto';
        correctref.current = new Audio("/sounds/correct.mp3");
        correctref.current.preload = 'auto';
    }, []);
  
    const sound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    }
    const swordsound = () => {
      if (swordRef2.current) {
          swordRef2.current.currentTime = 0;
          swordRef2.current.play();
      }
  }
  const correctsound = () => {
    if (correctref.current) {
        correctref.current.currentTime = 0;
        correctref.current.play();
    }
}

  const fetchLeaderboard = useCallback(async () => {
    const { data } = await supabase
      .from("mtcscore")
      .select("*")
      .order("score", { ascending: false })
      .limit(10)
    if (data) setLeaderboard(data)
  }, [])

  const fetchPersonalBest = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("mtcscore")
      .select("id, score, username")
      .eq("user_id", user.id)
      .single();
    if (data) setpb(data.score);
  }, [user]);

  const updateBestScore = useCallback(
    async (finalScore) => {
      if (!user) return;
      const currentUsername = user.username;

      const { data: existing } = await supabase
        .from("mtcscore")
        .select("id, score, user_id, username")
        .eq("username", currentUsername)
        .single();

      if (existing) {
        if (finalScore > existing.score) {
          await supabase
            .from("mtcscore")
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
          .from("mtcscore")
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

  useEffect(() => {
    fetchLeaderboard();
    if (user) {
      fetchPersonalBest();
    }
  }, [fetchLeaderboard, fetchPersonalBest, user]);

  useEffect(() => {
    if (score > pb) {
      setpb(score);
    }
    if(score>12){
      setresult("Win!")}
    else{
      setresult("Lose!")}
  }, [gameover]);

  useEffect(() => {
    initlizegame()
  }, [])

  const initlizegame = () => {
    const gametiles = createChessMatchingGrid(tiles).flat()
    settiles(gametiles)
    setmatched([])
    setselected([])
    setgameover(false)
    setscore(0)
    setresult("Lose!")
    clickref.current=0
    notpawnref.current=0
    settiles(prevTiles =>
      prevTiles.map(tile => ({
          ...tile,
          isflipped: false,
          ismatched: false
      }))
    );
  }

const createChessMatchingGrid = (tiles) => {
  const grid = Array(4).fill(null).map(() => Array(4).fill(null));
  
  const getValidPositions = (piece, startPos) => {
    const [row, col] = startPos;
    const positions = [];
    
    switch (piece) {
      case 'knight':
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        knightMoves.forEach(([drow, dcol]) => {
          const newRow = row + drow;
          const newCol = col + dcol;
          if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
            positions.push([newRow, newCol]);
          }
        });
        break;
        
      case 'rook':
        for (let i = 0; i < 4; i++) {
          if (i !== col) positions.push([row, i]);
          if (i !== row) positions.push([i, col]);
        }
        break;
        
      case 'bishop':
        for (let i = -3; i <= 3; i++) {
          if (i !== 0) {
            const diagRow1 = row + i;
            const diagCol1 = col + i;
            const diagRow2 = row + i;
            const diagCol2 = col - i;
            
            if (diagRow1 >= 0 && diagRow1 < 4 && diagCol1 >= 0 && diagCol1 < 4) {
              positions.push([diagRow1, diagCol1]);
            }
            if (diagRow2 >= 0 && diagRow2 < 4 && diagCol2 >= 0 && diagCol2 < 4) {
              positions.push([diagRow2, diagCol2]);
            }
          }
        }
        break;
        
      case 'queen':
        for (let i = 0; i < 4; i++) {
          if (i !== col) positions.push([row, i]);
          if (i !== row) positions.push([i, col]);
        }
        for (let i = -3; i <= 3; i++) {
          if (i !== 0) {
            const diagRow1 = row + i;
            const diagCol1 = col + i;
            const diagRow2 = row + i;
            const diagCol2 = col - i;
            
            if (diagRow1 >= 0 && diagRow1 < 4 && diagCol1 >= 0 && diagCol1 < 4) {
              positions.push([diagRow1, diagCol1]);
            }
            if (diagRow2 >= 0 && diagRow2 < 4 && diagCol2 >= 0 && diagCol2 < 4) {
              positions.push([diagRow2, diagCol2]);
            }
          }
        }
        break;
    }
    
    return positions.filter(pos => !grid[pos[0]][pos[1]]);
  };

  const arePawnsConnected = (pos1, pos2) => {
    const [row1, col1] = pos1;
    const [row2, col2] = pos2;
    return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
  };

  const pieces = {};
  tiles.forEach(tile => {
    if (!pieces[tile.coupleid]) {
      pieces[tile.coupleid] = [];
    }
    pieces[tile.coupleid].push(tile);
  });
  
  const getRandomEmptyPosition = () => {
    const emptyPositions = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (!grid[i][j]) emptyPositions.push([i, j]);
      }
    }
    return emptyPositions.length > 0 ? 
      emptyPositions[Math.floor(Math.random() * emptyPositions.length)] : null;
  };
  
  const pieceOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
  const { a: royalPair } = pieces;
  if (royalPair) {
    const queenTile = royalPair.find(tile => tile.image === "/images/queen.png");
    const kingTile = royalPair.find(tile => tile.image === "/images/king.png");
  
    if (queenTile && kingTile) {
      const queenPos = getRandomEmptyPosition();
      if (queenPos) {
        grid[queenPos[0]][queenPos[1]] = queenTile;
  
        const kingPositions = getValidPositions('queen', queenPos).filter(pos => !grid[pos[0]][pos[1]]);
        if (kingPositions.length > 0) {
          const kingPos = kingPositions[Math.floor(Math.random() * kingPositions.length)];
          grid[kingPos[0]][kingPos[1]] = kingTile;
        }
      }
    }
  }
  
  pieceOrder.forEach(coupleid => {
    if (coupleid === 'a') return;
  
    const piecePair = pieces[coupleid];
  
    const pieceType = piecePair[0].matchid; 
    
    const pos1 = getRandomEmptyPosition();

  
    grid[pos1[0]][pos1[1]] = piecePair[0];
  
    let validPos = [];
    if (pieceType === 'pawn') {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (!grid[i][j] && arePawnsConnected(pos1, [i, j])) {
            validPos.push([i, j]);
          }
        }
      }
    } else {
      validPos = getValidPositions(pieceType, pos1).filter(pos => !grid[pos[0]][pos[1]]);
    }
  
    if (validPos.length > 0) {
      const pos2 = validPos[Math.floor(Math.random() * validPos.length)];
      grid[pos2[0]][pos2[1]] = piecePair[1];
    }else {
      const pos2=getRandomEmptyPosition()
      grid[pos2[0]][pos2[1]] = piecePair[1];
    }
  });

  return grid;
};

  const handleclick = (clickedtile) => {
    if (clickedtile.isflipped || clickedtile.ismatched || selected.length === 2) return;
    clickref.current+=1
    sound()
    const updatedtiles = tiles.map(tile => 
      tile.id === clickedtile.id 
        ? { ...tile, isflipped: true } 
        : tile
    );
    settiles(updatedtiles);

    const newSelectedTiles = [...selected, clickedtile];
    setselected(newSelectedTiles);

    if (newSelectedTiles.length === 2) {
      setTimeout(() => checkMatch(newSelectedTiles, updatedtiles), 1000);
    }
  }

  const checkMatch = async (selectedPair, currentTiles) => {
    const [firstTile, secondTile] = selectedPair;
    if (firstTile.matchid === secondTile.matchid) {
      const matchedTiles = currentTiles.map(tile => 
        tile.id === firstTile.id || tile.id === secondTile.id ?
        { ...tile, ismatched: true }: tile);
        
        let newScore = score;
        if(firstTile.image!="/images/pawn.png"){
        notpawnref.current+=1
        correctsound()
        if(clickref.current<6) {
          newScore = score + 5;
          setscore(prev=>prev+5)
        } 
        else if(clickref.current<12) {
          newScore = score + 4;
          setscore(prev=>prev+4)
        } 
        else if(clickref.current<20) {
          newScore = score + 3;
          setscore(prev=>prev+3)
        }
        else if(clickref.current<30) {
          newScore = score + 2;
          setscore(prev=>prev+2)
        }
        else {
          newScore = score + 1;
          setscore(prev=>prev+1)
        }
        }else{
          swordsound()
          if(clickref.current<6) {
            newScore = score - 1;
            setscore(prev=>prev-1)
          }
          else if(clickref.current<12) {
            newScore = score - 2;
            setscore(prev=>prev-2)
          }
          else if(clickref.current<20) {
            newScore = score - 3;
            setscore(prev=>prev-3)
          }
          else if(clickref.current<30) {
            newScore = score - 4;
            setscore(prev=>prev-4)
          }
          else {
            newScore = score - 5;
            setscore(prev=>prev-5)
          }
        }
      settiles(matchedTiles);
      setmatched([...matched, firstTile.matchid]);

      if (notpawnref.current===4) {
        setgameover(true);
        const finalScore = newScore > score ? newScore : score;
        if (user && finalScore > pb) {
          setpb(finalScore)
          await updateBestScore(finalScore)
        }
      }
    } else {
      const resetTiles = currentTiles.map(tile => 
        tile.id === firstTile.id || tile.id === secondTile.id
          ? { ...tile, isflipped: false }
          : tile
      );
      settiles(resetTiles);
    }

    setselected([]);
  };

  const shareLink = useCallback(() => {
    let url = window.location.href
    window.navigator.clipboard.writeText(url)
    setshared(true)
    setTimeout(() => setshared(false), 2500)
  }, [])
  
  const removepopup=()=>{
    setpopup(false)
  }
  const help=()=>{
    setpopup(true)
  }

  return (
    <div className='pt-[75px] min-h-screen bg-lightgrey text-2xl relative lg:min-h-screen w-screen'>
      <div className={' absolute left-0 top-11 right-0 mx-auto flex-col items-center justify-center bg-lightgrey py-10 px-8 z-40 max-h-screen w-max h-max btnnohover '+ (popup?"":"hidden")}>
      <div className='h-[450px] sm:h-96 w-[280px] sm:w-[500px] flex flex-col gap-7 items-center justify-center font-medium text-xl sm:text-2xl'>
        <h2 className=' text-4xl'>How to play?</h2>
        <p className='w-ful'>In this strategic board game, your goal is to match chess pieces by predicting their positions. Each piece must be able to reach its pair's position even if there are peices in between- but here's the twist: Pawns are the bad guys! Matching pawns will cost you some points, so stay sharp and avoid them. Think smart, play strategically, and try to match the pieces in as few tries as possible. Score above 12 points and victory is yours!</p>
        <Btn text="Got it" ClickEvent={removepopup}/>
        </div>
      </div>
      <div className='w-screen flex justify-between items-center px-3 sm:px-20 lg:px-36'>
        <Btn text="Reset" ClickEvent={initlizegame} />
        <div className='scorebox px-2'>Score : {score}</div>
        <div className='scorebox px-2'>PB : {pb}</div>
        <div className='hidden sm:contents' ><Btn text={"Hint " + hint}/></div>
        <div className='hidden sm:flex gap-3 relative'>
          <Btn text="Share" ClickEvent={shareLink}/>
          <div className={'absolute bg-lightgrey scorebox top-10 right-32 z-40 '+ (shared?"":"hidden")}>
            Link Copied
          </div>
        </div>
        <div className='hidden sm:flex gap-3 relative'>
          <Btn text="Leaderboard" ClickEvent={() => setIsLeaderboardOpen(true)}/>
        </div>
      </div>
      <div className='flex flex-col sm:flex-row justify-center items-center sm:items-start gap-10 sm:gap-16 pt-10 sm:pt-12'>
        <div className='border-2 border-black w-max relative h-max '>
          <div className='bg-lightgrey size-80 lg:size-[360px] scorebox grid grid-cols-4 gap-1'>
            {tiles.map((tile) => (
              <div
                key={`${Date.now()}-${Math.random().toString(36).substring(2)}`}
                onClick={() => handleclick(tile)}
                className={`
                  flex items-center justify-center cursor-pointer transition-all duration-300 scorebox bg-lightgrey p-2 max-h-[86px] overflow-hidden
                   ${(tile.isflipped || tile.ismatched) ? 'bg-cover bg-center' : ''}
                `}
              >
                {!tile.isflipped && !tile.ismatched ? (
                  <img src="/images/question.png" alt="Hidden tile" />
                ) : (
                  <img src={`${tile.image}`} alt="Tile image"className=' max-h-[56px] lg:max-h-[75px]' />
                )}
              </div>
            ))}
          </div>
          <div className={'z-30 absolute top-0 bg-lightgrey bg-opacity-85 h-full w-full flex flex-col items-center justify-center gap-5 text-3xl ' + (gameover? "":'hidden')}>
            <p className='text-4xl'>Game Over</p>
            <div>
            <p>You {result}</p>
            <p>Score : {score}</p>
            <p>Personal best: {pb}</p>
            </div>
            <div className='w-[140px] bg-opacity-100'>
            <Btn text="play again" ClickEvent={initlizegame}/>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-7 items-center pb-8 sm:pb-0'>
          <div className='flex items-center justify-center sm:justify-center gap-2'>
            <h1 className='text-4xl text-center font-medium'>Match The Chessman</h1>
            <div className='sm:hidden'>
              <Btn text={<MdLeaderboard />} ClickEvent={() => setIsLeaderboardOpen(true)}/>
            </div>
          </div>
          <p className='text-2xl font-medium lg:w-[600px] pb-7 lg:pb-0 px-5 hidden sm:block'>
          Are you ready for a unique chess-inspired challenge? In this strategic board game, your goal is to match chess pieces by predicting their positions. Each piece must be able to reach its pair's position even if there are peices in between- but here's the twist: Pawns are the bad guys! Matching pawns will cost you some points, so stay sharp and avoid them. Think smart, play strategically, and try to match the pieces in as few tries as possible. Score above 12 points and victory is yours! Good luck and have fun!
          </p>
          <div className='sm:hidden flex justify-between items-center w-full pr-4'>
          <Btn text="Guide?" ClickEvent={help}/>
          <Btn text={"Hint " + hint}/></div>
        </div>
      </div>

      <Dialog
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        title="MTC Leaderboard"
        data={leaderboard}
      />
    </div>
  )
}

export default Matchthechessman