import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import LanguageSwitcher from '../components/LanguageSwitcher'
import ReadAllButton from '../components/ReadAllButton'
import './FarmerDashboard.css'

function FarmerDashboard() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = translations[language]
  const solution = searchParams.get('solution') || '1'
  
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('farmerAuth')
    if (!auth) {
      navigate(`/farmer/login?solution=${solution}`)
      return
    }
    
    try {
      const authData = JSON.parse(auth)
      setUserInfo(authData)
    } catch (error) {
      navigate(`/farmer/login?solution=${solution}`)
    }
  }, [navigate, solution])

  const handleLogout = () => {
    localStorage.removeItem('farmerAuth')
    navigate('/farmer')
  }

  if (!userInfo) {
    return null // Will redirect
  }

  return (
    <div className="farmer-dashboard">
      <LanguageSwitcher />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-left">
            <span className="leaf-icon">🌱</span>
            <div>
              <h1>{t.farmerDashboardTitle}</h1>
              <p className="user-email">{userInfo.email}</p>
            </div>
            <span className="solution-badge">
              {solution === '1' ? t.solution1 : t.solution2}
            </span>
          </div>
          <button 
            className="btn-logout"
            onClick={handleLogout}
          >
            {language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
          </button>
        </div>

        <div className="dashboard-content">
          <ReadAllButton targetSelector=".dashboard-content" />
          
          <div className="welcome-section">
            <h2>{t.welcomeBack}, {userInfo.email}</h2>
            <p className="welcome-message">
              {solution === '1' 
                ? (language === 'ar' 
                  ? 'يمكنك الآن متابعة عملية تنظيم أوراق أرضك والحصول على قرض من البنك'
                  : 'Vous pouvez maintenant suivre le processus de régularisation de vos papiers de terrain et obtenir un prêt bancaire')
                : (language === 'ar'
                  ? 'يمكنك الآن متابعة طلب المعدات من البنك الإسلامي'
                  : 'Vous pouvez maintenant suivre votre demande d\'équipements auprès de la banque islamique')
              }
            </p>
          </div>

          {solution === '1' ? (
            <div className="solution-content">
              <div className="info-card">
                <h3>{t.solution1Title}</h3>
                <div className="steps-container">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>{language === 'ar' ? 'جمع الوثائق' : 'Collecte des documents'}</h4>
                      <p>{language === 'ar' ? 'قم بجمع جميع الوثائق المطلوبة' : 'Rassemblez tous les documents requis'}</p>
                      <span className="step-status pending">{language === 'ar' ? 'قيد الانتظار' : 'En attente'}</span>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>{language === 'ar' ? 'تقرير الخبير' : 'Rapport d\'expert'}</h4>
                      <p>{language === 'ar' ? 'انتظار تقرير الخبير لتقدير سعر الأرض' : 'En attente du rapport d\'expert pour l\'estimation du terrain'}</p>
                      <span className="step-status pending">{language === 'ar' ? 'قيد الانتظار' : 'En attente'}</span>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>{language === 'ar' ? 'مراجعة البنك' : 'Révision bancaire'}</h4>
                      <p>{language === 'ar' ? 'مراجعة طلبك من قبل البنك' : 'Révision de votre demande par la banque'}</p>
                      <span className="step-status pending">{language === 'ar' ? 'قيد الانتظار' : 'En attente'}</span>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>{language === 'ar' ? 'الموافقة والقرض' : 'Approbation et prêt'}</h4>
                      <p>{language === 'ar' ? 'الحصول على الموافقة والقرض' : 'Obtenir l\'approbation et le prêt'}</p>
                      <span className="step-status pending">{language === 'ar' ? 'قيد الانتظار' : 'En attente'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="solution-content">
              <div className="info-card">
                <h3>{t.solution2Title}</h3>
                <div className="equipment-request">
                  <h4>{language === 'ar' ? 'طلب المعدات' : 'Demande d\'équipements'}</h4>
                  <div className="request-form">
                    <div className="form-group">
                      <label>{language === 'ar' ? 'نوع المعدات المطلوبة' : 'Type d\'équipement requis'}</label>
                      <select className="form-select">
                        <option>{language === 'ar' ? 'اختر المعدات' : 'Sélectionner l\'équipement'}</option>
                        <option>{language === 'ar' ? 'جرار زراعي' : 'Tracteur'}</option>
                        <option>{language === 'ar' ? 'مضخة مياه' : 'Pompe à eau'}</option>
                        <option>{language === 'ar' ? 'معدات الري' : 'Équipement d\'irrigation'}</option>
                        <option>{language === 'ar' ? 'حاصد' : 'Moissonneuse'}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>{language === 'ar' ? 'معلومات إضافية' : 'Informations supplémentaires'}</label>
                      <textarea 
                        className="form-textarea"
                        placeholder={language === 'ar' ? 'أدخل تفاصيل إضافية عن طلبك...' : 'Entrez des détails supplémentaires sur votre demande...'}
                      />
                    </div>
                    <button className="btn-submit-request">
                      {language === 'ar' ? 'إرسال الطلب' : 'Envoyer la demande'}
                    </button>
                  </div>
                </div>
                <div className="request-status">
                  <h4>{language === 'ar' ? 'حالة الطلبات السابقة' : 'Statut des demandes précédentes'}</h4>
                  <div className="status-item">
                    <span className="status-label">{language === 'ar' ? 'لا توجد طلبات حالياً' : 'Aucune demande pour le moment'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="back-button-container">
            <button 
              className="btn-back"
              onClick={() => navigate('/farmer')}
            >
              ← {t.backToHome}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FarmerDashboard

