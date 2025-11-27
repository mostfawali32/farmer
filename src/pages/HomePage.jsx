import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import farmerImage from '../assets/images/farmer.jpg'
import ReadAllButton from '../components/ReadAllButton'
import '../App.css'

function HomePage() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <button className="btn-login">{t.login}</button>
              <button className="btn-start">{t.startNow}</button>
            </div>
            <nav className="nav">
              <a href="#features">{t.features}</a>
              <a href="#how-it-works">{t.howItWorks}</a>
              <a href="#for-banks">{t.forBanks}</a>
              <a href="#contact">{t.contactUs}</a>
            </nav>
            <div className="logo-brand">
              <span className="leaf-icon">🌱</span>
              <span>{t.agriculturalFinancing}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-left">
              <img src={farmerImage} alt={language === 'ar' ? 'مزارع' : 'Agriculteur'} className="hero-image" />
            </div>
            <div className="hero-right">
              <div className="hero-badge">
                <span className="leaf-icon-small">🌱</span>
                <span>{t.empoweringFarmers}</span>
              </div>
              <div className="hero-title-section">
                <h1 className="hero-title">{t.heroTitle}</h1>
                <ReadAllButton targetSelector=".hero-right" className="hero-read-btn" />
              </div>
              <p className="hero-description">
                {t.heroDescription}
              </p>
              <div className="hero-buttons">
                <Link to="/farmer" className="btn-farmer">{t.startAsFarmer} ←</Link>
                <Link to="/banker" className="btn-bank">{t.bankEmployeeLogin}</Link>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">{t.successRate}</div>
                </div>
                <div className="stat">
                  <div className="stat-number">{t.fundedLoansAmount}</div>
                  <div className="stat-label">{t.fundedLoans}</div>
                </div>
                <div className="stat">
                  <div className="stat-number">5,000+</div>
                  <div className="stat-label">{t.activeFarmers}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">{t.everythingYouNeed}</h2>
          <p className="section-subtitle">
            {t.featuresSubtitle}
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏦</div>
              <h3>{t.feature1Title}</h3>
              <p>{t.feature1Description}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>{t.feature2Title}</h3>
              <p>{t.feature2Description}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🌾</div>
              <h3>{t.feature3Title}</h3>
              <p>{t.feature3Description}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎤</div>
              <h3>{t.feature4Title}</h3>
              <p>{t.feature4Description}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚖️</div>
              <h3>{t.feature5Title}</h3>
              <p>{t.feature5Description}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>{t.feature6Title}</h3>
              <p>{t.feature6Description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header-with-read">
            <div>
              <h2 className="section-title">{t.howItWorksTitle}</h2>
              <p className="section-subtitle">
                {t.howItWorksSubtitle}
              </p>
            </div>
            <ReadAllButton targetSelector="#how-it-works" />
          </div>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-icon">👤</div>
              <h3>{t.step1Title}</h3>
              <p>{t.step1Description}</p>
            </div>
            <div className="step-card">
              <div className="step-icon">📄</div>
              <h3>{t.step2Title}</h3>
              <p>{t.step2Description}</p>
            </div>
            <div className="step-card">
              <div className="step-icon">📈</div>
              <h3>{t.step3Title}</h3>
              <p>{t.step3Description}</p>
            </div>
            <div className="step-card">
              <div className="step-icon">✅</div>
              <h3>{t.step4Title}</h3>
              <p>{t.step4Description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-badge">
            <span className="leaf-icon-small">🌱</span>
            <span>{t.joinThousands}</span>
          </div>
          <h2 className="cta-title">{t.readyToGrow}</h2>
          <p className="cta-description">
            {t.ctaDescription}
          </p>
          <div className="cta-buttons">
            <Link to="/farmer" className="btn-cta-primary">{t.createFarmerAccount}</Link>
            <button className="btn-cta-secondary">{t.learnMore}</button>
          </div>
          <div className="cta-features">
            <div className="cta-feature">
              <span className="check-icon">✓</span>
              <span>{t.noHiddenFees}</span>
            </div>
            <div className="cta-feature">
              <span className="check-icon">✓</span>
              <span>{t.quickApproval}</span>
            </div>
            <div className="cta-feature">
              <span className="check-icon">✓</span>
              <span>{t.trustedBy}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h4>
                <span className="leaf-icon">🌱</span>
                {t.agriculturalFinancing}
              </h4>
              <p>{t.footerDescription}</p>
            </div>
            <div className="footer-column">
              <h4>{t.forFarmers}</h4>
              <ul>
                <li><a href="#">{t.createProfile}</a></li>
                <li><a href="#">{t.trackProduction}</a></li>
                <li><a href="#">{t.applyForLoan}</a></li>
                <li><a href="#">{t.legalSupport}</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>{t.forBanks}</h4>
              <ul>
                <li><a href="#">{t.employeeDashboard}</a></li>
                <li><a href="#">{t.riskAssessment}</a></li>
                <li><a href="#">{t.loanManagement}</a></li>
                <li><a href="#">{t.partnerWithUs}</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>{t.support}</h4>
              <ul>
                <li><a href="#">{t.helpCenter}</a></li>
                <li><a href="#">{t.contactUs}</a></li>
                <li><a href="#">{t.privacyPolicy}</a></li>
                <li><a href="#">{t.termsOfService}</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{t.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

