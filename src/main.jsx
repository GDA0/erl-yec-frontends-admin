import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { HomePage } from './HomePage.jsx'
import { Root } from './routes/Root.jsx'
import { ErrorPage } from './ErrorPage.jsx'
import { Register } from './routes/Register.jsx'
import { CheckIn } from './routes/CheckIn.jsx'
import { Dashboard } from './routes/Dashboard.jsx'

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'check-in',
        element: <CheckIn />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
