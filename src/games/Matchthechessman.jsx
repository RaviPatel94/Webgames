import React, { useState, useEffect, useRef } from 'react'
import Btn from '../components/Btn'

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
  const clickref=useRef(0)


  useEffect(() => {
    if (score > pb) {
      setpb(score);
    }
  }, [score]);

  useEffect(() => {
    initlizegame()
  }, [])

  const initlizegame = () => {
    const gametiles = createChessMatchingGrid(tiles).flat()
    console.log(gametiles)

    settiles(gametiles)
    setmatched([])
    setselected([])
    setgameover(false)
    setscore(0)
    clickref.current=0
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

  const checkMatch = (selectedPair, currentTiles) => {
    const [firstTile, secondTile] = selectedPair;

    if (firstTile.matchid === secondTile.matchid) {
      const matchedTiles = currentTiles.map(tile => 
        tile.id === firstTile.id || tile.id === secondTile.id ?
        { ...tile, ismatched: true }: tile);
        if(firstTile.image!="/images/pawn.png"){
        if(clickref.current<6) setscore(prev=>prev+5)
        else if(clickref.current<12) setscore(prev=>prev+4)
        else if(clickref.current<20) setscore(prev=>prev+3)
        else if(clickref.current<30) setscore(prev=>prev+2)
        else setscore(prev=>prev+1)
        }else{
          if(clickref.current<6) setscore(prev=>prev-1)
          else if(clickref.current<12) setscore(prev=>prev-2)
          else if(clickref.current<20) setscore(prev=>prev-3)
          else if(clickref.current<30) setscore(prev=>prev-4)
          else setscore(prev=>prev-5)
        }
      settiles(matchedTiles);
      setmatched([...matched, firstTile.matchid]);

      if (matched.length + 1 === tiles.length) {
        setgameover(true);
        if (pb<score) setpb(score)
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

  const [shared, setshared] = useState(false)
  const shareLink = () => {
    let url = window.location.href
    window.navigator.clipboard.writeText(url)
    setshared(true)
    setTimeout(() => setshared(false), 2500)
  }

  return (
    <div className='pt-[75px] min-h-screen bg-lightgrey text-2xl'>
      <div className='w-screen flex justify-between items-center px-3 sm:px-36'>
        <Btn text="Reset" ClickEvent={initlizegame} />
        <div className='scorebox px-2'>Score : {score}</div>
        <div className='scorebox px-2'>PB : {pb}</div>
        <div className='relative hidden sm:contents'>
          <Btn text="Share" ClickEvent={shareLink}/>
          <div className={'absolute bg-lightgrey scorebox top-10 z-40 '+ (shared?"":"hidden")}>
            Link Copied
          </div>
        </div>
      </div>
      <div className='flex items-center flex-col sm:flex-row justify-center gap-16 pt-12'>
        <div className='border-2 border-black w-max relative'>
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
          <div className={'z-40 absolute top-0 bg-lightgrey h-full w-full flex flex-col items-center justify-center gap-5 text-3xl ' + (gameover? "":'hidden')}>
            <p>Result</p>
            <div>
            <p>Score : {score}</p>
            <p>Personal best: {pb}</p>
            </div>
            <div className='w-[140px]'>
            <Btn text="play again" ClickEvent={initlizegame}/>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-11'>
          <h1 className='text-4xl text-center'>Match The Chessman</h1>
          <p className='text-2xl font-normal lg:w-[600px] pb-7 lg:pb-0 px-5'>
            Matching Tiles is a classic memory game where players flip over pairs of tiles to find matching images. The goal is to remember the positions of previously revealed tiles and match all pairs with the fewest attempts. Players take turns or play solo, testing their concentration and recall skills. It's a fun and engaging way to improve memory and focus while enjoying a relaxing challenge.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Matchthechessman