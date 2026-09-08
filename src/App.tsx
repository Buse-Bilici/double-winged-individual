import React, { useState } from 'react';
import { ChevronLeft, Shield, Database, LinkIcon, Bot, Users, AlertTriangle, Handshake, Target, Trophy, Award, CheckCircle, XCircle, Star, Mail, X, MailOpen, Heart, RefreshCw, HelpCircle } from 'lucide-react';
import SocialSkillsRoadmap from './components/SocialSkillsRoadmap';
import QuestMap from './components/QuestMap';

type Screen = 'intro' | 'social-skills' | 'technical-skills' | 'cybersecurity-quiz' | 'quiz-results' | 'letter-message' | 'mailbox' | 'hacked-screen';
type WingChoice = 'social' | 'technical' | null;
type SocialStep = 'roadmap' | 'quest-map' | 'role-arena' | 'escape-room' | 'mission-wall' | 'future-promise';

interface QuizQuestion {
  id: number;
  question: string;
  correctAnswer: boolean;
  explanation?: string;
}

interface QuizResult {
  questionId: number;
  userAnswer: boolean;
  correct: boolean;
}

interface InspirationalMessage {
  id: string;
  title: string;
  quote: string;
  author: string;
  module: string;
  unlocked: boolean;
  dateEarned?: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('intro');
  const [selectedWing, setSelectedWing] = useState<WingChoice>(null);
  const [currentSocialStep, setCurrentSocialStep] = useState<SocialStep>('roadmap');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [score, setScore] = useState(0);
  const [showLetterIcon, setShowLetterIcon] = useState(false);
  const [socialSkillsScore, setSocialSkillsScore] = useState(0);
  const [inspirationalMessages, setInspirationalMessages] = useState<InspirationalMessage[]>([
    {
      id: 'cybersecurity-message',
      title: 'Siber Güvenlik Başarısı',
      quote: 'Umudu korumak için insan her zaman mücadele etmelidir.',
      author: 'Ahmet Eren',
      module: 'Siber Güvenlik',
      unlocked: false
    }
  ]);

  const cybersecurityQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "Tüm hesaplar için aynı şifreyi kullanmak güvenlidir.",
      correctAnswer: false,
      explanation: "Her hesap için farklı şifreler kullanmak, bir hesap ele geçirildiğinde diğer hesapların güvenliğini korur."
    },
    {
      id: 2,
      question: "E-posta adresi resmi görünse bile, ekleri açmadan önce dikkatli olmalıyız.",
      correctAnswer: true,
      explanation: "Kimlik avı e-postaları genellikle resmi kaynaklara benzer. Göndereni her zaman doğrulayın ve ekleri açmadan önce tarayın."
    },
    {
      id: 3,
      question: "Halka açık Wi-Fi ağlarında bankacılık uygulamalarını kullanmak güvenlidir.",
      correctAnswer: false,
      explanation: "Halka açık Wi-Fi ağları güvenli değildir ve kötü niyetli kişiler tarafından izlenebilir. Bankacılık için mobil veri veya VPN kullanın."
    },
    {
      id: 4,
      question: "İki faktörlü kimlik doğrulama hesabınızı daha güvenli hale getirir.",
      correctAnswer: true,
      explanation: "2FA, şifrenizin ötesinde ikinci bir doğrulama katmanı ekleyerek ek güvenlik sağlar."
    }
  ];

  const handleWingChoice = (choice: WingChoice) => {
    setSelectedWing(choice);
    if (choice === 'technical') {
      setCurrentScreen('technical-skills');
    } else if (choice === 'social') {
      setCurrentScreen('social-skills');
      setCurrentSocialStep('roadmap');
    }
  };

  const handleQuizAnswer = (answer: boolean) => {
    const currentQuestion = cybersecurityQuestions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    const newResult: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      correct: isCorrect
    };

    setQuizResults(prev => [...prev, newResult]);
    
    if (isCorrect) {
      setScore(prev => prev + 25);
    } else {
      setScore(prev => Math.max(0, prev - 10));
    }

    if (currentQuestionIndex < cybersecurityQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate final results
      const allResults = [...quizResults, newResult];
      const finalCorrectAnswers = allResults.filter(result => result.correct).length;
      const finalAccuracy = (finalCorrectAnswers / cybersecurityQuestions.length) * 100;
      
      if (finalAccuracy < 50) {
        // Very low score - show hacked screen
        setCurrentScreen('hacked-screen');
      } else {
        setCurrentScreen('quiz-results');
        // Check if score is above threshold (75% or higher) to show letter
        if (finalAccuracy >= 75) {
          setTimeout(() => setShowLetterIcon(true), 2000);
        }
      }
    }
  };

  const unlockMessage = (messageId: string) => {
    setInspirationalMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, unlocked: true, dateEarned: new Date().toLocaleDateString('tr-TR') }
          : msg
      )
    );
  };

  const resetGame = () => {
    setCurrentScreen('intro');
    setSelectedWing(null);
    setCurrentSocialStep('roadmap');
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setScore(0);
    setShowLetterIcon(false);
    setSocialSkillsScore(0);
  };

  const goBack = () => {
    if (currentScreen === 'social-skills' || currentScreen === 'technical-skills') {
      setCurrentScreen('intro');
      setSelectedWing(null);
    } else if (currentScreen === 'cybersecurity-quiz') {
      setCurrentScreen('technical-skills');
    } else if (currentScreen === 'quiz-results') {
      setCurrentScreen('technical-skills');
      setCurrentQuestionIndex(0);
      setQuizResults([]);
      setScore(0);
      setShowLetterIcon(false);
    } else if (currentScreen === 'letter-message') {
      setCurrentScreen('quiz-results');
    } else if (currentScreen === 'mailbox') {
      if (selectedWing === 'social') {
        setCurrentScreen('social-skills');
      } else if (selectedWing === 'technical') {
        setCurrentScreen('technical-skills');
      }
    } else if (currentScreen === 'hacked-screen') {
      setCurrentScreen('technical-skills');
      setCurrentQuestionIndex(0);
      setQuizResults([]);
      setScore(0);
    }
  };

  const handleSocialStepSelect = (stepId: string) => {
    setCurrentSocialStep(stepId as SocialStep);
  };

  const handleQuestMapComplete = (questScore: number) => {
    setSocialSkillsScore(prev => prev + questScore);
    setCurrentSocialStep('roadmap');
    // Here you would unlock the next step in the roadmap
  };

  const correctAnswers = quizResults.filter(result => result.correct).length;
  const totalQuestions = cybersecurityQuestions.length;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  const getBadge = () => {
    if (accuracy >= 90) return { name: 'Siber Güvenlik Uzmanı', color: 'from-yellow-400 to-yellow-600', icon: Trophy };
    if (accuracy >= 75) return { name: 'Güvenlik Uzmanı', color: 'from-blue-400 to-blue-600', icon: Award };
    if (accuracy >= 50) return { name: 'Güvenlik Bilincinde', color: 'from-green-400 to-green-600', icon: Shield };
    return { name: 'Öğrenme Yolunda', color: 'from-gray-400 to-gray-600', icon: Star };
  };

  // Mailbox Component
  const MailboxButton = () => (
    <button
      onClick={() => setCurrentScreen('mailbox')}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
    >
      <Mail className="w-5 h-5" />
      <span className="text-sm font-medium">Posta Kutum</span>
      {inspirationalMessages.some(msg => msg.unlocked) && (
        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
      )}
    </button>
  );

  if (currentScreen === 'hacked-screen') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Matrix-style falling code */}
        <div className="matrix-bg absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="matrix-column absolute top-0 text-green-400 text-xs font-mono"
              style={{
                left: `${i * 5}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {Array.from({ length: 50 }).map((_, j) => (
                <div key={j} className="opacity-70">
                  {String.fromCharCode(33 + Math.random() * 94)}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-green-400 mb-8 glitch-text">
              Maalesef, hacklenmişsiniz.
            </h1>
            <div className="w-24 h-24 mx-auto mb-8 border-4 border-green-400 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => {
                // Create and show the YGA help modal
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50';
                modal.innerHTML = `
                  <div class="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 rounded-2xl p-8 max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-500 border-opacity-30">
                    <div class="flex justify-between items-center mb-6">
                      <h2 class="text-2xl font-bold text-white">YGA Mezunlarından Destek</h2>
                      <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-300 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    <div class="text-white space-y-6 leading-relaxed">
                      <div class="bg-gradient-to-r from-green-500 to-blue-500 bg-opacity-20 p-6 rounded-xl border border-green-400 border-opacity-30">
                        <p class="text-lg font-semibold mb-4">Testi geçemedin mi? Aslında geçtin — çünkü önemli olan puan değil, merak.</p>
                        <p>Her düşüş, kendine daha derinlemesine bakman için bir davet.</p>
                        <p>Puanlar geçici, dönüşüm kalıcı.</p>
                        <p>Ve işte tam da bu yüzden buradayız — tam yanında.</p>
                        <p class="font-semibold mt-4">Başlayalım mı?</p>
                      </div>
                      
                      <div class="bg-blue-500 bg-opacity-20 p-6 rounded-xl border border-blue-400 border-opacity-30">
                        <p class="mb-4">Siber güvenlik sadece bilgisayarları korumak değil.</p>
                        <p class="mb-4">Veri gizliliğini korumak, sistemleri dış tehditlere karşı savunmak ve güvenli bir dijital gelecek inşa etmek için yapılan tüm teknik ve stratejik çabaların ortak adı.</p>
                        <p class="mb-4">Aynı zamanda meraklı olmak, araştırma yapmak ve deneme yanılma yoluyla öğrenmek demek.</p>
                        <p class="mb-4">Yani bu alan, teknolojik zekâ ile etik değerleri harmanlayan bir tür süper güç.</p>
                        <p>Ve sen bu dünyaya adım attığın anda zaten bir "eğitimde siber kahraman" oldun. 🌐✨</p>
                      </div>

                      <div class="bg-red-500 bg-opacity-20 p-6 rounded-xl border border-red-400 border-opacity-30">
                        <h3 class="text-xl font-bold mb-3">🧠 Peki neden düşük aldın?</h3>
                        <p class="mb-3">Çünkü bu alan ciddi, detaylı ve sürekli gelişen bir alan.</p>
                        <p class="mb-3">Testi geçememek, yetersiz olduğunu değil; henüz yeterince keşfetmediğini gösterir.</p>
                        <p>Merak etme, en iyi hacker'lar ve güvenlik uzmanları bile bu yollardan geçti.</p>
                      </div>

                      <div class="bg-purple-500 bg-opacity-20 p-6 rounded-xl border border-purple-400 border-opacity-30">
                        <h3 class="text-xl font-bold mb-4">🎯 Şimdi ne yapabilirim?</h3>
                        <p class="mb-4">İşte sana siber güvenlikte temelleri sağlamlaştıracak, hem teknik bilgi verecek hem de vizyon katacak kaynaklar:</p>
                        
                        <div class="space-y-4">
                          <div>
                            <h4 class="font-semibold text-green-400 mb-2">🔐 Araçlar:</h4>
                            <ul class="list-disc list-inside space-y-1 text-sm">
                              <li>CyberChef – Şifreleme ve çözümleme konusunda pratik yapmak isteyenler için tam bir mutfak!</li>
                              <li>TryHackMe – Oyunlaştırılmış görevlerle siber dünyada keşfe çık!</li>
                              <li>Hack The Box (Beginner Track) – "Ben bir şey bilmiyorum ama öğrenmek istiyorum" diyorsan, tam sana göre.</li>
                            </ul>
                          </div>

                          <div>
                            <h4 class="font-semibold text-blue-400 mb-2">📘 Kitaplar:</h4>
                            <ul class="list-disc list-inside space-y-1 text-sm">
                              <li>Cybersecurity for Beginners – Raef Meeuwisse</li>
                              <li>The Art of Invisibility – Kevin Mitnick</li>
                              <li>Blue Team Field Manual (BTFM) – Alan White & Ben Clark</li>
                            </ul>
                          </div>

                          <div>
                            <h4 class="font-semibold text-yellow-400 mb-2">🧑💻 Online Eğitimler ve Sertifika Programları:</h4>
                            <ul class="list-disc list-inside space-y-1 text-sm">
                              <li>Cybrary – Giriş ve ileri düzey eğitimlerle dolu dev bir kütüphane</li>
                              <li>Coursera - Introduction to Cyber Security Specialization (NYU)</li>
                              <li>Google Cybersecurity Certificate (Coursera üzerinden)</li>
                              <li>Cisco Networking Academy – Cybersecurity Essentials</li>
                              <li>EDX - Cybersecurity Fundamentals (RIT)</li>
                            </ul>
                          </div>

                          <div>
                            <h4 class="font-semibold text-pink-400 mb-2">📺 YouTube ve Video İçerikleri:</h4>
                            <ul class="list-disc list-inside space-y-1 text-sm">
                              <li>NetworkChuck – Eğlenceli anlatımıyla karmaşık konuları sadeleştiriyor</li>
                              <li>Computerphile – Siber güvenlik, kriptografi ve internet protokolleri üzerine bilimsel içerikler</li>
                              <li>John Hammond – Teknik analizler, CTF çözümleri ve Red Team içerikleri</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div class="bg-gradient-to-r from-orange-500 to-pink-500 bg-opacity-20 p-6 rounded-xl border border-orange-400 border-opacity-30">
                        <h3 class="text-xl font-bold mb-3">🤝 YGA Mezunlarından Sana Bir Not:</h3>
                        <p class="mb-3">Unutma, biz de bu yollardan geçtik. İlk testte başarısız olduk.</p>
                        <p class="mb-3">Ama unutma, bu testi geçememek bir son değil; gelişim sürecinin doğal bir parçası.</p>
                        <p class="mb-3">Biz buradayız. Sor, dene, yanıl, yeniden başla.</p>
                        <p class="mb-3">Senin gibi yeni meraklılara yardımcı olmak için buradayız.</p>
                        <p>Gerçek öğrenme birlikte başlar.</p>
                      </div>

                      <div class="bg-gradient-to-r from-green-400 to-blue-400 bg-opacity-20 p-6 rounded-xl border border-green-400 border-opacity-30 text-center">
                        <p class="text-lg font-semibold mb-3">🎉 Bir gün değil, her gün öğrenerek büyüyoruz.</p>
                        <p class="mb-3">Gelecek seninle şekillenecek.</p>
                        <p class="mb-3">Bugün öğrendiklerinle, yarının dijital güvenliğini sağlayan lider sen olabilirsin.</p>
                        <p class="font-bold text-xl">Sen de bizimle yola devam etmeye var mısın?</p>
                      </div>
                    </div>
                  </div>
                `;
                document.body.appendChild(modal);
              }}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-400"
            >
              <div className="flex items-center justify-center gap-3">
                <HelpCircle className="w-6 h-6" />
                <span>YGA mezunlarından yardım iste. Yalnız değilsin.</span>
              </div>
            </button>

            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setQuizResults([]);
                setScore(0);
                setCurrentScreen('cybersecurity-quiz');
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-400"
            >
              <div className="flex items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6" />
                <span>Testi Tekrar Al</span>
              </div>
            </button>
          </div>

          <div className="mt-12 text-green-400 text-sm opacity-70">
            <p>Hatalardan öğrenmek bizi güçlendirir. Tekrar dene!</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'mailbox') {
    const unlockedMessages = inspirationalMessages.filter(msg => msg.unlocked);
    const lockedMessages = inspirationalMessages.filter(msg => !msg.unlocked);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8 pt-8">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Geri</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Posta Kutum</h1>
              <p className="text-gray-300">İlham verici mesajların</p>
            </div>
            <div className="w-20"></div>
          </div>

          {/* Words That Brightened My Day Section */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-pink-400" />
              <h2 className="text-2xl font-bold text-white">Günümü Aydınlatan Sözler</h2>
            </div>

            {unlockedMessages.length > 0 ? (
              <div className="space-y-4">
                {unlockedMessages.map((message) => (
                  <div key={message.id} className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{message.title}</h3>
                        <p className="text-pink-100 text-sm">{message.module} modülünden kazanıldı • {message.dateEarned}</p>
                      </div>
                      <MailOpen className="w-6 h-6 text-pink-200" />
                    </div>
                    <blockquote className="text-lg italic mb-2">"{message.quote}"</blockquote>
                    <p className="text-right text-pink-200">— {message.author}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400 text-lg">Henüz açılmış mesaj yok</p>
                <p className="text-gray-500 text-sm mt-2">İlham verici alıntılar kazanmak için modülleri yüksek puanla tamamla!</p>
              </div>
            )}
          </div>

          {/* Locked Messages Section */}
          {lockedMessages.length > 0 && (
            <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Kilitli Mesajlar</h2>
              <div className="space-y-4">
                {lockedMessages.map((message) => (
                  <div key={message.id} className="bg-gray-700 bg-opacity-50 rounded-xl p-6 text-gray-400">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{message.module} Başarısı</h3>
                        <p className="text-sm">Açmak için {message.module} modülünü %75+ puanla tamamla</p>
                      </div>
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Magical Background Elements */}
        
        {/* Floating Light Particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-float-particle opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${4 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}

        {/* Butterflies */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`butterfly-${i}`}
            className="absolute animate-butterfly-float"
            style={{
              left: `${-10 + Math.random() * 20}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDuration: `${15 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            <div className="relative">
              {/* Butterfly body */}
              <div className="w-0.5 h-4 bg-orange-600 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
              
              {/* Left wing */}
              <div 
                className="w-3 h-2 rounded-full absolute left-0 top-1/2 transform -translate-y-1/2 animate-wing-flutter"
                style={{
                  background: `linear-gradient(45deg, 
                    ${i % 3 === 0 ? '#f97316, #fbbf24' : i % 3 === 1 ? '#ec4899, #f472b6' : '#8b5cf6, #a78bfa'})`
                }}
              ></div>
              
              {/* Right wing */}
              <div 
                className="w-3 h-2 rounded-full absolute right-0 top-1/2 transform -translate-y-1/2 animate-wing-flutter"
                style={{
                  background: `linear-gradient(-45deg, 
                    ${i % 3 === 0 ? '#f97316, #fbbf24' : i % 3 === 1 ? '#ec4899, #f472b6' : '#8b5cf6, #a78bfa'})`,
                  animationDelay: '0.1s'
                }}
              ></div>
            </div>
          </div>
        ))}

        {/* Sparkling Lights */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}

        {/* Glowing Orbs */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full animate-glow-orb blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              background: `radial-gradient(circle, ${
                i % 4 === 0 ? '#fbbf24' : 
                i % 4 === 1 ? '#8b5cf6' : 
                i % 4 === 2 ? '#06b6d4' : '#10b981'
              }, transparent)`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}

        <div className="text-center mb-12 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight magical-text">
            Çift Kanatlı Bireyler
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Mükemmellik yolunu seç
          </p>
        </div>

        <div className="text-center mb-8 relative z-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Hangi kanadı seçmek istiyorsun?
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full max-w-6xl relative z-10">
          {/* Left Wing - Technical Skills */}
          <div className="relative group cursor-pointer" onClick={() => handleWingChoice('technical')}>
            <div className="wing-left transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative wing-shape bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white p-8 shadow-xl transform -rotate-12 hover:-rotate-6 transition-all duration-500">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Teknik Beceriler</h3>
                  <p className="text-sm opacity-90">Dijital dünyaya hakim ol</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Wing - Social Skills */}
          <div className="relative group cursor-pointer" onClick={() => handleWingChoice('social')}>
            <div className="wing-right transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative wing-shape bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white p-8 shadow-xl transform rotate-12 hover:rotate-6 transition-all duration-500">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sosyal Beceriler</h3>
                  <p className="text-sm opacity-90">Bağlan ve başkalarına ilham ver</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center relative z-10">
          <p className="text-gray-400 text-sm">
            Yolculuğuna başlamak için bir kanada tıkla
          </p>
        </div>
      </div>
    );
  }

  if (currentScreen === 'social-skills') {
    if (currentSocialStep === 'quest-map') {
      return (
        <QuestMap
          onBack={() => setCurrentSocialStep('roadmap')}
          onComplete={handleQuestMapComplete}
        />
      );
    }

    if (currentSocialStep === 'roadmap') {
      return (
        <SocialSkillsRoadmap
          onBack={() => setCurrentScreen('intro')}
          onStepSelect={handleSocialStepSelect}
        />
      );
    }

    const socialOptions = [
      {
        id: 'crisis-management',
        title: 'Kriz Yönetimi',
        description: 'Zorlukları güven ve netlikle aş',
        icon: AlertTriangle,
        color: 'from-red-500 to-red-600',
        hoverColor: 'hover:from-red-400 hover:to-red-500'
      },
      {
        id: 'moral-responsibility',
        title: 'Ahlaki Sorumluluk',
        description: 'Karar verme için etik temeller oluştur',
        icon: Shield,
        color: 'from-blue-500 to-blue-600',
        hoverColor: 'hover:from-blue-400 hover:to-blue-500'
      },
      {
        id: 'entrepreneurship-networking',
        title: 'Girişimcilik ve Ağ Kurma',
        description: 'Bağlantılar kur ve yeniliği yönlendir',
        icon: Handshake,
        color: 'from-green-500 to-green-600',
        hoverColor: 'hover:from-green-400 hover:to-green-500'
      },
      {
        id: 'achieving-together',
        title: 'Birlikte Başarmak',
        description: 'Ortak hedeflere ulaşmak için etkili işbirliği yap',
        icon: Target,
        color: 'from-purple-500 to-purple-600',
        hoverColor: 'hover:from-purple-400 hover:to-purple-500'
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 pt-8">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Kanatlara Geri Dön</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white">Sosyal Beceriler</h1>
              <p className="text-gray-300 mt-2">Uzmanlık alanını seç</p>
            </div>
            <MailboxButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {socialOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.id}
                  className={`relative group cursor-pointer transform hover:scale-105 transition-all duration-300`}
                  onClick={() => setCurrentSocialStep('roadmap')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-20 rounded-xl blur-sm group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className={`relative bg-gradient-to-r ${option.color} ${option.hoverColor} p-6 md:p-8 rounded-xl shadow-xl transition-all duration-300`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">{option.title}</h3>
                    </div>
                    <p className="text-white text-opacity-90 leading-relaxed">
                      {option.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-white text-opacity-70 text-sm">Keşfetmek için tıkla</span>
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300">
                        <ChevronLeft className="w-4 h-4 text-white rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12 pb-8">
            <p className="text-gray-400 text-sm">
              Özel öğrenme yolculuğuna başlamak için bir sosyal beceri seç
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'technical-skills') {
    const technicalOptions = [
      {
        id: 'cybersecurity',
        title: 'Siber Güvenlik',
        description: 'Dijital varlıkları koru ve sistemleri güvenli hale getir',
        icon: Shield,
        color: 'from-red-500 to-red-600',
        hoverColor: 'hover:from-red-400 hover:to-red-500',
        onClick: () => setCurrentScreen('cybersecurity-quiz')
      },
      {
        id: 'data-science',
        title: 'Veri Bilimi',
        description: 'Karmaşık veri setlerinden içgörüler çıkar',
        icon: Database,
        color: 'from-blue-500 to-blue-600',
        hoverColor: 'hover:from-blue-400 hover:to-blue-500',
        onClick: () => alert('Veri Bilimi yolu yakında geliyor!')
      },
      {
        id: 'blockchain',
        title: 'Blok Zinciri',
        description: 'Merkezi olmayan ve güvenli uygulamalar geliştir',
        icon: LinkIcon,
        color: 'from-green-500 to-green-600',
        hoverColor: 'hover:from-green-400 hover:to-green-500',
        onClick: () => alert('Blok Zinciri yolu yakında geliyor!')
      },
      {
        id: 'ai-tools',
        title: 'Yapay Zeka Araçları',
        description: 'Yenilik için yapay zekayı kullan',
        icon: Bot,
        color: 'from-purple-500 to-purple-600',
        hoverColor: 'hover:from-purple-400 hover:to-purple-500',
        onClick: () => alert('Yapay Zeka Araçları yolu yakında geliyor!')
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 pt-8">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Kanatlara Geri Dön</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white">Teknik Beceriler</h1>
              <p className="text-gray-300 mt-2">Uzmanlık alanını seç</p>
            </div>
            <MailboxButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {technicalOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.id}
                  className={`relative group cursor-pointer transform hover:scale-105 transition-all duration-300`}
                  onClick={option.onClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-20 rounded-xl blur-sm group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className={`relative bg-gradient-to-r ${option.color} ${option.hoverColor} p-6 md:p-8 rounded-xl shadow-xl transition-all duration-300`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">{option.title}</h3>
                    </div>
                    <p className="text-white text-opacity-90 leading-relaxed">
                      {option.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-white text-opacity-70 text-sm">
                        {option.id === 'cybersecurity' ? 'Teste Başla' : 'Keşfetmek için tıkla'}
                      </span>
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300">
                        <ChevronLeft className="w-4 h-4 text-white rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12 pb-8">
            <p className="text-gray-400 text-sm">
              Özel öğrenme yolculuğuna başlamak için bir teknik beceri seç
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'cybersecurity-quiz') {
    const currentQuestion = cybersecurityQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / cybersecurityQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl quiz-question">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-white hover:text-red-400 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Geri</span>
              </button>
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Siber Güvenlik Testi</h1>
                <p className="text-gray-300">Soru {currentQuestionIndex + 1} / {cybersecurityQuestions.length}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">Puan: {score}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => handleQuizAnswer(true)}
                className="flex-1 max-w-xs mx-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-lg">Doğru</span>
                </div>
              </button>
              <button
                onClick={() => handleQuizAnswer(false)}
                className="flex-1 max-w-xs mx-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-3">
                  <XCircle className="w-6 h-6" />
                  <span className="text-lg">Yanlış</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'letter-message') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                unlockMessage('cybersecurity-message');
                goBack();
              }}
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
          
          {/* Torn paper effect */}
          <div className="notebook-paper relative bg-white p-8 md:p-12 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
            {/* Paper texture and lines */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full" style={{
                backgroundImage: `repeating-linear-gradient(
                  transparent,
                  transparent 24px,
                  #e5e7eb 24px,
                  #e5e7eb 26px
                )`
              }}></div>
            </div>
            
            {/* Red margin line */}
            <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-red-300 opacity-30"></div>
            
            {/* Holes for spiral binding */}
            <div className="absolute left-6 top-8 w-2 h-2 bg-gray-200 rounded-full"></div>
            <div className="absolute left-6 top-20 w-2 h-2 bg-gray-200 rounded-full"></div>
            <div className="absolute left-6 top-32 w-2 h-2 bg-gray-200 rounded-full"></div>
            
            <div className="relative z-10 text-center">
              <div className="mb-8">
                <Mail className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Özel Mesaj</h2>
                <p className="text-gray-600">Mükemmel performansın için tebrikler!</p>
              </div>
              
              <div className="text-left max-w-md mx-auto">
                <blockquote className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed mb-6 italic">
                  "Umudu korumak için insan her zaman mücadele etmelidir."
                </blockquote>
                
                <div className="text-right">
                  <p className="text-gray-700 font-semibold">— Ahmet Eren</p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Olağanüstü siber güvenlik bilgisi sergileddin. Bu mesaj posta kutuna eklendi!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'quiz-results') {
    const badge = getBadge();
    const BadgeIcon = badge.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Test Tamamlandı!</h1>
            <p className="text-xl text-gray-300">İşte performansın</p>
          </div>

          {/* Main Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl dashboard-card">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Son Puan</h3>
                <p className="text-4xl font-bold mb-2">{score}</p>
                <p className="text-blue-100">Kazanılan Puan</p>
              </div>
            </div>

            {/* Accuracy Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-2xl dashboard-card">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Doğruluk</h3>
                <p className="text-4xl font-bold mb-2">%{Math.round(accuracy)}</p>
                <p className="text-green-100">{correctAnswers} / {totalQuestions} doğru</p>
              </div>
            </div>

            {/* Badge Card */}
            <div className={`bg-gradient-to-br ${badge.color} rounded-2xl p-8 text-white shadow-2xl dashboard-card`}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <BadgeIcon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Başarı</h3>
                <p className="text-lg font-semibold">{badge.name}</p>
              </div>
            </div>
          </div>

          {/* Letter Icon - appears when score is high enough */}
          {showLetterIcon && (
            <div className="text-center mb-8">
              <div className="inline-block animate-bounce">
                <button
                  onClick={() => setCurrentScreen('letter-message')}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-white p-6 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
                >
                  <Mail className="w-12 h-12" />
                </button>
                <p className="text-white mt-4 font-semibold text-lg">Bir mesajın var</p>
              </div>
            </div>
          )}

          {/* Detailed Results */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Soru Detayları</h3>
            <div className="space-y-4">
              {cybersecurityQuestions.map((question, index) => {
                const result = quizResults[index];
                const isCorrect = result?.correct;
                return (
                  <div key={question.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isCorrect ? <CheckCircle className="w-5 h-5 text-white" /> : <XCircle className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium mb-2">{question.question}</p>
                        <p className="text-gray-300 text-sm">
                          Doğru Cevap: {question.correctAnswer ? 'Doğru' : 'Yanlış'}
                        </p>
                        {question.explanation && (
                          <p className="text-gray-400 text-sm mt-2 italic">{question.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setQuizResults([]);
                setScore(0);
                setShowLetterIcon(false);
                setCurrentScreen('cybersecurity-quiz');
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Testi Tekrar Al
            </button>
            <button
              onClick={goBack}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Teknik Becerilere Dön
            </button>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Baştan Başla
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;