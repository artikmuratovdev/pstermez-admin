import { createBrowserRouter } from 'react-router'

import App from '../App'
import AdminsPage from '../pages/Admins'
import CategoriesPage from '../pages/Categories'
import Dashboard from '../pages/Layout'
import DashboardIndex from '../pages/Home'
import NewsFormPage from '../pages/News/Form'
import NewsPage from '../pages/News'
import NewsDetailPage from '../pages/News/Detail'
import SettingsPage from '../pages/Settings'
import TeamFormPage from '../pages/Team/Form'
import TeamPage from '../pages/Team'
import TeamDetailPage from '../pages/Team/Detail'
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
