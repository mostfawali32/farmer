import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './LawyerChatBox.css'

function LawyerChatBox({ solution }) {
  const { language } = useLanguage()
  const t = translations[language]
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          type: 'lawyer',
          text: solution === '1' 
            ? (language === 'ar' 
              ? 'مرحباً! أنا محامٍ متخصص في تنظيم الأوراق العقارية. كيف يمكنني مساعدتك اليوم؟'
              : 'Bonjour ! Je suis un avocat spécialisé dans la régularisation des documents fonciers. Comment puis-je vous aider aujourd\'hui ?')
            : (language === 'ar'
              ? 'مرحباً! أنا محامٍ متخصص في طلبات المعدات من البنوك الإسلامية. كيف يمكنني مساعدتك اليوم؟'
              : 'Bonjour ! Je suis un avocat spécialisé dans les demandes d\'équipements auprès des banques islamiques. Comment puis-je vous aider aujourd\'hui ?')
        }
      ])
    }
  }, [solution, language])

  const getStandardQuestions = () => {
    if (solution === '1') {
      return language === 'ar' 
        ? [
            'ما هي الوثائق المطلوبة للحصول على قرض؟',
            'كم يستغرق وقت معالجة الطلب؟',
            'ما هي تكلفة الخدمات القانونية؟',
            'هل يمكنني متابعة حالة طلبي؟',
            'ما هي شروط الحصول على القرض؟'
          ]
        : [
            'Quels documents sont requis pour obtenir un prêt ?',
            'Combien de temps prend le traitement de la demande ?',
            'Quel est le coût des services juridiques ?',
            'Puis-je suivre l\'état de ma demande ?',
            'Quelles sont les conditions pour obtenir le prêt ?'
          ]
    } else {
      return language === 'ar'
        ? [
            'ما هي المعدات المتاحة من البنك الإسلامي؟',
            'كم يستغرق وقت الموافقة على طلب المعدات؟',
            'ما هي الشروط للحصول على المعدات؟',
            'هل يمكنني طلب أكثر من نوع معدات؟',
            'ما هي الوثائق المطلوبة لطلب المعدات؟'
          ]
        : [
            'Quels équipements sont disponibles auprès de la banque islamique ?',
            'Combien de temps prend l\'approbation de la demande d\'équipements ?',
            'Quelles sont les conditions pour obtenir les équipements ?',
            'Puis-je demander plus d\'un type d\'équipement ?',
            'Quels documents sont requis pour la demande d\'équipements ?'
          ]
    }
  }

  const getAnswer = (question) => {
    const answers = {
      // Solution 1 - Arabic
      'ما هي الوثائق المطلوبة للحصول على قرض؟': 'الوثائق المطلوبة تشمل: بطاقة التعريف الوطنية (CIN)، أوراق الأرض، تقرير الخبير، وإثبات استغلال الأرض. يجب أن تكون جميع الوثائق مصدقة ومحدثة.',
      'كم يستغرق وقت معالجة الطلب؟': 'عادة ما يستغرق معالجة الطلب من 15 إلى 30 يوم عمل. يعتمد الوقت على اكتمال الوثائق ومراجعة البنك.',
      'ما هي تكلفة الخدمات القانونية؟': 'تكلفة الخدمات القانونية تتراوح بين 200 و 500 دينار تونسي حسب تعقيد الملف. يمكننا مناقشة التفاصيل عند استكمال الوثائق.',
      'هل يمكنني متابعة حالة طلبي؟': 'نعم، يمكنك متابعة حالة طلبك من خلال لوحة التحكم. ستتلقى إشعارات عند تحديث الحالة.',
      'ما هي شروط الحصول على القرض؟': 'الشروط الأساسية: امتلاك أرض مسجلة قانونياً، تقرير خبير يثبت قيمة الأرض، إثبات استغلال الأرض لمدة لا تقل عن 3 سنوات، وملف كامل من الوثائق.',

      // Solution 1 - French
      'Quels documents sont requis pour obtenir un prêt ?': 'Les documents requis comprennent : la carte d\'identité nationale (CIN), les papiers de terrain, le rapport d\'expert et la preuve d\'exploitation du terrain. Tous les documents doivent être certifiés et à jour.',
      'Combien de temps prend le traitement de la demande ?': 'Le traitement de la demande prend généralement entre 15 et 30 jours ouvrables. Le temps dépend de la complétude des documents et de l\'examen par la banque.',
      'Quel est le coût des services juridiques ?': 'Le coût des services juridiques varie entre 200 et 500 dinars tunisiens selon la complexité du dossier. Nous pouvons discuter des détails une fois les documents complétés.',
      'Puis-je suivre l\'état de ma demande ?': 'Oui, vous pouvez suivre l\'état de votre demande via le tableau de bord. Vous recevrez des notifications lors des mises à jour de statut.',
      'Quelles sont les conditions pour obtenir le prêt ?': 'Les conditions de base : posséder un terrain enregistré légalement, un rapport d\'expert prouvant la valeur du terrain, une preuve d\'exploitation du terrain pendant au moins 3 ans, et un dossier complet de documents.',

      // Solution 2 - Arabic
      'ما هي المعدات المتاحة من البنك الإسلامي؟': 'البنك الإسلامي يوفر أنواعاً مختلفة من المعدات الزراعية مثل: الجرارات، مضخات المياه، معدات الري، والحصادات. يمكنك اختيار المعدات المناسبة لاحتياجاتك.',
      'كم يستغرق وقت الموافقة على طلب المعدات؟': 'عادة ما يستغرق الحصول على الموافقة من 10 إلى 20 يوم عمل. يعتمد الوقت على نوع المعدات المطلوبة واكتمال الوثائق.',
      'ما هي الشروط للحصول على المعدات؟': 'الشروط الأساسية: امتلاك أرض زراعية، تقديم الوثائق المطلوبة (CIN وأوراق الأرض)، وملف كامل من الوثائق. يجب أن تكون الأرض قابلة للاستغلال الزراعي.',
      'هل يمكنني طلب أكثر من نوع معدات؟': 'نعم، يمكنك طلب أكثر من نوع معدات في نفس الطلب. لكن يجب أن تبرر الحاجة لكل نوع من المعدات في طلبك.',
      'ما هي الوثائق المطلوبة لطلب المعدات؟': 'الوثائق المطلوبة: بطاقة التعريف الوطنية (CIN)، أوراق الأرض، ووثائق طلب المعدات. يجب أن تكون جميع الوثائق مصدقة ومحدثة.',

      // Solution 2 - French
      'Quels équipements sont disponibles auprès de la banque islamique ?': 'La banque islamique propose différents types d\'équipements agricoles tels que : tracteurs, pompes à eau, équipements d\'irrigation et moissonneuses. Vous pouvez choisir les équipements adaptés à vos besoins.',
      'Combien de temps prend l\'approbation de la demande d\'équipements ?': 'L\'obtention de l\'approbation prend généralement entre 10 et 20 jours ouvrables. Le temps dépend du type d\'équipement demandé et de la complétude des documents.',
      'Quelles sont les conditions pour obtenir les équipements ?': 'Les conditions de base : posséder un terrain agricole, fournir les documents requis (CIN et papiers de terrain), et un dossier complet de documents. Le terrain doit être exploitable agricolement.',
      'Puis-je demander plus d\'un type d\'équipement ?': 'Oui, vous pouvez demander plus d\'un type d\'équipement dans la même demande. Cependant, vous devez justifier le besoin de chaque type d\'équipement dans votre demande.',
      'Quels documents sont requis pour la demande d\'équipements ?': 'Les documents requis : carte d\'identité nationale (CIN), papiers de terrain et documents de demande d\'équipements. Tous les documents doivent être certifiés et à jour.'
    }

    return answers[question] || (language === 'ar' 
      ? 'شكراً لسؤالك. يرجى الاتصال بنا مباشرة للحصول على معلومات أكثر تفصيلاً.'
      : 'Merci pour votre question. Veuillez nous contacter directement pour plus de détails.')
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage = {
      type: 'user',
      text: inputValue
    }

    const lawyerResponse = {
      type: 'lawyer',
      text: getAnswer(inputValue)
    }

    setMessages(prev => [...prev, userMessage, lawyerResponse])
    setInputValue('')
  }

  const handleStandardQuestion = (question) => {
    const userMessage = {
      type: 'user',
      text: question
    }

    const lawyerResponse = {
      type: 'lawyer',
      text: getAnswer(question)
    }

    setMessages(prev => [...prev, userMessage, lawyerResponse])
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <button 
        className={`lawyer-chat-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={language === 'ar' ? 'فتح الدردشة مع المحامي' : 'Ouvrir le chat avec l\'avocat'}
      >
        {isOpen ? '✕' : '⚖️'}
      </button>

      {isOpen && (
        <div className="lawyer-chat-container">
          <div className="lawyer-chat-header">
            <div className="lawyer-info">
              <span className="lawyer-icon">⚖️</span>
              <div>
                <h3>{language === 'ar' ? 'المحامي القانوني' : 'Avocat juridique'}</h3>
                <p className="lawyer-status">
                  <span className="status-dot"></span>
                  {language === 'ar' ? 'متصل الآن' : 'En ligne'}
                </p>
              </div>
            </div>
            <button 
              className="chat-close-button"
              onClick={() => setIsOpen(false)}
              aria-label={language === 'ar' ? 'إغلاق' : 'Fermer'}
            >
              ✕
            </button>
          </div>

          <div className="lawyer-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.type}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="standard-questions">
            <p className="questions-label">
              {language === 'ar' ? 'أسئلة شائعة:' : 'Questions fréquentes :'}
            </p>
            <div className="questions-list">
              {getStandardQuestions().map((question, idx) => (
                <button
                  key={idx}
                  className="standard-question-button"
                  onClick={() => handleStandardQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="lawyer-chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'ar' ? 'اكتب سؤالك هنا...' : 'Tapez votre question ici...'}
              className="chat-input-field"
            />
            <button 
              className="chat-send-button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default LawyerChatBox

