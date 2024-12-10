import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className='w-screen fixed flex justify-between items-center px-5 py-2 border-b-2 border-gray-700' >
      <Link to={"/"} >
        <div className='flex items-center gap-2'>
          <img src="/images/websitelogo.png" alt="Webiste logo" 
          className='size-9' />
          <h1 className='text-[28px] font-medium text-gray-900'>Web-Games</h1>
        </div>
        </Link>
        <div>
          <input type="text" placeholder='Search Games'
          className='bg-zinc-200 w-[390px] h-[39px] border-2 border-gray-500 pl-2 text-xl text-gray-700 border-r-gray-300 border-b-gray-300 placeholder-gray-900 outline-none font-medium' />
        </div>
        <div className='flex gap-2 items-center '>
          <div className='items-center flex border-2 h-[40px] px-3 py-[2px] gap-1 scorebox'>
            <span className='text-[23px]'>0</span>
            <img src="/images/WGP.png" alt="Points" 
            className='size-[32px] rounded-full'/>
          </div>
          <div>
            <img src="/images/icon.png" alt="" 
            className='size-10 cursor-pointer scorebox' />
          </div>
        </div>
    </nav>
  )
}

export default Navbar