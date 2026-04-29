import { createBrowserRouter } from 'react-router'

import App from '../App'
import AdminsPage from '../pages/Dashboard/Admins'
import CategoriesPage from '../pages/Dashboard/Categories'
import Dashboard from '../pages/Dashboard/Layout'
import DashboardIndex from '../pages/Dashboard/Home'
import NewsFormPage from '../pages/Dashboard/News/Form'
import NewsPage from '../pages/Dashboard/News'
import NewsDetailPage from '../pages/Dashboard/News/Detail'
import SettingsPage from '../pages/Dashboard/Settings'
import TeamFormPage from '../pages/Dashboard/Team/Form'
import TeamPage from '../pages/Dashboard/Team'
import TeamDetailPage from '../pages/Dashboard/Team/Detail'
import Login from '../pages/Login/Login'
import PrivateRoute from './PrivateRoute'

export default createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '/',
        Component: PrivateRoute,
        children: [
          {
            Component: Dashboard,
            children: [
              {
                index: true,
                Component: DashboardIndex,
              },
              {
                path: 'admins',
                Component: AdminsPage,
              },
              {
                path: 'categories',
                Component: CategoriesPage,
              },
              {
                path: 'news',
                Component: NewsPage,
              },
              {
                path: 'news/create',
                Component: NewsFormPage,
              },
              {
                path: 'news/:newsId/edit',
                Component: NewsFormPage,
              },
              {
                path: 'news/:newsId',
                Component: NewsDetailPage,
              },
              {
                path: 'team',
                Component: TeamPage,
              },
              {
                path: 'team/create',
                Component: TeamFormPage,
              },
              {
                path: 'team/:teamId/edit',
                Component: TeamFormPage,
              },
              {
                path: 'team/:teamId',
                Component: TeamDetailPage,
              },
              {
                path: 'settings',
                Component: SettingsPage,
              },
            ],
          },
        ],
      },
      {
        path: 'login',
        Component: Login,
      },
    ],
  },
])
