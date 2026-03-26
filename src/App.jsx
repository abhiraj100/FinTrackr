import { AppProvider, useApp } from './context/AppContext'
import AuthPage   from './pages/auth/AuthPage'
import MainLayout from './components/layout/MainLayout'

const Inner = () => {
  const { currentUser } = useApp()
  return currentUser ? <MainLayout /> : <AuthPage />
}

export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  )
}
