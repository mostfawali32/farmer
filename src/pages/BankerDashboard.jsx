import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import LanguageSwitcher from '../components/LanguageSwitcher'
import './BankerDashboard.css'

// Mock data for farmers
const mockNormalBankFarmers = [
  {
    id: 1,
    name: 'محمد علي',
    cin: '12345678',
    landPapers: 'أوراق الأرض - سند الملكية',
    expertReport: 'تقرير الخبير - 150,000 دينار',
    landPriceEstimation: '150,000 دينار تونسي',
    proofOfExploitation: 'إثبات استغلال - 5 سنوات',
    status: 'pending'
  },
  {
    id: 2,
    name: 'فاطمة الزهراء',
    cin: '87654321',
    landPapers: 'أوراق الأرض - سند الملكية',
    expertReport: 'تقرير الخبير - 200,000 دينار',
    landPriceEstimation: '200,000 دينار تونسي',
    proofOfExploitation: 'إثبات استغلال - 8 سنوات',
    status: 'pending'
  },
  {
    id: 3,
    name: 'أحمد بن صالح',
    cin: '11223344',
    landPapers: 'أوراق الأرض - سند الملكية',
    expertReport: 'تقرير الخبير - 180,000 دينار',
    landPriceEstimation: '180,000 دينار تونسي',
    proofOfExploitation: 'إثبات استغلال - 6 سنوات',
    status: 'approved'
  }
]

const mockIslamicBankFarmers = [
  {
    id: 1,
    name: 'خالد محمود',
    cin: '55667788',
    equipmentDemands: ['جرار زراعي', 'مضخة مياه', 'أدوات الري'],
    landInformation: '10 هكتار - منطقة سيدي بوزيد',
    status: 'pending'
  },
  {
    id: 2,
    name: 'سارة أحمد',
    cin: '99887766',
    equipmentDemands: ['حاصد', 'معدات التسميد', 'مضخة مياه'],
    landInformation: '15 هكتار - منطقة القيروان',
    status: 'pending'
  },
  {
    id: 3,
    name: 'يوسف العلي',
    cin: '44332211',
    equipmentDemands: ['جرار زراعي', 'معدات الحصاد'],
    landInformation: '8 هكتار - منطقة باجة',
    status: 'approved'
  }
]

function BankerDashboard() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = translations[language]
  const bankType = searchParams.get('type') || 'normal'
  
  const [farmers, setFarmers] = useState([])
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('bankerAuth')
    if (!auth) {
      navigate(`/banker/login?type=${bankType}`)
      return
    }
    
    try {
      const authData = JSON.parse(auth)
      setUserInfo(authData)
      
      // Load farmers based on bank type
      if (bankType === 'normal') {
        setFarmers(mockNormalBankFarmers)
      } else {
        setFarmers(mockIslamicBankFarmers)
      }
    } catch (error) {
      navigate(`/banker/login?type=${bankType}`)
    }
  }, [navigate, bankType])

  const handleLogout = () => {
    localStorage.removeItem('bankerAuth')
    navigate('/banker')
  }

  if (!userInfo) {
    return null // Will redirect
  }

  const handleApprove = (id) => {
    setFarmers(farmers.map(f => f.id === id ? { ...f, status: 'approved' } : f))
  }

  const handleReject = (id) => {
    setFarmers(farmers.map(f => f.id === id ? { ...f, status: 'rejected' } : f))
  }

  const getStatusClass = (status) => {
    switch(status) {
      case 'approved': return 'status-approved'
      case 'rejected': return 'status-rejected'
      default: return 'status-pending'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return t.approved
      case 'rejected': return t.rejected
      default: return t.pending
    }
  }

  return (
    <div className="banker-dashboard">
      <LanguageSwitcher />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-left">
            <span className="leaf-icon">🌱</span>
            <div>
              <h1>{t.bankerDashboard}</h1>
              <p className="user-email">{userInfo.email}</p>
            </div>
            <span className="bank-type-badge">
              {bankType === 'normal' ? t.normalBank : t.islamicBank}
            </span>
          </div>
          <div className="header-actions">
            <button 
              className="btn-logout"
              onClick={handleLogout}
            >
              {language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
            </button>
            <button 
              className="btn-back-to-selection"
              onClick={() => navigate('/banker')}
            >
              {t.backToBankSelection}
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          <h2 className="section-title">{t.farmersFolders}</h2>
          
          {farmers.length === 0 ? (
            <div className="no-applications">
              <p>{t.noApplications}</p>
            </div>
          ) : (
            <div className="farmers-grid">
              {farmers.map((farmer) => (
                <div key={farmer.id} className="farmer-folder-card">
                  <div className="folder-header">
                    <h3>{t.farmerFolder} #{farmer.id}</h3>
                    <span className={`status-badge ${getStatusClass(farmer.status)}`}>
                      {getStatusText(farmer.status)}
                    </span>
                  </div>

                  <div className="folder-content">
                    <div className="info-section">
                      <h4>{t.personalInformation}</h4>
                      <div className="info-item">
                        <span className="info-label">{t.name}:</span>
                        <span className="info-value">{farmer.name}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">{t.cin}:</span>
                        <span className="info-value">{farmer.cin}</span>
                      </div>
                    </div>

                    {bankType === 'normal' ? (
                      <>
                        <div className="info-section">
                          <h4>{t.landPapers}</h4>
                          <p className="info-text">{farmer.landPapers}</p>
                        </div>
                        <div className="info-section">
                          <h4>{t.expertReport}</h4>
                          <p className="info-text">{farmer.expertReport}</p>
                        </div>
                        <div className="info-section">
                          <h4>{t.landPriceEstimation}</h4>
                          <p className="info-value highlight">{farmer.landPriceEstimation}</p>
                        </div>
                        <div className="info-section">
                          <h4>{t.proofOfExploitation}</h4>
                          <p className="info-text">{farmer.proofOfExploitation}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="info-section">
                          <h4>{t.equipmentDemands}</h4>
                          <ul className="equipment-list">
                            {farmer.equipmentDemands.map((equipment, idx) => (
                              <li key={idx}>{equipment}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="info-section">
                          <h4>{t.landInformation}</h4>
                          <p className="info-text">{farmer.landInformation}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {farmer.status === 'pending' && (
                    <div className="folder-actions">
                      <button 
                        className="btn-approve"
                        onClick={() => handleApprove(farmer.id)}
                      >
                        {t.approve}
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => handleReject(farmer.id)}
                      >
                        {t.reject}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BankerDashboard

