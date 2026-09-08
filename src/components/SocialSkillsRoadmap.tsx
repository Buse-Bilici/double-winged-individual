import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Lock, Circle, Star, Clock, Users, Target, Heart, Award } from 'lucide-react';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  locked: boolean;
  theme: string;
  icon: React.ReactNode;
  position: 'left' | 'right';
}

interface SocialSkillsRoadmapProps {
  onBack: () => void;
  onStepSelect: (stepId: string) => void;
}

const SocialSkillsRoadmap: React.FC<SocialSkillsRoadmapProps> = ({ onBack, onStepSelect }) => {
  const [steps, setSteps] = useState<RoadmapStep[]>([
    {
      id: 'quest-map',
      title: 'Quest Map',
      description: '3 empati sorusu ile yolculuğa başla',
      points: 30,
      completed: false,
      locked: false,
      theme: 'bg-blue-500',
      icon: <Target className="w-6 h-6" />,
      position: 'right'
    },
    {
      id: 'role-arena',
      title: 'Role Arena',
      description: 'Kriz senaryosu değerlendirmesi',
      points: 0, // Empati + Liderlik puanı
      completed: false,
      locked: true,
      theme: 'bg-purple-500',
      icon: <Users className="w-6 h-6" />,
      position: 'left'
    },
    {
      id: 'escape-room',
      title: 'Escape Room',
      description: '60 saniye empati cümlesi challenge',
      points: 40,
      completed: false,
      locked: true,
      theme: 'bg-orange-500',
      icon: <Clock className="w-6 h-6" />,
      position: 'right'
    },
    {
      id: 'mission-wall',
      title: 'Mission Wall',
      description: 'İlham kartı paylaşımı',
      points: 10,
      completed: false,
      locked: true,
      theme: 'bg-pink-500',
      icon: <Heart className="w-6 h-6" />,
      position: 'left'
    },
    {
      id: 'future-promise',
      title: 'Gelecek Sözü',
      description: 'Taahhüt verme sistemi',
      points: 0,
      completed: false,
      locked: true,
      theme: 'bg-green-500',
      icon: <Award className="w-6 h-6" />,
      position: 'right'
    }
  ]);

  const totalPoints = steps.reduce((sum, step) => sum + (step.completed ? step.points : 0), 0);
  const completedSteps = steps.filter(step => step.completed).length;

  const handleStepClick = (step: RoadmapStep) => {
    if (!step.locked) {
      onStepSelect(step.id);
    }
  };

  const getStepStatus = (step: RoadmapStep) => {
    if (step.completed) return { icon: <CheckCircle className="w-8 h-8 text-green-500" />, bg: 'bg-green-100' };
    if (step.locked) return { icon: <Lock className="w-8 h-8 text-gray-400" />, bg: 'bg-gray-100' };
    return { icon: <Circle className="w-8 h-8 text-pink-500" />, bg: 'bg-pink-100' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Magical Background */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-float-particle opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Glowing orbs */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-glow-orb blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${4 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Geri Dön</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white magical-text mb-2">
              Ahlaki Sorumluluk Yolculuğu
            </h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>{totalPoints} Puan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>{completedSteps}/5 Tamamlandı</span>
              </div>
            </div>
          </div>
          
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-1000 ease-out"
              style={{ width: `${(completedSteps / 5) * 100}%` }}
            />
          </div>
          <p className="text-center text-white/80 mt-2 text-sm">
            {completedSteps === 5 ? 'Tebrikler! Yolculuğu tamamladın!' : `${5 - completedSteps} adım kaldı`}
          </p>
        </div>

        {/* Roadmap */}
        <div className="max-w-4xl mx-auto relative">
          {/* Central Path */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-yellow-400 via-pink-400 to-green-400 h-full opacity-60" />
          
          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step, index) => {
              const status = getStepStatus(step);
              const isLeft = step.position === 'left';
              
              return (
                <div key={step.id} className="relative">
                  {/* Step Number Circle */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                    <div className={`w-16 h-16 rounded-full ${status.bg} border-4 border-white flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl font-bold text-gray-700">{index + 1}</span>
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-80 ${isLeft ? 'mr-24' : 'ml-24'}`}>
                      <div
                        onClick={() => handleStepClick(step)}
                        className={`
                          relative p-6 rounded-2xl shadow-xl backdrop-blur-lg border border-white/20
                          ${step.locked 
                            ? 'bg-gray-800/50 cursor-not-allowed' 
                            : step.completed 
                              ? 'bg-green-800/50 cursor-pointer hover:bg-green-700/50' 
                              : 'bg-white/10 cursor-pointer hover:bg-white/20'
                          }
                          transition-all duration-300 transform hover:scale-105
                        `}
                      >
                        {/* Theme Color Bar */}
                        <div className={`absolute top-0 left-0 right-0 h-2 ${step.theme} rounded-t-2xl`} />
                        
                        {/* Status Icon */}
                        <div className="absolute -top-2 -right-2">
                          {status.icon}
                        </div>
                        
                        {/* Content */}
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${step.theme} text-white`}>
                            {step.icon}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-white/80 text-sm mb-3">{step.description}</p>
                            
                            {step.points > 0 && (
                              <div className="flex items-center gap-2 text-yellow-400">
                                <Star className="w-4 h-4" />
                                <span className="text-sm font-medium">{step.points} Puan</span>
                              </div>
                            )}
                            
                            {step.id === 'role-arena' && (
                              <div className="text-purple-300 text-sm">
                                Empati + Liderlik puanı
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Zigzag Arrow */}
                        {index < steps.length - 1 && (
                          <div className={`absolute top-full ${isLeft ? 'right-0' : 'left-0'} transform ${isLeft ? 'translate-x-8' : '-translate-x-8'} translate-y-4`}>
                            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/40" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Message */}
        {completedSteps === 5 && (
          <div className="max-w-2xl mx-auto mt-16 p-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-white/20 backdrop-blur-lg text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4 magical-text">
              Muhteşem! Yolculuğu Tamamladın!
            </h2>
            <p className="text-white/80 text-lg mb-6">
              Ahlaki sorumluluk yolculuğunda tüm adımları başarıyla tamamladın. 
              Artık gerçek bir sosyal lider olma yolunda önemli bir mesafe kat ettin!
            </p>
            <div className="flex items-center justify-center gap-4 text-yellow-400">
              <Star className="w-8 h-8" />
              <span className="text-2xl font-bold">{totalPoints} Toplam Puan</span>
              <Star className="w-8 h-8" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialSkillsRoadmap;