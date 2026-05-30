import React, { useState } from 'react';
import { 
  MessageSquare, Paperclip, Send, FileText, CheckCircle, Clock, 
  X, ChevronDown, ChevronUp, CreditCard, Lock
} from 'lucide-react';

// ==============================
// 🔒 بنر قفل - نمایش در بالای صفحه
// ==============================
const LockedBanner = () => (
  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in">
    <div className="bg-amber-100 p-2.5 rounded-xl">
      <Lock className="text-amber-600" size={20} />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-amber-800 text-sm">این بخش در حال توسعه است</h4>
      <p className="text-amber-600 text-xs mt-0.5">
        بخش مشاوره آنلاین به زودی فعال خواهد شد. در حال حاضر امکان ارسال درخواست وجود ندارد.
      </p>
    </div>
  </div>
);

// ==============================
// 🔒 دکمه غیرفعال با قفل
// ==============================
const LockedButton = ({ children, className = '' }) => (
  <div className="relative group">
    <button 
      disabled 
      className={`w-full bg-gray-300 text-gray-500 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 cursor-not-allowed ${className}`}
    >
      <Lock size={18} />
      {children}
    </button>
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      این قابلیت به زودی فعال می‌شود
    </div>
  </div>
);

// ==============================
// Mock Data ثابت برای تاریخچه
// ==============================
const MOCK_HISTORY = [
  {
    id: 1,
    subject: "درد زانو بعد از ورزش",
    date: "1403/10/10",
    status: "answered",
    question: "بعد از دویدن زانو درد شدید دارم...",
    doctorNote: "سلام وقت بخیر. با توجه به علائمی که گفتید احتمال کشیدگی تاندون وجود دارد. پیشنهاد می‌کنم دو هفته استراحت کنید و از کمپرس یخ استفاده نمایید.",
  },
  {
    id: 2,
    subject: "تفسیر جواب MRI",
    date: "1403/09/25",
    status: "pending",
    question: "لطفا فایل ضمیمه را بررسی کنید.",
    doctorNote: null,
  }
];

// ==============================
// 🔒 کامپوننت اصلی - حالت قفل شده
// ==============================
const Consult = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-10 px-4 md:px-0" dir="rtl">
      
      {/* 🔒 بنر هشدار قفل */}
      <LockedBanner />

      {/* 1. Header & Tabs */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-brand-light flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="text-brand" />
            مشاوره متنی آنلاین
            <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
              <Lock size={10} /> به زودی
            </span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">مشکلات خود را مطرح کنید</p>
        </div>

        <div className="bg-gray-50 p-1.5 rounded-2xl border border-gray-100 flex">
          <button 
            onClick={() => setActiveTab('new')} 
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'new' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-500 hover:text-brand'}`}
          >
            <Send size={16} /> درخواست جدید
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'history' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-500 hover:text-brand'}`}
          >
            <FileText size={16} /> تاریخچه
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Main Area */}
        <div className="lg:col-span-2">
          {activeTab === 'new' ? (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-brand-light relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand opacity-5 rounded-bl-full -mr-10 -mt-10"></div>
              
              {/* 🔒 فرم فقط نمایشی - همه inputها disabled */}
              <div className="space-y-6 relative z-10 opacity-60 pointer-events-none select-none">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">موضوع مشاوره</label>
                  <select 
                    disabled
                    defaultValue="درد مفاصل و استخوان"
                    className="w-full p-4 rounded-2xl bg-gray-100 border border-gray-200 text-gray-400 appearance-none cursor-not-allowed"
                  >
                    <option>درد مفاصل و استخوان</option>
                    <option>بررسی آزمایش و عکس</option>
                    <option>تمدید نسخه دارو</option>
                    <option>سایر موارد</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">شرح سوال</label>
                  <textarea 
                    disabled
                    rows="6" 
                    placeholder="لطفاً شرح حال خود را اینجا بنویسید..." 
                    className="w-full p-4 rounded-2xl bg-gray-100 border border-gray-200 resize-none cursor-not-allowed text-gray-400"
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">پیوست آزمایش یا عکس (اختیاری)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50">
                    <Paperclip className="text-gray-300 mb-2" />
                    <span className="text-xs text-gray-300">آپلود فایل غیرفعال است</span>
                  </div>
                </div>
              </div>

              {/* 🔒 دکمه قفل شده */}
              <div className="mt-6 relative z-10">
                <LockedButton>
                  غیرفعال — به زودی فعال می‌شود
                </LockedButton>
              </div>
            </div>
          ) : (
            /* تاریخچه - فقط نمایشی با داده‌های Mock */
            <div className="space-y-4">
              {MOCK_HISTORY.map(item => {
                const isExpanded = expandedId === item.id;
                return (
                  <div key={item.id} className={`bg-white rounded-[2rem] p-6 shadow-sm border transition-all ${isExpanded ? 'border-brand shadow-md' : 'border-brand-light hover:shadow-md'}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">{item.subject}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={12} /> {item.date}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${item.status === 'answered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                            {item.status === 'answered' ? 'پاسخ داده شده' : 'در انتظار بررسی'}
                          </span>
                          <span className="bg-gray-100 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <Lock size={8} /> نمونه
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleExpand(item.id)} 
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${isExpanded ? 'bg-brand-light text-brand hover:bg-brand hover:text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {isExpanded ? 'بستن' : 'مشاهده جزئیات'}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="mt-6 animate-in slide-in-from-top-2 duration-300 space-y-4 border-t border-gray-100 pt-4">
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <span className="font-bold text-gray-800 block text-xs mb-2">سوال شما:</span>
                          <p className="text-gray-600 text-sm leading-6">{item.question}</p>
                        </div>
                        
                        {item.status === 'answered' ? (
                          <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                            <div className="flex gap-3">
                              <div className="w-10 h-10 rounded-full bg-white border border-green-200 flex items-center justify-center shrink-0 text-xl">👨‍⚕️</div>
                              <div>
                                <span className="font-bold text-green-800 block text-sm mb-1">پاسخ دکتر یوسفی:</span>
                                <p className="text-gray-700 text-sm leading-7 text-justify">{item.doctorNote}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-xs text-gray-400 py-2">
                            هنوز پاسخی ثبت نشده است. لطفاً منتظر بمانید.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-brand-light">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 text-sm">شرایط استفاده</h3>
            <ul className="space-y-4 text-xs text-gray-500">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-brand shrink-0" /> 
                پاسخگویی نهایتاً تا ۲۴ ساعت انجام می‌شود.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-brand shrink-0" /> 
                در صورت نیاز به معاینه حضوری، بیمار مطلع خواهد شد.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consult;