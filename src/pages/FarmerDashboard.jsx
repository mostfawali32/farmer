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
  const [uploadedFiles, setUploadedFiles] = useState({
    cin: [],
    landPapers: [],
    proofOfExploitation: [],
    expertReport: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [farmerInfo, setFarmerInfo] = useState({
    name: '',
    cin: ''
  })
  const [applicationStatus, setApplicationStatus] = useState(null)

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

  useEffect(() => {
    // Load uploaded files and farmer info from localStorage after userInfo is set
    if (userInfo?.email) {
      const savedFiles = localStorage.getItem(`farmerFiles_${userInfo.email}_${solution}`)
      if (savedFiles) {
        try {
          setUploadedFiles(JSON.parse(savedFiles))
        } catch (error) {
          console.error('Error loading saved files:', error)
        }
      }

      // Load farmer info
      const savedInfo = localStorage.getItem(`farmerInfo_${userInfo.email}`)
      if (savedInfo) {
        try {
          setFarmerInfo(JSON.parse(savedInfo))
        } catch (error) {
          console.error('Error loading farmer info:', error)
        }
      }

      // Load application status
      const allApplications = JSON.parse(localStorage.getItem('farmerApplications') || '[]')
      const userApplication = allApplications.find(app => 
        app.farmerEmail === userInfo.email && app.solution === solution
      )
      if (userApplication) {
        setApplicationStatus(userApplication.status)
      }
    }
  }, [userInfo, solution])

  const handleLogout = () => {
    localStorage.removeItem('farmerAuth')
    navigate('/farmer')
  }

  const handleFileUpload = (fileType, files) => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    
    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSize) {
        alert(language === 'ar' ? 'حجم الملف كبير جداً (الحد الأقصى: 10 ميجابايت)' : 'Fichier trop volumineux (max: 10 Mo)')
        return false
      }
      if (!allowedTypes.includes(file.type)) {
        alert(language === 'ar' ? 'نوع الملف غير مدعوم (PDF, JPG, PNG فقط)' : 'Type de fichier non supporté (PDF, JPG, PNG uniquement)')
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      const newFiles = validFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        uploadDate: new Date().toISOString()
      }))

      setUploadedFiles(prev => {
        const updated = {
          ...prev,
          [fileType]: [...prev[fileType], ...newFiles]
        }
        // Save to localStorage
        if (userInfo?.email) {
          localStorage.setItem(`farmerFiles_${userInfo.email}_${solution}`, JSON.stringify(updated))
        }
        return updated
      })
    }
  }

  const handleDeleteFile = (fileType, fileId) => {
    setUploadedFiles(prev => {
      const updated = {
        ...prev,
        [fileType]: prev[fileType].filter(file => file.id !== fileId)
      }
      // Save to localStorage
      if (userInfo?.email) {
        localStorage.setItem(`farmerFiles_${userInfo.email}_${solution}`, JSON.stringify(updated))
      }
      return updated
    })
  }

  const handleSubmitDocuments = async () => {
    // Validate required fields
    if (!farmerInfo.name || !farmerInfo.cin) {
      alert(language === 'ar' 
        ? 'يرجى إدخال الاسم ورقم بطاقة التعريف الوطنية' 
        : 'Veuillez entrer le nom et le numéro CIN')
      return
    }

    // Validate required files
    if (uploadedFiles.cin.length === 0 || uploadedFiles.landPapers.length === 0 || uploadedFiles.proofOfExploitation.length === 0) {
      alert(language === 'ar' 
        ? 'يرجى رفع جميع الوثائق المطلوبة (CIN، أوراق الأرض، إثبات الاستغلال)' 
        : 'Veuillez télécharger tous les documents requis (CIN, papiers de terrain, preuve d\'exploitation)')
      return
    }

    setIsSubmitting(true)
    
    // Create application object
    const application = {
      id: Date.now(),
      farmerEmail: userInfo.email,
      farmerName: farmerInfo.name,
      cin: farmerInfo.cin,
      solution: solution,
      files: {
        cin: uploadedFiles.cin.map(f => ({ name: f.name, size: f.size, type: f.type })),
        landPapers: uploadedFiles.landPapers.map(f => ({ name: f.name, size: f.size, type: f.type })),
        proofOfExploitation: uploadedFiles.proofOfExploitation.map(f => ({ name: f.name, size: f.size, type: f.type })),
        expertReport: uploadedFiles.expertReport.map(f => ({ name: f.name, size: f.size, type: f.type }))
      },
      status: 'pending',
      submittedAt: new Date().toISOString(),
      bankType: solution === '1' ? 'normal' : 'islamic'
    }

    // Save application to shared storage
    const allApplications = JSON.parse(localStorage.getItem('farmerApplications') || '[]')
    // Remove existing application for this farmer and solution
    const filteredApplications = allApplications.filter(app => 
      !(app.farmerEmail === userInfo.email && app.solution === solution)
    )
    filteredApplications.push(application)
    localStorage.setItem('farmerApplications', JSON.stringify(filteredApplications))

    // Save farmer info
    localStorage.setItem(`farmerInfo_${userInfo.email}`, JSON.stringify(farmerInfo))

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setApplicationStatus('pending')
      alert(language === 'ar' ? t.documentsSubmitted : t.documentsSubmitted)
    }, 1500)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
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
              {/* Personal Information Form */}
              <div className="info-card">
                <h3>{language === 'ar' ? 'المعلومات الشخصية' : 'Informations personnelles'}</h3>
                <div className="form-group">
                  <label>{t.name}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={farmerInfo.name}
                    onChange={(e) => setFarmerInfo({ ...farmerInfo, name: e.target.value })}
                    placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Entrez votre nom complet'}
                  />
                </div>
                <div className="form-group">
                  <label>{t.cin}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={farmerInfo.cin}
                    onChange={(e) => setFarmerInfo({ ...farmerInfo, cin: e.target.value })}
                    placeholder={language === 'ar' ? 'أدخل رقم بطاقة التعريف الوطنية' : 'Entrez votre numéro CIN'}
                  />
                </div>
              </div>

              {/* Application Status */}
              {applicationStatus && (
                <div className="info-card status-card">
                  <h3>{language === 'ar' ? 'حالة الطلب' : 'Statut de la demande'}</h3>
                  <div className={`status-display ${applicationStatus}`}>
                    <span className="status-icon">
                      {applicationStatus === 'approved' ? '✅' : applicationStatus === 'rejected' ? '❌' : '⏳'}
                    </span>
                    <span className="status-text">
                      {applicationStatus === 'approved' 
                        ? (language === 'ar' ? 'تم الموافقة على طلبك' : 'Votre demande a été approuvée')
                        : applicationStatus === 'rejected'
                        ? (language === 'ar' ? 'تم رفض طلبك' : 'Votre demande a été rejetée')
                        : (language === 'ar' ? 'طلبك قيد المراجعة' : 'Votre demande est en cours d\'examen')
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* File Upload Section */}
              <div className="info-card upload-section">
                <h3>{t.uploadDocuments}</h3>
                <p className="upload-description">{t.uploadDocumentsDescription}</p>
                
                <div className="upload-grid">
                  {/* CIN Upload */}
                  <div className="upload-item">
                    <label className="upload-label">{t.cinDocument}</label>
                    <div 
                      className="upload-zone"
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over') }}
                      onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over') }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('drag-over')
                        handleFileUpload('cin', e.dataTransfer.files)
                      }}
                      onClick={() => document.getElementById('cin-upload').click()}
                    >
                      <input
                        id="cin-upload"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload('cin', e.target.files)}
                      />
                      <div className="upload-icon">📄</div>
                      <p className="upload-text">{t.dragDropFiles}</p>
                      <p className="upload-hint">{t.maxFileSize} • {t.supportedFormats}</p>
                    </div>
                    {uploadedFiles.cin.length > 0 && (
                      <div className="uploaded-files-list">
                        {uploadedFiles.cin.map(file => (
                          <div key={file.id} className="uploaded-file-item">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{formatFileSize(file.size)}</span>
                            <button 
                              className="btn-delete-file"
                              onClick={() => handleDeleteFile('cin', file.id)}
                            >
                              {t.deleteFile}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Land Papers Upload */}
                  <div className="upload-item">
                    <label className="upload-label">{t.landPapersDocument}</label>
                    <div 
                      className="upload-zone"
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over') }}
                      onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over') }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('drag-over')
                        handleFileUpload('landPapers', e.dataTransfer.files)
                      }}
                      onClick={() => document.getElementById('landPapers-upload').click()}
                    >
                      <input
                        id="landPapers-upload"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload('landPapers', e.target.files)}
                      />
                      <div className="upload-icon">📋</div>
                      <p className="upload-text">{t.dragDropFiles}</p>
                      <p className="upload-hint">{t.maxFileSize} • {t.supportedFormats}</p>
                    </div>
                    {uploadedFiles.landPapers.length > 0 && (
                      <div className="uploaded-files-list">
                        {uploadedFiles.landPapers.map(file => (
                          <div key={file.id} className="uploaded-file-item">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{formatFileSize(file.size)}</span>
                            <button 
                              className="btn-delete-file"
                              onClick={() => handleDeleteFile('landPapers', file.id)}
                            >
                              {t.deleteFile}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Proof of Exploitation Upload */}
                  <div className="upload-item">
                    <label className="upload-label">{t.proofOfExploitationDocument}</label>
                    <div 
                      className="upload-zone"
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over') }}
                      onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over') }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('drag-over')
                        handleFileUpload('proofOfExploitation', e.dataTransfer.files)
                      }}
                      onClick={() => document.getElementById('proofOfExploitation-upload').click()}
                    >
                      <input
                        id="proofOfExploitation-upload"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload('proofOfExploitation', e.target.files)}
                      />
                      <div className="upload-icon">📑</div>
                      <p className="upload-text">{t.dragDropFiles}</p>
                      <p className="upload-hint">{t.maxFileSize} • {t.supportedFormats}</p>
                    </div>
                    {uploadedFiles.proofOfExploitation.length > 0 && (
                      <div className="uploaded-files-list">
                        {uploadedFiles.proofOfExploitation.map(file => (
                          <div key={file.id} className="uploaded-file-item">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{formatFileSize(file.size)}</span>
                            <button 
                              className="btn-delete-file"
                              onClick={() => handleDeleteFile('proofOfExploitation', file.id)}
                            >
                              {t.deleteFile}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expert Report Upload */}
                  <div className="upload-item">
                    <label className="upload-label">{t.expertReportDocument}</label>
                    <div 
                      className="upload-zone"
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over') }}
                      onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over') }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('drag-over')
                        handleFileUpload('expertReport', e.dataTransfer.files)
                      }}
                      onClick={() => document.getElementById('expertReport-upload').click()}
                    >
                      <input
                        id="expertReport-upload"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload('expertReport', e.target.files)}
                      />
                      <div className="upload-icon">📊</div>
                      <p className="upload-text">{t.dragDropFiles}</p>
                      <p className="upload-hint">{t.maxFileSize} • {t.supportedFormats}</p>
                    </div>
                    {uploadedFiles.expertReport.length > 0 && (
                      <div className="uploaded-files-list">
                        {uploadedFiles.expertReport.map(file => (
                          <div key={file.id} className="uploaded-file-item">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{formatFileSize(file.size)}</span>
                            <button 
                              className="btn-delete-file"
                              onClick={() => handleDeleteFile('expertReport', file.id)}
                            >
                              {t.deleteFile}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  className="btn-submit-documents"
                  onClick={handleSubmitDocuments}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.submitting : t.submitDocuments}
                </button>
              </div>

              {/* Steps Section */}
              <div className="info-card">
                <h3>{t.solution1Title}</h3>
                <div className="steps-container">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>{language === 'ar' ? 'جمع الوثائق' : 'Collecte des documents'}</h4>
                      <p>{language === 'ar' ? 'قم بجمع جميع الوثائق المطلوبة' : 'Rassemblez tous les documents requis'}</p>
                      <span className={`step-status ${uploadedFiles.cin.length > 0 && uploadedFiles.landPapers.length > 0 && uploadedFiles.proofOfExploitation.length > 0 ? 'completed' : 'pending'}`}>
                        {uploadedFiles.cin.length > 0 && uploadedFiles.landPapers.length > 0 && uploadedFiles.proofOfExploitation.length > 0 
                          ? (language === 'ar' ? 'مكتمل' : 'Terminé')
                          : (language === 'ar' ? 'قيد الانتظار' : 'En attente')
                        }
                      </span>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>{language === 'ar' ? 'تقرير الخبير' : 'Rapport d\'expert'}</h4>
                      <p>{language === 'ar' ? 'انتظار تقرير الخبير لتقدير سعر الأرض' : 'En attente du rapport d\'expert pour l\'estimation du terrain'}</p>
                      <span className={`step-status ${uploadedFiles.expertReport.length > 0 ? 'completed' : 'pending'}`}>
                        {uploadedFiles.expertReport.length > 0 
                          ? (language === 'ar' ? 'مكتمل' : 'Terminé')
                          : (language === 'ar' ? 'قيد الانتظار' : 'En attente')
                        }
                      </span>
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

