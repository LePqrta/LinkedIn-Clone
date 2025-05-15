import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Feed } from './features/feed/pages/Feed'
import { Login } from './features/authentication/pages/login/Login'
import { Signup } from './features/authentication/pages/signup/Signup'
import { Profile } from './features/profile/pages/Profile'
import { Connections } from './features/connections/pages/Connections'
import { Notifications } from './features/connections/pages/Notifications'
import { AuthenticationContextProvider } from './features/authentication/contexts/AuthenticationContextProvider'
import { ErrorBoundary } from './component/error-boundary/ErrorBoundary'
import { Jobs } from './features/feed/pages/Jobs'
import { AdminPanel } from './features/admin/pages/AdminPanel'

const router = createBrowserRouter([
  {
    element: <AuthenticationContextProvider/>,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Feed/>,
      },
      {
        path: '/login',
        element: <Login/>,
      },
      {
        path: '/signup',
        element: <Signup/>,
      },
      {
        path: '/profile/:username',
        element: <Profile/>,
      },
      {
        path: '/connections',
        element: <Connections/>,
      },
      {
        path: '/notifications',
        element: <Notifications/>,
      },
      {
        path: '/jobs',
        element: <Jobs/>,
      },
      {
        path: '/admin',
        element: <AdminPanel/>,
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
