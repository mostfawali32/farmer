import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTextToSpeech } from '../hooks/useTextToSpeech'
import { translations } from '../translations/translations'
import './ReadAllButton.css'

function ReadAllButton({ targetSelector, className = '' }) {
  const { language } = useLanguage()
  const { stop, useExternalAPI } = useTextToSpeech()
  const [isReading, setIsReading] = useState(false)
  const t = translations[language]
  
  useEffect(() => {
    // Monitor speech state
    const checkSpeech = () => {
      if ('speechSynthesis' in window) {
        if (!window.speechSynthesis.speaking && isReading) {
          setIsReading(false)
        }
      }
    }
    
    const interval = setInterval(checkSpeech, 100)
    return () => clearInterval(interval)
  }, [isReading])

  const handleReadAll = () => {
    if (isReading) {
      stop()
      setIsReading(false)
      return
    }

    // Get all text from the target element
    const element = document.querySelector(targetSelector)
    if (!element) return

    // Clone element to avoid modifying the original
    const clone = element.cloneNode(true)
    
    // Remove buttons and navigation elements
    const buttons = clone.querySelectorAll('button, .read-all-button, .btn-read, nav, .nav')
    buttons.forEach(btn => btn.remove())
    
    // Get all text content
    const textContent = clone.innerText || clone.textContent || ''
    
    // Clean up the text (remove extra whitespace)
    const cleanText = textContent
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim()

    if (cleanText) {
      setIsReading(true)
      
      // For Arabic, use Web Speech API with Arabic language code
      // This works even without Arabic voice installed
      if (language === 'ar') {
        console.log('🔊 Arabic detected - using Web Speech API with Arabic language code')
        useWebSpeechAPI(cleanText, true) // Pass true to indicate Arabic
      } else {
        // Use Web Speech API for French
        useWebSpeechAPI(cleanText, false)
      }
    }
    
    function useWebSpeechAPI(textToSpeak, isArabic = false) {
      if (!('speechSynthesis' in window)) {
        alert(language === 'ar' 
          ? 'ميزة القراءة الصوتية غير متاحة في هذا المتصفح'
          : 'La lecture vocale n\'est pas disponible dans ce navigateur')
        setIsReading(false)
        return
      }
      
      const doSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        
        if (isArabic || language === 'ar') {
          // For Arabic: Use Arabic language code - this helps even without Arabic voice
          utterance.lang = 'ar-SA'
          utterance.rate = 0.75 // Slower for better Arabic pronunciation
        } else {
          utterance.lang = 'fr-FR'
          utterance.rate = 0.8
        }
        
        utterance.pitch = 1
        utterance.volume = 1
        
        const voices = window.speechSynthesis.getVoices()
        let selectedVoice = null
        
        if (isArabic || language === 'ar') {
          // Try to find Arabic voice
          selectedVoice = voices.find(v => v.lang === 'ar-SA') ||
                         voices.find(v => v.lang.startsWith('ar') && v.lang.length <= 5) ||
                         voices.find(v => v.name && (
                           v.name.toLowerCase().includes('arabic') || 
                           v.name.toLowerCase().includes('عربي')
                         )) ||
                         voices.find(v => v.lang && v.lang.toLowerCase().includes('ar'))
          
          if (selectedVoice) {
            utterance.voice = selectedVoice
            console.log('✅ Using Arabic voice:', selectedVoice.name)
          } else {
            console.log('⚠️ No Arabic voice found, using default voice with Arabic lang code')
            console.log('💡 The browser will attempt Arabic pronunciation with lang="ar-SA"')
          }
        } else {
          // French voice selection
          selectedVoice = voices.find(v => 
            v.lang === 'fr-FR' || v.lang === 'fr-CA' || v.lang === 'fr' ||
            (v.lang && v.lang.startsWith('fr')) || 
            (v.name && (
              v.name.toLowerCase().includes('french') ||
              v.name.toLowerCase().includes('français')
            ))
          )
          
          if (selectedVoice) {
            utterance.voice = selectedVoice
          }
        }
        
        utterance.onend = () => {
          console.log('✅ Speech completed')
          setIsReading(false)
        }
        
        utterance.onerror = (e) => {
          console.error('Speech error:', e.error, e)
          
          // If interrupted or not-supported for Arabic, show helpful message (only once)
          if ((isArabic || language === 'ar') && (e.error === 'interrupted' || e.error === 'not-allowed')) {
            if (!window.arabicTtsErrorShown) {
              window.arabicTtsErrorShown = true
              console.error('❌ Arabic speech failed - No Arabic voices installed')
              console.info('💡 Solution: Install Arabic voices from Windows Settings')
              console.info('   Settings > Time & Language > Language & Region')
              console.info('   Add "Arabic (Saudi Arabia)" and install "Text-to-speech"')
              
              // Optional: Show a non-blocking notification instead of alert
              // You can uncomment this if you want a visual notification
              // setTimeout(() => {
              //   alert(language === 'ar' 
              //     ? 'لا يمكن قراءة النص بالعربية. يرجى تثبيت أصوات عربية من إعدادات Windows.'
              //     : 'Cannot read Arabic text. Please install Arabic voices from Windows Settings.')
              // }, 100)
            }
          }
          
          setIsReading(false)
        }
        
        console.log('🔊 Starting speech with lang:', utterance.lang)
        try {
          window.speechSynthesis.speak(utterance)
        } catch (error) {
          console.error('Failed to start speech:', error)
          setIsReading(false)
          if (isArabic || language === 'ar') {
            alert(
              language === 'ar'
                ? 'لا يمكن قراءة النص بالعربية. يرجى تثبيt أصوات عربية.\n\nCannot read Arabic text. Please install Arabic voices.'
                : 'Cannot read Arabic text. Please install Arabic voices.'
            )
          }
        }
      }
      
      const voices = window.speechSynthesis.getVoices()
      if (voices.length === 0) {
        console.log('Waiting for voices to load...')
        window.speechSynthesis.onvoiceschanged = () => {
          doSpeak()
        }
        window.speechSynthesis.getVoices()
        setTimeout(() => doSpeak(), 500)
      } else {
        doSpeak()
      }
    }
  }

  return (
    <button 
      className={`read-all-button ${className} ${isReading ? 'reading' : ''}`}
      onClick={handleReadAll}
      title={language === 'ar' ? 'قراءة كل النص' : 'Lire tout le texte'}
      aria-label={language === 'ar' ? 'قراءة كل النص' : 'Lire tout le texte'}
    >
      {isReading ? (
        <>
          <span className="read-icon">⏸️</span>
          <span className="read-text">{language === 'ar' ? 'إيقاف' : 'Arrêter'}</span>
        </>
      ) : (
        <>
          <span className="read-icon">🔊</span>
          <span className="read-text">{language === 'ar' ? 'قراءة كل النص' : 'Lire tout'}</span>
        </>
      )}
    </button>
  )
}

export default ReadAllButton

