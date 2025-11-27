import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import { Link } from 'react-router-dom'
import LanguageSwitcher from '../components/LanguageSwitcher'
import ReadAllButton from '../components/ReadAllButton'
import './FarmerPage.css'

function FarmerPage() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="farmer-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <button className="btn-login">{t.login}</button>
              <Link to="/farmer/login?solution=1" className="btn-start">{t.startNow}</Link>
            </div>
            <nav className="nav">
              <Link to="/">{t.features}</Link>
              <Link to="/">{t.howItWorks}</Link>
              <Link to="/">{t.forBanks}</Link>
              <Link to="/">{t.contactUs}</Link>
            </nav>
            <div className="logo-brand">
              <span className="leaf-icon">🌱</span>
              <span>{t.agriculturalFinancing}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="farmer-content">
        <div className="container">
          <div className="farmer-header-section">
            <div>
              <h1 className="farmer-page-title">{t.farmerPageTitle}</h1>
              <p className="farmer-page-subtitle">{t.chooseSolution}</p>
            </div>
            <ReadAllButton targetSelector=".farmer-content" />
          </div>

          <div className="solutions-container">
            {/* Solution 1 */}
            <div className="solution-card">
              <div className="solution-number">01</div>
              <div className="solution-header">
                <h2 className="solution-title">{t.solution1Title}</h2>
                <span className="solution-badge">{t.solution1}</span>
              </div>
              <p className="solution-description">{t.solution1Description}</p>
              <ul className="solution-features">
                {t.solution1Features.map((feature, index) => (
                  <li key={index}>
                    <span className="check-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/farmer/login?solution=1" className="btn-solution">{t.getStarted}</Link>
            </div>

            {/* Solution 2 */}
            <div className="solution-card">
              <div className="solution-number">02</div>
              <div className="solution-header">
                <h2 className="solution-title">{t.solution2Title}</h2>
                <span className="solution-badge">{t.solution2}</span>
              </div>
              <p className="solution-description">{t.solution2Description}</p>
              <ul className="solution-features">
                {t.solution2Features.map((feature, index) => (
                  <li key={index}>
                    <span className="check-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/farmer/login?solution=2" className="btn-solution">{t.getStarted}</Link>
            </div>
          </div>

          <div className="back-button-container">
            <Link to="/" className="btn-back">
              ← {t.backToHome}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FarmerPage

