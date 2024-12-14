import { SignIn } from '@clerk/clerk-react'
import React from 'react'

function Login() {
  return (
    <div className='flex items-center justify-center bg-lightgrey h-screen'> 
        <SignIn signUpUrl='/auth/signup' forceRedirectUrl={"/auth/signup"}
         appearance={{
          elements: {
            card: ' bg-lightgrey scorebox rounded-none', // Grey background, rectangular shape
            formButtonPrimary: 'bg-gray-200 hover:bg-gray-200 text-gray-700 text-lg h-[36px]',
            button:" btn bg-lightgrey rounded-none",
            formFieldInput: 'bg-gray-200 border-2 border-gray-500 border-b-gray-300 border-r-gray-300 rounded-none text-lg', // Grey input borders
            socialButtonsBlockButton: 'bg-lightgrey text-gray-800 hover:bg-gray-300', // Social login buttons
            socialButtonsBlockButtonText :"text-lg",
            button__google:"border-3 border-black ",
            logoImage:"size-16",
            headerTitle: ' text-gray-800 text-2xl',
            headerSubtitle:"text-lg font-medium text-gray-800",
            formFooter: 'rounded-none bg-black',
            cardContainer: 'rounded-none bg-black'
          },
          variables: {
            colorPrimary: 'black', // Grey primary color for highlights
            colorText:"rgb(17 24 39)",
          },
          layout: {
            socialButtonsPlacement: 'top', // Optional: place social buttons at bottom
            logoImageUrl:"/images/websitelogo.png"
          }
        }}
        />
    </div>
  )
}

export default Login