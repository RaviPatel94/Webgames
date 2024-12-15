import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react'

import Layout from './Layout.jsx'
import Loginlayout from './Loginlayout.jsx'
import Hero from './components/Hero.jsx'
import RPS from './games/RPS.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Fastclick from './games/Fastclick.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <Navigate to="/auth/login" replace />
      </SignedOut>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "",
        element: <Hero/>
      },
      {
        path: "rps",
        element: (
          <ProtectedRoute>
            <RPS/>
          </ProtectedRoute>
        )
      },
      {
        path: "fastclicker",
        element: (
          <ProtectedRoute>
            <Fastclick/>
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "/auth",
    element: <Loginlayout/>,
    children: [
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "signup",
        element: <Signup/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
)