import { useEffect, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTextToSpeech } from '../hooks/useTextToSpeech'
import { translations } from '../translations/translations'
import './TextToSpeechHandler.css'

function TextToSpeechHandler() {
  const { language } = useLanguage()
  const { speakSelectedText, stop } = useTextToSpeech()
  const [isReading, setIsReading] = useState(false)
  const [showInstruction, setShowInstruction] = useState(true)
  const t = translations[language]

  useEffect(() => {
    const handleDoubleClick = (e) => {
      // On double click, read the selected text
      const selectedText = window.getSelection().toString().trim()
      if (selectedText) {
        setIsReading(true)
        speakSelectedText()
        
        // Reset reading state after a delay
        setTimeout(() => {
          setIsReading(false)
        }, selectedText.length * 50) // Rough estimate
      }
    }

    const handleKeyPress = (e) => {
      // Press Ctrl/Cmd + Space to read selected text
      if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
        e.preventDefault()
        const selectedText = window.getSelection().toString().trim()
        if (selectedText) {
          setIsReading(true)
          speakSelectedText()
          setTimeout(() => {
            setIsReading(false)
          }, selectedText.length * 50)
        }
      }
    }

    // Monitor speech synthesis state
    const checkSpeechState = () => {
      if ('speechSynthesis' in window) {
        if (!window.speechSynthesis.speaking) {
          setIsReading(false)
        }
      }
    }

    // Add event listeners
    document.addEventListener('dblclick', handleDoubleClick)
    document.addEventListener('keydown', handleKeyPress)
    
    // Check speech state periodically
    const speechInterval = setInterval(checkSpeechState, 100)

    // Load voices when available
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices()
      }
    }

    // Some browsers load voices asynchronously
    if ('speechSynthesis' in window) {
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    // Hide instruction after 10 seconds
    const instructionTimer = setTimeout(() => {
      setShowInstruction(false)
    }, 10000)

    return () => {
      document.removeEventListener('dblclick', handleDoubleClick)
      document.removeEventListener('keydown', handleKeyPress)
      clearInterval(speechInterval)
      clearTimeout(instructionTimer)
    }
  }, [speakSelectedText, language])

  const handleReadButton = () => {
    const selectedText = window.getSelection().toString().trim()
    if (selectedText) {
      if (isReading) {
        stop()
        setIsReading(false)
      } else {
        setIsReading(true)
        speakSelectedText()
        
        // Reset reading state when speech ends
        setTimeout(() => {
          setIsReading(false)
        }, selectedText.length * 80) // Rough estimate based on text length
      }
    }
  }

  // Check if text is selected
  const [hasSelection, setHasSelection] = useState(false)

  useEffect(() => {
    const checkSelection = () => {
      const selection = window.getSelection().toString().trim()
      setHasSelection(selection.length > 0)
    }

    document.addEventListener('mouseup', checkSelection)
    document.addEventListener('keyup', checkSelection)
    document.addEventListener('selectionchange', checkSelection)

    return () => {
      document.removeEventListener('mouseup', checkSelection)
      document.removeEventListener('keyup', checkSelection)
      document.removeEventListener('selectionchange', checkSelection)
    }
  }, [])

  return (
    <>
      {showInstruction && (
        <div className="tts-helper">
          <div className="tts-instruction">
            <span className="tts-icon">🔊</span>
            <span className="tts-text">
              {language === 'ar'
                ? 'انقر نقراً مزدوجاً على النص أو اضغط Ctrl+Space لقراءته بصوت عالٍ'
                : 'Double-cliquez sur le texte ou appuyez sur Ctrl+Space pour le lire à voix haute'}
            </span>
            <button 
              className="tts-close-btn"
              onClick={() => setShowInstruction(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {hasSelection && (
        <div className="tts-read-button-container">
          <button 
            className={`tts-read-button ${isReading ? 'reading' : ''}`}
            onClick={handleReadButton}
            title={language === 'ar' ? 'قراءة النص المحدد' : 'Lire le texte sélectionné'}
          >
            {isReading ? '⏸️' : '🔊'}
          </button>
        </div>
      )}
    </>
  )
}

export default TextToSpeechHandler

