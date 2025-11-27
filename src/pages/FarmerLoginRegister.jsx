import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import LanguageSwitcher from '../components/LanguageSwitcher'
import './LoginRegister.css'

function FarmerLoginRegister() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = translations[language]
  const solution = searchParams.get('solution') || '1'
  
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = t.emailRequired
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'E-mail invalide'
    }
    
    if (!formData.password) {
      newErrors.password = t.passwordRequired
    } else if (formData.password.length < 6) {
      newErrors.password = language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      
      // For demo purposes, accept any email/password
      if (isLogin) {
        // Login
        localStorage.setItem('farmerAuth', JSON.stringify({
          email: formData.email,
          solution: solution,
          type: 'farmer'
        }))
        navigate(`/farmer/dashboard?solution=${solution}`)
      } else {
        // Register
        localStorage.setItem('farmerAuth', JSON.stringify({
          email: formData.email,
          solution: solution,
          type: 'farmer'
        }))
        navigate(`/farmer/dashboard?solution=${solution}`)
      }
    }, 1000)
  }

  return (
    <div className="login-register-page">
      <LanguageSwitcher />
      <div className="login-register-container">
        <div className="login-register-card">
          <div className="auth-header">
            <span className="leaf-icon">🌱</span>
            <h1>{isLogin ? t.loginTitle : t.registerTitle}</h1>
            <p className="auth-subtitle">
              {solution === '1' ? t.solution1 : t.solution2}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">{t.email}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder={t.email}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">{t.password}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder={t.password}
                required
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">{t.confirmPassword}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder={t.confirmPassword}
                  required
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>{t.rememberMe}</span>
                </label>
                <a href="#" className="forgot-password">{t.forgotPassword}</a>
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (language === 'ar' ? 'جاري المعالجة...' : 'Traitement...') : (isLogin ? t.loginButton : t.registerButton)}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              {isLogin ? t.dontHaveAccount : t.alreadyHaveAccount}
              <button 
                type="button" 
                className="switch-link"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setErrors({})
                  setFormData({ email: '', password: '', confirmPassword: '' })
                }}
              >
                {isLogin ? t.switchToRegister : t.switchToLogin}
              </button>
            </p>
          </div>

          <div className="auth-footer">
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

export default FarmerLoginRegister

