import { Navigate, Outlet, useLocation } from 'react-router'

import { isAuthenticated } from '@/lib/auth'

const PrivateRoute = () => {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}

export default PrivateRoute
