import { useLanguage } from '../contexts/LanguageContext'
import { useEffect, useState } from 'react'

export const useTextToSpeech = () => {
  const { language } = useLanguage()
  const [voices, setVoices] = useState([])
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  const [useExternalAPI, setUseExternalAPI] = useState(false)

  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        try {
          const availableVoices = window.speechSynthesis.getVoices()
          setVoices(availableVoices)
          if (availableVoices.length > 0) {
            setVoicesLoaded(true)
            console.log('Voices loaded:', availableVoices.length, 'voices available')
            
            // For Arabic, use Web Speech API directly (no external API due to CORS issues)
            if (language === 'ar') {
              // Check if Arabic voice is available
              const hasArabic = availableVoices.some(voice => 
                voice && voice.lang && (
                  voice.lang.startsWith('ar') || 
                  (voice.name && voice.name.toLowerCase().includes('arabic'))
                )
              )
              
              // Use Web Speech API with Arabic lang code (works even without Arabic voice)
              setUseExternalAPI(false)
              if (!hasArabic) {
                console.log('⚠️ No Arabic voice found, will use Web Speech API with Arabic lang code')
                console.log('💡 The browser will attempt Arabic pronunciation')
              } else {
                console.log('✅ Arabic voice found, will use it')
              }
            } else {
              setUseExternalAPI(false)
            }
            
            // Log available voices
            const arabicVoices = availableVoices.filter(v => v.lang.startsWith('ar'))
            const frenchVoices = availableVoices.filter(v => v.lang.startsWith('fr'))
            console.log('Arabic voices:', arabicVoices.map(v => `${v.name} (${v.lang})`))
            console.log('French voices:', frenchVoices.map(v => `${v.name} (${v.lang})`))
          }
        } catch (error) {
          console.error('Error loading voices:', error)
        }
      }
    }

    loadVoices()
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices
      // Some browsers need this trigger
      window.speechSynthesis.getVoices()
    }
  }, [language])

  const speak = async (text) => {
    if (!text || text.trim().length === 0) {
      return
    }

    // Cancel any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    // For Arabic, use Web Speech API with Arabic language code
    // Even without Arabic voice, setting lang='ar-SA' helps
    if (language === 'ar') {
      console.log('🔊 Arabic detected - using Web Speech API with Arabic language code')
      
      // Check if Arabic voice is available first
      const availableVoices = window.speechSynthesis.getVoices()
      const hasArabicVoice = availableVoices.some(v => v.lang && v.lang.startsWith('ar'))
      
      if (!hasArabicVoice) {
        // Log warning but don't interrupt user - just try anyway
        console.info('ℹ️ No Arabic voice found. Attempting to read with Arabic language code.')
        console.info('💡 Tip: Install Arabic voices from Windows Settings for better quality.')
      }
      
      // Use Web Speech API directly with Arabic lang code
      const doSpeakArabic = () => {
        const utterance = new SpeechSynthesisUtterance(text.trim())
        utterance.lang = 'ar-SA' // Critical: Set Arabic language
        utterance.rate = 0.75 // Slower for better pronunciation
        utterance.pitch = 1
        utterance.volume = 1
        
        // Get available voices
        const voices = window.speechSynthesis.getVoices()
        
        // Try to find Arabic voice
        const arabicVoice = voices.find(v => v.lang && v.lang.startsWith('ar'))
        if (arabicVoice) {
          utterance.voice = arabicVoice
          console.log('✅ Using Arabic voice:', arabicVoice.name, arabicVoice.lang)
        } else {
          console.log('⚠️ No Arabic voice found, using default with Arabic lang code')
          console.log('💡 The browser will attempt Arabic pronunciation')
        }
        
        utterance.onend = () => {
          console.log('✅ Arabic speech completed')
        }
        
        utterance.onerror = (event) => {
          console.error('❌ Arabic speech error:', event.error)
          
          // Show helpful message based on error type (only once per session)
          if ((event.error === 'interrupted' || event.error === 'not-allowed') && !window.arabicTtsErrorShown) {
            window.arabicTtsErrorShown = true // Prevent multiple alerts
            
            // Show a less intrusive notification
            const errorMessage = language === 'ar' 
              ? '⚠️ لا يمكن قراءة النص بالعربية - لا توجد أصوات عربية مثبتة\n\n' +
                'للحل: افتح إعدادات Windows > الوقت واللغة > اللغة والمنطقة\n' +
                'أضف "العربية (السعودية)" وثبت "تحويل النص إلى كلام"'
              : '⚠️ Cannot read Arabic text - No Arabic voices installed\n\n' +
                'Solution: Open Windows Settings > Time & Language > Language & Region\n' +
                'Add "Arabic (Saudi Arabia)" and install "Text-to-speech"'
            
            // Use console instead of alert for less interruption
            console.error('❌', errorMessage)
            
            // Show a brief notification (optional - can be removed if too intrusive)
            // Uncomment the line below if you want a visual notification
            // alert(errorMessage)
          }
        }
        
        // Start speaking
        try {
          window.speechSynthesis.speak(utterance)
        } catch (error) {
          console.error('Failed to start speech:', error)
          alert(
            '❌ لا يمكن قراءة النص بالعربية\n\n' +
            '❌ Cannot read Arabic text\n\n' +
            'يرجى تثبيت أصوات عربية من إعدادات Windows\n' +
            'Please install Arabic voices from Windows Settings'
          )
        }
      }
      
      // Ensure voices are loaded
      if (availableVoices.length === 0) {
        const checkVoices = () => {
          const voices = window.speechSynthesis.getVoices()
          if (voices.length > 0) {
            doSpeakArabic()
          } else {
            setTimeout(checkVoices, 100)
          }
        }
        window.speechSynthesis.onvoiceschanged = checkVoices
        window.speechSynthesis.getVoices()
        setTimeout(checkVoices, 500)
      } else {
        doSpeakArabic()
      }
      
      return
    }

    // Use Web Speech API (for French or as fallback)
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech is not supported in this browser')
      alert('Text-to-speech is not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    // Function to actually speak with voice selection
    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text.trim())
      
      // Set language based on current language setting
      if (language === 'ar') {
        utterance.lang = 'ar-SA' // Saudi Arabic
      } else {
        utterance.lang = 'fr-FR' // French
      }
      
      // Set voice properties
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1

      // Get available voices
      const availableVoices = window.speechSynthesis.getVoices()
      
      let preferredVoice = null

      if (language === 'ar') {
        // Try multiple strategies to find Arabic voice
        preferredVoice = availableVoices.find(voice => voice.lang === 'ar-SA') ||
                        availableVoices.find(voice => 
                          voice.lang.startsWith('ar') && voice.lang.length <= 5
                        ) ||
                        availableVoices.find(voice => 
                          voice.name.toLowerCase().includes('arabic') ||
                          voice.name.toLowerCase().includes('عربي')
                        ) ||
                        availableVoices.find(voice => 
                          voice.lang.toLowerCase().includes('ar') && 
                          !voice.lang.toLowerCase().includes('en')
                        )
        
        if (preferredVoice) {
          console.log('✅ Found Arabic voice:', preferredVoice.name, 'lang:', preferredVoice.lang)
        } else {
          console.warn('⚠️ No Arabic voice found in Web Speech API')
        }
      } else {
        // French voice selection
        preferredVoice = availableVoices.find(voice => 
          voice.lang === 'fr-FR' || voice.lang === 'fr-CA' || voice.lang === 'fr'
        ) || availableVoices.find(voice => 
          voice.lang.startsWith('fr') || 
          voice.name.toLowerCase().includes('french') ||
          voice.name.toLowerCase().includes('français')
        )
      }

      if (preferredVoice) {
        utterance.voice = preferredVoice
        console.log('Using voice:', preferredVoice.name, 'with lang:', preferredVoice.lang)
      } else {
        console.warn('No matching voice found, using default')
      }

      // Add event listeners
      utterance.onend = () => {
        console.log('Speech ended')
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
      }

      // Speak with proper voice
      window.speechSynthesis.speak(utterance)
    }

    // Ensure voices are loaded before speaking
    const availableVoices = window.speechSynthesis.getVoices()
    if (availableVoices.length === 0) {
      // Voices not loaded yet, wait for them
      console.log('Waiting for voices to load...')
      const checkVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          console.log('Voices loaded, now speaking')
          doSpeak()
        } else {
          setTimeout(checkVoices, 100)
        }
      }
      window.speechSynthesis.onvoiceschanged = checkVoices
      window.speechSynthesis.getVoices()
      setTimeout(checkVoices, 500)
    } else {
      doSpeak()
    }
  }

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    // Stop any playing audio
    const audios = document.querySelectorAll('audio')
    audios.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  const speakSelectedText = () => {
    const selectedText = window.getSelection().toString().trim()
    if (selectedText) {
      speak(selectedText)
    }
  }

  return { speak, stop, speakSelectedText, voicesLoaded, useExternalAPI }
}
