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

    const gametimes=[...images,...images].sort(()=>Math.random()-0.5).map((image,index)=>({
      "id":index,
      image,  
      isflipped:false,
      ismatched:false
    }))

    settiles(gametimes)
    setmatched([])
    setselected([])
    setgameover([])
  }

  const handelclick=(clickedtile)=>{
    if (clickedtile.isflipped==true || clickedtile.ismatched===true || selected.length==2) return

    const updatedtiles= tiles.map(tile=>tile.id===clickedtile.id?{...tiles,isflipped:true}:tile)
    settiles(updatedtiles)

    

  }

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