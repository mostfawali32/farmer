import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import HomePage from './pages/HomePage'
import FarmerPage from './pages/FarmerPage'
import FarmerLoginRegister from './pages/FarmerLoginRegister'
import FarmerDashboard from './pages/FarmerDashboard'
import BankerLoginPage from './pages/BankerLoginPage'
import BankerLoginRegister from './pages/BankerLoginRegister'
import BankerDashboard from './pages/BankerDashboard'
import LanguageSwitcher from './components/LanguageSwitcher'
import TextToSpeechHandler from './components/TextToSpeechHandler'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <Router basename="/farmer">
        <div className="app-wrapper">
          <LanguageSwitcher />
          <TextToSpeechHandler />
          <Routes>
            <Route path="/farmer" element={<HomePage />} />
            <Route path="farmerpage" element={<FarmerPage />} />
            <Route path="farmer/login" element={<FarmerLoginRegister />} />
            <Route path="farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="banker" element={<BankerLoginPage />} />
            <Route path="banker/login" element={<BankerLoginRegister />} />
            <Route path="banker/dashboard" element={<BankerDashboard />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
