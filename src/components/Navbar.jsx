import React from 'react'

function Navbar() {
  return (
    <nav className='w-screen fixed flex justify-between items-center px-3 py-2 bg-navyblue' >
        <div className='flex items-center gap-2'>
          <img src="/images/websitelogo.png" alt="Webiste logo" 
          className='size-9' />
          <h1 className='text-[28px] font-medium text-lightgrey'>Web-Games</h1>
        </div>
        <div>
          <input type="text" placeholder='Search Games'
          className='bg-lightgrey w-[390px] h-[39px] border border-black rounded-full pl-2 text-xl text-gray-700 placeholder-gray-700 outline-none shadow shadow-gray-700 font-medium' />
        </div>
        <div className='flex gap-2 items-center '>
          <div className='size-[37px] bg-white rounded-full overflow-hidden flex '>
            <div className='w-1/2 h-full bg-lightgrey'></div>
            <div className='w-1/2 h-full bg-navyblue'></div>
          </div>
          <div className='items-center flex border border-zinc-700 h-[40px] px-3 py-[2px] rounded-full gap-1 bg-lightgrey'>
            <span className='text-[23px]'>100</span>
            <img src="/images/WGP.png" alt="Points" 
            className='size-[32px] rounded-full'/>
          </div>
          <div>
            <img src="/images/icon.jpg" alt="" 
            className='size-10 border border-zinc-700 rounded-full cursor-pointer brightness-75' />
          </div>
        </div>
    </nav>
  )
}

export default Navbar