// TTS Service using external API for Arabic
// Using Google Cloud TTS API (requires API key) or fallback to Web Speech API

const GOOGLE_TTS_API_KEY = import.meta.env.VITE_GOOGLE_TTS_API_KEY || ''
const USE_EXTERNAL_API = true // Set to false to use only Web Speech API

export const ttsService = {
  // Use Google Cloud TTS for Arabic
  async speakWithGoogleTTS(text, language = 'ar') {
    if (!GOOGLE_TTS_API_KEY) {
      console.warn('Google TTS API key not configured')
      return false
    }

    try {
      const langCode = language === 'ar' ? 'ar-XA' : 'fr-FR'
      const voiceName = language === 'ar' ? 'ar-XA-Wavenet-A' : 'fr-FR-Wavenet-A'
      
      const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text: text },
          voice: {
            languageCode: langCode,
            name: voiceName,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.85,
            pitch: 0,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('TTS API request failed')
      }

      const data = await response.json()
      const audioData = data.audioContent

      // Decode base64 and play audio
      const audio = new Audio(`data:audio/mp3;base64,${audioData}`)
      audio.play()

      return new Promise((resolve, reject) => {
        audio.onended = () => resolve()
        audio.onerror = (e) => reject(e)
      })
    } catch (error) {
      console.error('Google TTS error:', error)
      return false
    }
  },

  // This method is no longer used - we use Web Speech API directly
  // Kept for compatibility but returns false to use Web Speech API
  async speakWithFreeTTS(text, language = 'ar') {
    // Don't use external APIs - they have CORS issues
    // Return false to fallback to Web Speech API
    return false
  },

  // Check if Arabic voice is available in Web Speech API
  hasArabicVoice() {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return false
      }
      
      const voices = window.speechSynthesis.getVoices()
      if (!voices || voices.length === 0) {
        return false
      }
      
      return voices.some(voice => 
        voice && voice.lang && (
          voice.lang.startsWith('ar') || 
          (voice.name && voice.name.toLowerCase().includes('arabic'))
        )
      )
    } catch (error) {
      console.error('Error checking Arabic voice:', error)
      return false
    }
  }
}

