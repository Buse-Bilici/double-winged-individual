import React, { useState } from 'react';
import { ArrowLeft, Heart, Users, Lightbulb, CheckCircle, Star } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuestMapProps {
  onBack: () => void;
  onComplete: (score: number) => void;
}

const QuestMap: React.FC<QuestMapProps> = ({ onBack, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions: Question[] = [
    {
      id: 1,
      question: "Arkadaşın sana önemli bir sırrını anlattı ama başka arkadaşların da bu konuyu merak ediyor. Ne yaparsın?",
      options: [
        "Arkadaşımın güvenini korur, sırrını kimseyle paylaşmam",
        "Sadece en yakın arkadaşıma söylerim, o da kimseye söylemez",
        "Herkesin merak ettiği bir konu, paylaşırım",
        "Arkadaşıma sorarak izin alırım"
      ],
      correctAnswer: 0,
      explanation: "Güven, ilişkilerin temel taşıdır. Birinin size verdiği güveni korumak, empati ve ahlaki sorumluluğun en önemli göstergelerinden biridir."
    },
    {
      id: 2,
      question: "Okulda bir arkadaşının zorbalığa uğradığını görüyorsun. Bu durumda nasıl davranırsın?",
      options: [
        "Karışmam, beni de hedef alabilirler",
        "Arkadaşımı destekler, durumu öğretmene bildiririm",
        "Sadece arkadaşımla konuşur, başka bir şey yapmam",
        "Zorbaları uyarır, devam ederlerse müdahale ederim"
      ],
      correctAnswer: 1,
      explanation: "Zorbalığa karşı durmak cesaret ister. Hem arkadaşınızı desteklemek hem de yetkilileri bilgilendirmek en etkili yaklaşımdır."
    },
    {
      id: 3,
      question: "Grup projesinde bir arkadaşın hiç katkı sağlamıyor ama notunuz ortak olacak. Ne yaparsın?",
      options: [
        "Öğretmene şikayet ederim",
        "Arkadaşımla konuşur, neden katkı sağlamadığını anlamaya çalışırım",
        "Sessiz kalır, projeyi tek başıma bitiririm",
        "Onu gruptan çıkarırım"
      ],
      correctAnswer: 1,
      explanation: "Empati ile yaklaşmak, önce anlamaya çalışmak en doğru yaklaşımdır. Belki arkadaşınızın bilmediğiniz zorlukları vardır."
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 10);
    }

    setShowExplanation(true);
  };

  const handleContinue = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      onComplete(score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 10 : 0));
    }
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Magical Background */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-300 rounded-full animate-float-particle opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Geri Dön</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white magical-text mb-2">
              Quest Map - Empati Soruları
            </h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>{score} Puan</span>
              </div>
              <div className="text-blue-300">
                Soru {currentQuestion + 1} / {questions.length}
              </div>
            </div>
          </div>
          
          <div className="w-20" />
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-xl quiz-question">
            {!showExplanation ? (
              <>
                {/* Question */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full mb-4">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">Empati Sorusu</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {currentQ.question}
                  </h2>
                </div>

                {/* Options */}
                <div className="grid gap-4 mb-8">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`
                        p-4 rounded-xl text-left transition-all duration-300 border-2
                        ${selectedAnswer === index
                          ? 'bg-blue-500 border-blue-400 text-white transform scale-105'
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold
                          ${selectedAnswer === index ? 'bg-white text-blue-500' : 'border-white/40 text-white'}
                        `}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <div className="text-center">
                  <button
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    className={`
                      px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300
                      ${selectedAnswer !== null
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transform hover:scale-105'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Cevabı Onayla
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Result */}
                <div className="text-center mb-8">
                  <div className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
                    ${selectedAnswer === currentQ.correctAnswer ? 'bg-green-500' : 'bg-orange-500'}
                    text-white
                  `}>
                    {selectedAnswer === currentQ.correctAnswer ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Lightbulb className="w-5 h-5" />
                    )}
                    <span className="font-medium">
                      {selectedAnswer === currentQ.correctAnswer ? 'Doğru Cevap! +10 Puan' : 'Öğrenme Fırsatı'}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-white/5 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Açıklama:</h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>

                {/* Continue Button */}
                <div className="text-center">
                  <button
                    onClick={handleContinue}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                  >
                    {isLastQuestion ? 'Tamamla' : 'Sonraki Soru'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestMap;