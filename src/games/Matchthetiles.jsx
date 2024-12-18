import React, { useState, useEffect } from 'react'
import Btn from '../components/Btn'

function Matchthetiles() {
  const [tiles, settiles] = useState([])
  const [matched, setmatched] = useState([])
  const [selected, setselected] = useState([])
  const [gameover, setgameover] = useState(false)
  const [points, setpoints] = useState(0)

  const images = [
    "/images/bottle.png",
    "/images/camera.png",
    "/images/dino.png",
    "/images/dustbin.png",
    "/images/factory.png",
    "/images/headphone.png",
    "/images/treasure.png",
    "/images/heart.png"
  ]

  useEffect(() => {
    initlizegame()
  }, [])

  const initlizegame = () => {
    const gametiles = [...images, ...images]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        "id": `tile-${index}-${Math.random().toString(36).substr(2, 9)}`,
        image,  
        isflipped: false,
        ismatched: false,
      }))

    settiles(gametiles)
    setmatched([])
    setselected([])
    setgameover(false)
  }

  const handleclick = (clickedtile) => {
    if (clickedtile.isflipped || clickedtile.ismatched || selected.length === 2) return;

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
  const shareLink = () => {
    let url = window.location.href
    window.navigator.clipboard.writeText(url)
    setshared(true)
    setTimeout(() => setshared(false), 2500)
  }

  return (
    <div className='pt-[75px] min-h-screen bg-lightgrey text-2xl'>
      <div className='w-screen flex justify-between items-center px-36'>
        <Btn text="Reset" ClickEvent={initlizegame} />
        <div className='relative'>
          <Btn text="Share" ClickEvent={shareLink}/>
          <div className={'absolute bg-lightgrey scorebox top-10 z-40 '+ (shared?"":"hidden")}>
            Link Copied
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center gap-16 pt-12'>
        <div className='border-2 border-black w-max'>
          <div className='bg-lightgrey size-80 lg:size-[360px] scorebox grid grid-cols-4 gap-1'>
            {tiles.map((tile) => (
              <div
                key={tile.id}
                onClick={() => handleclick(tile)}
                className={`
                  flex items-center justify-center cursor-pointer transition-all duration-300 scorebox bg-lightgrey
                   ${(tile.isflipped || tile.ismatched) ? 'bg-cover bg-center' : ''}
                `}
              >
                {!tile.isflipped && !tile.ismatched ? (
                  <img src="/images/question.png" alt="Hidden tile" />
                ) : (
                  <img src={`${tile.image}`} alt="Tile image" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col gap-11'>
          <h1 className='text-4xl text-center'>Match the tiles</h1>
          <p className='text-2xl font-normal lg:w-[600px] pb-7 lg:pb-0'>
            Matching Tiles is a classic memory game where players flip over pairs of tiles to find matching images. The goal is to remember the positions of previously revealed tiles and match all pairs with the fewest attempts. Players take turns or play solo, testing their concentration and recall skills. It's a fun and engaging way to improve memory and focus while enjoying a relaxing challenge.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Matchthetiles