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
// import { PointsProvider } from './context/pointscontext.jsx'
import G2048 from './games/G2048.jsx'
import Footer from './components/Footer.jsx'
import Matchthechessman from './games/Matchthechessman.jsx'

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

const Home = () => {
  return (
    <>
      <Hero />
      <Footer />
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
        element: <Home/>
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
        path: "matchthetiles",
        element: (
          <ProtectedRoute>
            <Matchthetiles/>
          </ProtectedRoute>
        )
      },
      {
        path: "2048",
        element: (
          <ProtectedRoute>
            <G2048/>
            </ProtectedRoute>
        )
      },
      {
        path: "matchthechessman",
        element: (
          <ProtectedRoute>
            <Matchthechessman/>
          </ProtectedRoute>
        )
      },
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

// function InitializeUserPoints() {
//   const { user, isLoaded } = useUser();

//   useEffect(() => {
//     const initializePoints = async () => {
//       // Check if user is loaded and points metadata doesn't exist
//       if (isLoaded && user && user.publicMetadata?.points === undefined) {
//         try {
//           await user.update({
//             publicMetadata: {
//               points: 0
//             }
//           });
//           console.log('User points initialized');
//         } catch (error) {
//           console.error('Error initializing points:', error);
//         }
//       }
//       else{
//         console.log(user.publicMetadata.points)
//       }
//     };

//     initializePoints();
  
//   }, [user, isLoaded]);
//   return null;
// }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    {/* <InitializeUserPoints /> */}
      {/* <PointsProvider> */}
        <RouterProvider router={router} />
      {/* </PointsProvider> */}
    </ClerkProvider>
  </StrictMode>,
)