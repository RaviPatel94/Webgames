import { SignUp } from '@clerk/clerk-react'
import React from 'react'

function Signup() {
  return (
    <div className='flex items-center justify-center text-3xl z-[100]'>
        <SignUp signInUrl='/auth/login' forceRedirectUrl={"/"}  />
    </div>
  )
}

export default Signup