import React from 'react'

function Footer() {
  return (
    <div className='bg-lightgrey py-7 px-6 border-2 border-t-gray-700 flex items-center justify-center'>
      <form action="https://api.web3forms.com/submit" method="POST" className='flex flex-col gap-4 w-52 '>
      <input type="hidden" name="access_key" value="f452ef1d-ac63-4571-a65a-ba9e3eb41901"></input>
      <input type="text" placeholder='Name' name="name" className='h-8 scorebox outline-none pl-2' required />
      <input type="email" placeholder='Email' name="Email" className='h-8 scorebox outline-none pl-2' required />
      <input type="text" placeholder='Query/ Feedback' name="message" className='h-8 scorebox outline-none pl-2' required/>
      <input type="submit" className='submit' />
      </form>
      <a href="https://github.com/RaviPatel94/Webgames" target='_blank'
      className='text-5xl'
      >View Github</a>
    </div>
  )
}

export default Footer