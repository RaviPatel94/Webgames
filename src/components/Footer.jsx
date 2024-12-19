import React from 'react'

function Footer() {
  return (
    <div className='bg-lightgrey py-7 px-6 border-2 border-t-gray-700 flex flex-col sm:flex-row items-center justify-center gap-16'>
      <form action="https://api.web3forms.com/submit" method="POST" className='flex flex-col gap-4 w-52 text-xl '>
      <input type="hidden" name="access_key" value="f452ef1d-ac63-4571-a65a-ba9e3eb41901"></input>
      <input type="text" placeholder='Name' name="name" className='h-8 scorebox outline-none pl-2 placeholder:text-gray-800' required />
      <input type="email" placeholder='Email' name="Email" className='h-8 scorebox outline-none pl-2 placeholder:text-gray-800' required />
      <input type="text" placeholder='Query/ Feedback' name="message" className='h-8 scorebox outline-none pl-2 placeholder:text-gray-800' required/>
      <input type="submit" className='btn' />
      </form>
      <div className='flex flex-col gap-4 text-3xl scorebox p-3 bg-lightgrey'>
        <div className=' '>
          <p>Made by : <span className='underline'><a href="https://ravip.netlify.app/" target='_blank'>Ravi Patel</a></span></p>
        </div>
        <div className=' '>
        <a href="https://github.com/RaviPatel94/Webgames" target='_blank'
      >View Repository</a>
        </div>
      </div>
    </div>
  )
}

export default Footer