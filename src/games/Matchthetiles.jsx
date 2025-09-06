import React, { useState, useEffect, useRef, useCallback } from 'react'
import Btn from '../components/Btn'
import { supabase } from './../supabaseClient'
import Dialog from './../components/Dialog'
import { useUser } from "@clerk/clerk-react";
import { MdLeaderboard } from "react-icons/md";

function Matchthetiles() {
  const [tiles, settiles] = useState([])
  const [matched, setmatched] = useState([])
  const [selected, setselected] = useState([])
  const [gameover, setgameover] = useState(false)
  const [score, setscore] = useState(0)
  const [pb, setpb] = useState(0)
  const [shared, setshared] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  
  const clickref = useRef(0)
  const audioRef = useRef(null);
  const audioRef2 = useRef(null);
  const { user } = useUser();

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
      audioRef.current = new Audio("/sounds/mouseclick.mp3");
      audioRef.current.preload = 'auto';
      audioRef2.current = new Audio("/sounds/collect.mp3");
      audioRef2.current.preload = 'auto';
  }, []);

  const sound = () => {
      if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
      }
  }
  
  const collectsound = () => {
    if (audioRef2.current) {
        audioRef2.current.currentTime = 0;
        audioRef2.current.play();
    }
  }

  const fetchLeaderboard = useCallback(async () => {
    const { data } = await supabase
      .from("mttscore")
      .select("*")
      .order("score", { ascending: false })
      .limit(10)
    if (data) setLeaderboard(data)
  }, [])

  const fetchPersonalBest = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("mttscore")
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
        .from("mttscore")
        .select("id, score, user_id, username")
        .eq("username", currentUsername)
        .single();

      if (existing) {
        if (finalScore > existing.score) {
          await supabase
            .from("mttscore")
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
          .from("mttscore")
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
    fetchPersonalBest();
  }, [fetchLeaderboard, fetchPersonalBest]);

  useEffect(() => {
    if (score > pb) {
      setpb(score);
    }
  }, [score, pb]);

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
    setscore(0)
    clickref.current=0
  }

  const handleclick = (clickedtile) => {
    if (clickedtile.isflipped || clickedtile.ismatched || selected.length === 2) return;
    sound()
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

  const checkMatch = async (selectedPair, currentTiles) => {
    const [firstTile, secondTile] = selectedPair;

    if (firstTile.image === secondTile.image) {
      const matchedTiles = currentTiles.map(tile => 
        tile.id === firstTile.id || tile.id === secondTile.id ? { ...tile, ismatched: true }: tile);
        collectsound()
        let newScore = score;
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
        else if(clickref.current>=30) {
          newScore = score + 1;
          setscore(prev=>prev+1)
        }

      settiles(matchedTiles);
      setmatched([...matched, firstTile.image]);

      if (matched.length + 1 === images.length) {
        setgameover(true);
        const finalScore = newScore > score ? newScore : score + (clickref.current<6 ? 5 : clickref.current<12 ? 4 : clickref.current<20 ? 3 : clickref.current<30 ? 2 : 1);
        if (finalScore > pb) {
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

  return (
    <div className='pt-[75px] min-h-screen bg-lightgrey text-2xl'>
      <div className='w-screen flex justify-between items-center px-3 sm:px-36'>
        <Btn text="Reset" ClickEvent={initlizegame} />
        <div className='scorebox px-2'>Score : {score}</div>
        <div className='scorebox px-2'>PB : {pb}</div>
        <div className='hidden sm:flex gap-3 relative'>
          <Btn text="Share" ClickEvent={shareLink}/>
          <div className={'absolute bg-lightgrey scorebox top-12 z-40 '+ (shared?"":"hidden")}>
            Link Copied
          </div>
        </div>
        <div className='hidden sm:flex gap-3 relative'>
          <Btn text="Leaderboard" ClickEvent={() => setIsLeaderboardOpen(true)}/>
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
                  flex items-center justify-center cursor-pointer transition-all duration-300 scorebox bg-lightgrey p-2
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
          <div className='flex items-center justify-center sm:justify-center gap-2'>
            <h1 className='text-4xl text-center'>Match the tiles</h1>
            <div className='sm:hidden mr-10'>
              <Btn text={<MdLeaderboard />} ClickEvent={() => setIsLeaderboardOpen(true)}/>
            </div>
          </div>
          <p className='text-2xl font-normal lg:w-[600px] pb-7 lg:pb-0 px-5'>
            Matching Tiles is a classic memory game where players flip over pairs of tiles to find matching images. The goal is to remember the positions of previously revealed tiles and match all pairs with the fewest attempts. Players take turns or play solo, testing their concentration and recall skills. It's a fun and engaging way to improve memory and focus while enjoying a relaxing challenge.
          </p>
        </div>
      </div>

      <Dialog
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        title="MTT Leaderboard"
        data={leaderboard}
      />
    </div>
  )
}

export default Matchthetiles