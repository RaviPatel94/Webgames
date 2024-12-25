import React, { useState, useEffect, useRef } from 'react'
import Btn from '../components/Btn'

function Matchthechessman() {
  const [tiles, settiles] = useState([
    {
      id: 1,
      matchid: "king",
      image: "/images/king.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 2,
      matchid: "king",
      image: "/images/queen.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 3,
      matchid: "bishop",
      image: "/images/bisop.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 4,
      matchid: "bishop",
      image: "/images/bisop.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 5,
      matchid: "rook",
      image: "/images/rook.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 6,
      matchid: "rook",
      image: "/images/rook.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 7,
      matchid: "knight",
      image: "/images/knight.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 8,
      matchid: "knight",
      image: "/images/knight.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 9,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 10,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 11,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 12,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 13,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 14,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 15,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false
    },
    {
      id: 16,
      matchid: "pawn",
      image: "/images/pawn.png",
      isflipped: false,
      ismatched: false
    }
  ])
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
    const gametiles = createChessMatchingGrid(tiles)

    settiles(gametiles)
    setmatched([])
    setselected([])
    setgameover(false)
    setscore(0)
    clickref.current=0
  }

const createChessMatchingGrid = (tiles) => {
  const grid = Array(4).fill(null).map(() => Array(4).fill(null));
  
  // Helper to get valid positions
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
        // Horizontal and vertical positions
        for (let i = 0; i < 4; i++) {
          if (i !== col) positions.push([row, i]);
          if (i !== row) positions.push([i, col]);
        }
        break;
        
      case 'bishop':
        // Diagonal positions
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
        // Combine rook and bishop moves
        for (let i = 0; i < 4; i++) {
          if (i !== col) positions.push([row, i]);
          if (i !== row) positions.push([i, col]);
        }
        // Add diagonal moves
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

  // Helper to check if two pawns are connected
  const arePawnsConnected = (pos1, pos2) => {
    const [row1, col1] = pos1;
    const [row2, col2] = pos2;
    return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
  };

  // Create pieces map with proper structure
  const pieces = {};
  tiles.forEach(tile => {
    if (!pieces[tile.matchid]) {
      pieces[tile.matchid] = [];
    }
    pieces[tile.matchid].push(tile);
  });

  // Helper to get random empty position
  const getRandomEmptyPosition = () => {
    const emptyPositions = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (!grid[i][j]) emptyPositions.push([i, j]);
      }
    }
    return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  };

  // Place Queen (using the piece that has queen.png in its image path)
  const queenTile = tiles.find(tile => tile.image.includes('queen.png'));
  const kingTile = tiles.find(tile => tile.image.includes('king.png'));

  if (queenTile && kingTile) {
    // Place Queen
    const queenPos = getRandomEmptyPosition();
    grid[queenPos[0]][queenPos[1]] = queenTile;

    // Place King in Queen's path
    const kingPositions = getValidPositions('queen', queenPos);
    if (kingPositions.length > 0) {
      const kingPos = kingPositions[Math.floor(Math.random() * kingPositions.length)];
      grid[kingPos[0]][kingPos[1]] = kingTile;
    }
  }

  // Place other pieces
  Object.entries(pieces).forEach(([matchid, piecePair]) => {
    if (matchid === 'king') return; // Skip king pieces as we've handled them

    const pieceType = matchid;
    
    // Skip if both pieces of the pair have already been placed
    if (piecePair.every(piece => grid.flat().includes(piece))) return;
    
    // Only place pieces that haven't been placed yet
    const unplacedPieces = piecePair.filter(piece => !grid.flat().includes(piece));
    if (unplacedPieces.length < 2) return; // Skip if we don't have both pieces

    const pos1 = getRandomEmptyPosition();
    if (pos1) {
      grid[pos1[0]][pos1[1]] = unplacedPieces[0];

      // Get valid positions for second piece based on piece type
      let validPos;
      if (pieceType === 'pawn') {
        validPos = [];
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (!grid[i][j] && arePawnsConnected(pos1, [i, j])) {
              validPos.push([i, j]);
            }
          }
        }
      } else {
        validPos = getValidPositions(pieceType, pos1);
      }

      if (validPos && validPos.length > 0) {
        const pos2 = validPos[Math.floor(Math.random() * validPos.length)];
        grid[pos2[0]][pos2[1]] = unplacedPieces[1];
      } else {
        // If no valid position for second piece, remove the first piece
        grid[pos1[0]][pos1[1]] = null;
      }
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
        tile.id === firstTile.id || tile.id === secondTile.id ? { ...tile, ismatched: true }: tile);

        if(clickref.current<6) setscore(prev=>prev+5)
        else if(clickref.current<12) setscore(prev=>prev+4)
        else if(clickref.current<20) setscore(prev=>prev+3)
        else if(clickref.current<30) setscore(prev=>prev+2)
        else if(clickref.current>=30) setscore(prev=>prev+1)

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
                key={tile.id}
                onClick={() => handleclick(tile)}
                className={`
                  flex items-center justify-center cursor-pointer transition-all duration-300 scorebox bg-lightgrey p-2 max-h-[86px] overflow-hidden
                   ${(tile.isflipped || tile.ismatched) ? 'bg-cover bg-center' : ''}
                `}
              >
                {!tile.isflipped && !tile.ismatched ? (
                  <img src="/images/question.png" alt="Hidden tile" />
                ) : (
                  <img src={`${tile.image}`} alt="Tile image"className=' max-h-[75px]' />
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
          <h1 className='text-4xl text-center'>Match the tiles</h1>
          <p className='text-2xl font-normal lg:w-[600px] pb-7 lg:pb-0 px-5'>
            Matching Tiles is a classic memory game where players flip over pairs of tiles to find matching images. The goal is to remember the positions of previously revealed tiles and match all pairs with the fewest attempts. Players take turns or play solo, testing their concentration and recall skills. It's a fun and engaging way to improve memory and focus while enjoying a relaxing challenge.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Matchthechessman