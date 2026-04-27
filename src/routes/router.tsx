import { createBrowserRouter, redirect } from 'react-router'

import App from '../App'
import Dashboard from '../pages/Dashboard/Dashboard'
import DashboardIndex from '../pages/Dashboard/DashboardIndex'
import Login from '../pages/Login/Login'
import PrivateRoute from './PrivateRoute'

export default createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        loader: () => redirect('/login'),
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'dashboard',
        Component: PrivateRoute,
        children: [
          {
            Component: Dashboard,
            children: [
              {
                index: true,
                Component: DashboardIndex,
              },
            ],
          },
        ],
      },
    ],
  },
])
