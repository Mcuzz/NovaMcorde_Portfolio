import { useState } from 'react'
import App from './App'
import { SplashScreen } from './components/SplashScreen/SplashScreen'

export function AppRoot() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <App />
    </>
  )
}