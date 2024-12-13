import React, { useRef, useEffect } from 'react'

function Btn(Props) {
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio("/sounds/btnclick.mp3");
        
        audioRef.current.preload = 'auto';
    }, []);

    const sound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    }
  
    return (
        <div className='w-[82px]' onClick={Props.ClickEvent}>
        <div 
            className='border-2 border-gray-900 h-max w-max' 
            onClick={sound}
        >
            <div className='btn'>{Props.text}</div>
        </div>
        </div>
    )
}

export default Btn