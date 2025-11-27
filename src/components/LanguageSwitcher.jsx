import { useLanguage } from '../contexts/LanguageContext'
import './LanguageSwitcher.css'

function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button className="language-switcher" onClick={toggleLanguage}>
      {language === 'ar' ? 'FR' : 'AR'}
    </button>
  )
}

export default LanguageSwitcher

