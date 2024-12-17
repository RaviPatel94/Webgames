import React, { useState,useCallback, useEffect } from 'react'
import Btn from '../components/Btn'

function Matchthetiles() {

  const [tiles, settiles] = useState([])
  const [matched, setmatched] = useState([])
  const [selected, setselected] = useState([])
  const [gameover, setgameover] = useState(false)

  const images=[
    "/images/bottle",
    "/images/camera",
    "/images/dino",
    "/images/dustbin",
    "/images/factory",
    "/images/headphone",
    "/images/treasure",
    "/images/heart"
  ]

  useEffect(()=>{
    initlizegame()
  },[])

  const initlizegame=()=>{

    const gametiles=[...images,...images].sort(()=>Math.random()-0.5).map((image,index)=>({
      "id":index,
      image,  
      isflipped:false,
      ismatched:false
    }))
    console.log(gametiles)

    settiles(gametiles)
    setmatched([])
    setselected([])
    setgameover([])
  }

  const handleclick=(clickedtile)=>{
    console.log("handle click ran")
    if (clickedtile.isflipped==true || clickedtile.ismatched===true || selected.length==2) return; console.log("already flipped")

    const updatedtiles= tiles.map(tile=>tile.id===clickedtile.id?{...tiles,isflipped:true}:tile)
    settiles(updatedtiles)

    const newSelectedTiles = [...selected, clickedtile];
    setselected(newSelectedTiles);

    if (newSelectedTiles.length === 2) {
      setTimeout(() => checkMatch(newSelectedTiles, updatedtiles), 1000);
    }
  }
  const checkMatch = (selectedPair, currentTiles) => {
    const [firstTile, secondTile] = selectedPair;

    if (firstTile.image === secondTile.image) {
      const matchedTiles = currentTiles.map(tile => 
        tile.id === firstTile.id || tile.id === secondTile.id
          ? { ...tile, ismatched: true }
          : tile
      );

      settiles(matchedTiles);
      setmatched([...matched, firstTile.image]);

      if (matched.length + 1 === images.length) {
        setgameover(true);
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
  const shareLink = useCallback(() => {
      let url = window.location.href
      window.navigator.clipboard.writeText(url)
      setshared(true)
      setTimeout(() => setshared(false), 2500)
  }, [])

  return (
    <div className='pt-[75px] min-h-screen bg-lightgrey text-2xl'>
        <div className='w-screen flex justify-between items-center px-36'>
          <Btn text="Reset" />
          <div className='relative'>
                <Btn text="Share" ClickEvent={shareLink}/>
                <div className={'absolute bg-lightgrey scorebox top-10 z-40 '+ (shared?"":"hidden")}>
                    Link Copied
                </div></div>
        </div>
        <div className='flex items-center justify-center gap-16 pt-12'>
          <div className='border-2 border-black w-max'>
          <div className='bg-lightgrey size-80 lg:size-[360px] scorebox grid grid-cols-4 gap-2'>
          {tiles.map((tile) => (
          <div
            key={tile.id}
            onClick={() => handleclick(tile)}
            className={`
              w-20 h-20 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300
              ${tile.ismatched ? 'opacity-15' : ''}
              ${tile.isflipped || tile.ismatched 
                ? 'opacity-15' 
                : ''
              }
            `}
            style={{
              backgroundImage: (tile.isflipped || tile.ismatched) 
                ? `url(${tile.image})` 
                : 'none'
            }}
          >
            {!tile.isflipped && !tile.ismatched && (
              <img src="/images/question.png" alt="" />
            )}
          </div>
        ))}
          </div></div>
          <div className='flex flex-col gap-11'>
            <h1 className='text-4xl text-center'>Match the tiles</h1>
            <p className='text-2xl font-normal lg:w-[600px] pb-7 lg:pb-0' >Matching Tiles is a classic memory game where players flip over pairs of tiles to find matching images. The goal is to remember the positions of previously revealed tiles and match all pairs with the fewest attempts. Players take turns or play solo, testing their concentration and recall skills. It's a fun and engaging way to improve memory and focus while enjoying a relaxing challenge.</p>
          </div>
        </div>
    </div>
  )
}

export default Matchthetiles