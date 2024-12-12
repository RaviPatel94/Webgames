import { SignIn } from '@clerk/clerk-react'
import React from 'react'

function Login() {
  return (
    <div>
        <SignIn signUpUrl='/auth/signup' forceRedirectUrl={"/auth/signup"}/>
    </div>
  )
}

export default Login