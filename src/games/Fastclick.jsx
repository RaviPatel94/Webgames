import React, { useState, useCallback, useEffect, useRef } from 'react'
import Btn from './../components/Btn'
import { supabase } from './../supabaseClient'
import Dialog from './../components/Dialog'
import { useUser } from "@clerk/clerk-react";
import { MdLeaderboard } from "react-icons/md";

function Fastclick() {
  const [time, setTime] = useState(5000)
  const [currentCPS, setCurrentCPS] = useState(0)
  const [personalBest, setPersonalBest] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [isGameActive, setIsGameActive] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [rank, setRank] = useState("")
  const [shared, setShared] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const clickCountRef = useRef(0)
  const { user } = useUser();

  const timeOptions = [
    { value: 1000, label: '1 sec' },
    { value: 5000, label: '5 sec' },
    { value: 10000, label: '10 sec' },
    { value: 30000, label: '30 sec' }
  ]

  useEffect(() => {
    audioRef.current = new Audio("/sounds/mouseclick.mp3")
    audioRef.current.preload = 'auto'
  }, [])

  const sound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  const calculateRank = useCallback((cps) => {
    if (cps > 16) return "Mercury"
    if (cps > 14) return "Venus"
    if (cps > 12) return "Earth"
    if (cps > 10) return "Mars"
    if (cps > 8) return "Jupiter"
    if (cps > 6) return "Saturn"
    if (cps > 4) return "Uranus"
    if (cps > 2) return "Neptune"
    return "Pluto"
  }, [])

  const fetchLeaderboard = useCallback(async () => {
    const { data } = await supabase
      .from("fcscore")
      .select("*")
      .order("score", { ascending: false })
      .limit(10)
    if (data) setLeaderboard(data)
  }, [])

  const fetchPersonalBest = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("fcscore")
      .select("id, score, username")
      .eq("user_id", user.id)
      .single();
    if (data) setPersonalBest(data.score);
  }, [user]);

  const updateBestScore = useCallback(
    async (finalCPS) => {
      if (!user) return;
      const currentUsername = user.username || user.firstName || "Guest";

      const { data: existing } = await supabase
        .from("fcscore")
        .select("id, score, user_id, username")
        .eq("username", currentUsername)
        .single();

      if (existing) {
        if (finalCPS > existing.score) {
          await supabase
            .from("fcscore")
            .update({
              score: finalCPS,
              user_id: user.id,
              username: currentUsername,
            })
            .eq("username", currentUsername)
            .select();
          await fetchLeaderboard();
        }
      } else {
        await supabase
          .from("fcscore")
          .insert([
            {
              user_id: user.id,
              username: currentUsername,
              score: finalCPS,
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

  const startGame = useCallback(() => {
    setClickCount(0)
    clickCountRef.current = 0
    setIsGameActive(true)
    setIsGameOver(false)
    timerRef.current = setTimeout(async () => {
      const finalCPS = clickCountRef.current / (time / 1000)
      setCurrentCPS(finalCPS)
      setRank(calculateRank(finalCPS))
      setIsGameActive(false)
      setIsGameOver(true)
      if (finalCPS > personalBest) {
        setPersonalBest(finalCPS)
        await updateBestScore(finalCPS)
      }
    }, time)
  }, [time, personalBest, calculateRank, updateBestScore])

  const handleClick = useCallback(() => {
    if (!isGameActive && !isGameOver) {
      startGame()
    }
    if (isGameActive) {
      setClickCount(prev => prev + 1)
      clickCountRef.current += 1
      sound()
    }
  }, [isGameActive, isGameOver, startGame])

  const shareLink = useCallback(() => {
    let url = window.location.href
    window.navigator.clipboard.writeText(url)
    setShared(true)
    setTimeout(() => setShared(false), 2500)
  }, [])

  const resetGame = useCallback(() => {
    setCurrentCPS(0)
    setClickCount(0)
    clickCountRef.current = 0
    setIsGameOver(false)
    setRank("")
  }, [])

  const handleTimeSelect = useCallback((newTime) => {
    setTime(newTime)
    setIsDropdownOpen(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const selectedTimeLabel = timeOptions.find(option => option.value === time)?.label || '5 sec'

  return (
    <div className='min-h-screen bg-lightgrey pt-[75px] flex flex-col items-center'>
      <div className='flex justify-between lg:flex-row px-3 sm:px-32 lg:px-56 text-3xl sm:text-2xl w-screen relative'>
        <div className='scorebox px-1'>Time: {time/1000} sec</div>
        <div className='scorebox px-1 w-[160px] hidden sm:block'>Current CPS: {currentCPS.toFixed(2)}</div>
        <div className='scorebox px-1'>Best CPS: {personalBest.toFixed(2)}</div>
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

      <div className='w-screen flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-16 mt-10 sm:mt-16'>
        <div className='relative border-2 border-gray-700'>
          <div 
            className='relative bg-lightgrey size-80 lg:size-[360px] shrink-0 border-4 btn overflow-hidden flex items-center justify-center text-4xl'
            onClick={handleClick}
          >
            {isGameActive ? clickCount : (isGameOver ? "Game Over" : "Start Clicking")}
          </div>
          {isGameOver && (
            <div className='absolute w-full bg-lightgrey h-full top-0 text-3xl items-center justify-center flex-col gap-4 flex border-4 scorebox'>
              <p className='text-4xl'>Result</p>
              <div className='align-baseline flex flex-col gap-2 font-medium'>
                <p>Current CPS: {currentCPS.toFixed(2)}</p>
                <p>Rank: {rank}</p>
                <p>Best CPS: {personalBest.toFixed(2)}</p>
              </div>
              <div className='w-[140px]'>
                <Btn text="Play Again" ClickEvent={resetGame}/>
              </div>
            </div>
          )}
        </div>

        <div className='flex justify-between px-10  w-full sm:hidden text-xl'>
          <div className='relative'>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className='bg-lightgrey border-2 border-gray-400 px-3 py-2 text-xl flex items-center gap-2 min-w-[120px] justify-between'
              style={{
                borderTopColor: '#ffffff',
                borderLeftColor: '#ffffff',
                borderRightColor: '#808080',
                borderBottomColor: '#808080',
              }}
            >
              <span>{selectedTimeLabel}</span>
              <span className='text-sm'>▼</span>
            </button>
            {isDropdownOpen && (
              <div 
                className='absolute top-full left-0 bg-lightgrey border-2 border-gray-400 z-50 min-w-[120px]'
                style={{
                  borderTopColor: '#808080',
                  borderLeftColor: '#808080',
                  borderRightColor: '#ffffff',
                  borderBottomColor: '#ffffff',
                }}
              >
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTimeSelect(option.value)}
                    className='w-full px-3 py-1 text-left text-xl hover:bg-blue-600 hover:text-white'
                    style={{
                      backgroundColor: option.value === time ? '#0000ff' : 'transparent',
                      color: option.value === time ? '#ffffff' : '#000000'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className='border-2 border-black text-xl'>
          <button 
            onClick={() => setIsLeaderboardOpen(true)} 
            className="py-1 btn h-full"
          >
            <MdLeaderboard />
          </button>
          </div>
        </div>

        <div className='flex flex-col w-max gap-10 justify-center'>
          <h1 className='text-4xl text-center'>Fastest Clicker</h1>
          <div className='px-6 w-screen sm:w-[450px] text-2xl pb-9 sm:pb-0'>
            "Think you can beat me? Click as fast as you can in the black area! My record is 12 CPS. Do you have what it takes to dethrone the developer? Prove your speed and skill. Best of luck—you'll need it!"
          </div>
          <div className='hidden text-2xl sm:flex gap-5 w-max'>
            <Btn text="1 sec" ClickEvent={()=>setTime(1000)} />
            <Btn text="5 sec" ClickEvent={()=>setTime(5000)}/>
            <Btn text="10 sec" ClickEvent={()=>setTime(10000)}/>
            <Btn text="30 sec" ClickEvent={()=>setTime(30000)}/>
          </div>
        </div>
      </div>

<Dialog
  isOpen={isLeaderboardOpen}
  onClose={() => setIsLeaderboardOpen(false)}
  title="FC Leaderboard"
  data={leaderboard}
/>
    </div>
  )
}

export default Fastclick