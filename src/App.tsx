import { Outlet } from 'react-router'

import { Toaster } from '@/components/ui/sonner'

const App = () => {
  return (
    <>
      <Outlet />
      <Toaster richColors />
    </>
  )
}

export default App
