import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import LanguageSwitcher from '../components/LanguageSwitcher'
import './BankerLoginPage.css'

function BankerLoginPage() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="banker-login-page">
      <LanguageSwitcher />
      <div className="banker-login-container">
        <div className="banker-login-content">
          <div className="banker-header">
            <span className="leaf-icon">🌱</span>
            <h1>{t.bankerLoginTitle}</h1>
            <p>{t.selectBankType}</p>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link to="banker/login?type=normal" className="btn-start">
                {t.startNow}
              </Link>
            </div>
          </div>

          <div className="bank-selection">
            <Link to="banker/login?type=normal" className="bank-card-link">
              <div className="bank-card">
                <div className="bank-icon">🏦</div>
                <h2>{t.normalBank}</h2>
                <p>{t.continueAsNormalBanker}</p>
                <div className="btn-bank-select">
                  {t.continueAsNormalBanker}
                </div>
              </div>
            </Link>

            <Link to="banker/login?type=islamic" className="bank-card-link">
              <div className="bank-card">
                <div className="bank-icon">🕌</div>
                <h2>{t.islamicBank}</h2>
                <p>{t.continueAsIslamicBanker}</p>
                <div className="btn-bank-select">
                  {t.continueAsIslamicBanker}
                </div>
              </div>
            </Link>
          </div>

          <div className="back-to-home">
            <Link to="/" className="btn-back">{t.backToHome}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BankerLoginPage

