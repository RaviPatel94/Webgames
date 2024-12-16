import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, useUser } from '@clerk/clerk-react'

import Layout from './Layout.jsx'
import Loginlayout from './Loginlayout.jsx'
import Hero from './components/Hero.jsx'
import RPS from './games/RPS.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Fastclick from './games/Fastclick.jsx'
import Matchthetiles from './games/Matchthetiles.jsx'

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
      },
      {
        path: "Matchthetiles",
        element: (
          <ProtectedRoute>
            <Matchthetiles/>
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

function InitializeUserPoints() {
  const { user } = useUser();

  useEffect(() => {
    const initializePoints = async () => {
      // Check if points exist in publicMetadata
      if (user && user.publicMetadata?.points === undefined) {
        await user.update({
          publicMetadata: {
            points: 0
          }
        });
      }
    };

    initializePoints();
  }, [user]);

  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <InitializeUserPoints />
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
)