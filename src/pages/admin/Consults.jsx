import React, { useState } from 'react';
import { 
  MessageSquare, CheckCircle, Clock, X, Send, 
  FileText, Paperclip, ChevronLeft, Lock
} from 'lucide-react';

// ==============================
// 🔒 بنر قفل
// ==============================
const LockedBanner = () => (
  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in">
    <div className="bg-amber-100 p-2.5 rounded-xl">
      <Lock className="text-amber-600" size={20} />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-amber-800 text-sm">این بخش در حال توسعه است</h4>
      <p className="text-amber-600 text-xs mt-0.5">
        بخش مشاوره آنلاین به زودی فعال خواهد شد. در حال حاضر امکان پاسخگویی وجود ندارد.
      </p>
    </div>
  </div>
);

// ==============================
// Mock Data
// ==============================
const MOCK_CONSULTS = {
  pending: [
    {
      id: 1,
      patientName: "علی محمدی",
      date: "1403/10/15",
      time: "14:30",
      subject: "درد مفاصل زانو",
      text: "سلام دکتر. چند هفته‌ای هست که بعد از ورزش زانوهام خیلی درد می‌کنه. صبح‌ها هم موقع بلند شدن از خواب احساس سفتی می‌کنم. آیا نیاز به مراجعه حضوری دارم؟",
      attachment: "MRI_knee.pdf",
      status: "pending",
      reply: null,
    },
    {
      id: 2,
      patientName: "فاطمه رضایی",
      date: "1403/10/14",
      time: "10:15",
      subject: "تمدید نسخه دارو",
      text: "دکتر عزیز، داروی سلکوکسیب که قبلاً تجویز کردید تموم شده. آیا میشه نسخه رو تمدید کنید؟ دردم دوباره شروع شده.",
      attachment: null,
      status: "pending",
      reply: null,
    },
    {
      id: 3,
      patientName: "رضا کریمی",
      date: "1403/10/13",
      time: "09:00",
      subject: "بررسی جواب آزمایش",
      text: "جواب آزمایش خونم اومد. CRP و ESR هر دو بالا هستن. نگران شدم. لطفاً راهنمایی بفرمایید.",
      attachment: "lab_result.jpg",
      status: "pending",
      reply: null,
    },
  ],
  answered: [
    {
      id: 4,
      patientName: "مریم حسینی",
      date: "1403/10/10",
      time: "11:20",
      subject: "درد ستون فقرات",
      text: "دکتر من چند وقته کمر درد دارم. MRI گرفتم فایلش رو ضمیمه کردم.",
      attachment: "spine_mri.pdf",
      status: "answered",
      reply: "سلام. با بررسی فایل MRI ارسالی، دیسک کمری خفیفی مشاهده می‌شود. پیشنهاد می‌کنم فیزیوتراپی را شروع کنید و از بلند کردن اجسام سنگین خودداری نمایید. در صورت تشدید درد حتماً مراجعه حضوری داشته باشید.",
    },
    {
      id: 5,
      patientName: "حسین احمدی",
      date: "1403/10/08",
      time: "16:45",
      subject: "سوال درباره ورزش",
      text: "آیا با وجود آرتروز زانو میتونم پیاده روی کنم؟",
      attachment: null,
      status: "answered",
      reply: "بله، پیاده‌روی سبک در سطوح صاف برای بیماران آرتروز بسیار مفید است. روزانه ۲۰ تا ۳۰ دقیقه پیاده‌روی با کفش مناسب توصیه می‌شود. از پله و سطوح ناهموار تا حد امکان اجتناب کنید.",
    },
  ]
};

const getAvatarColor = (name) => {
  const colors = [
    "bg-pink-100 text-pink-600",
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-yellow-100 text-yellow-600",
    "bg-purple-100 text-purple-600"
  ];
  return colors[name.length % colors.length];
};

// ==============================
// 🔒 کامپوننت اصلی
// ==============================
const AdminConsults = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedConsult, setSelectedConsult] = useState(null);

  const consults = MOCK_CONSULTS[activeTab];

  const openModal = (consult) => setSelectedConsult(consult);
  const closeModal = () => setSelectedConsult(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 text-right" dir="rtl">
      
      {/* 🔒 بنر هشدار */}
      <LockedBanner />

      {/* 1. Header */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="text-brand-dark" />
            مدیریت مشاوره‌ها
            <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
              <Lock size={10} /> به زودی
            </span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">پاسخگویی به سوالات بیماران</p>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 p-1.5 rounded-xl flex">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'pending' ? 'bg-white text-brand shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Clock size={16} />
            منتظر پاسخ
            <span className="bg-red-100 text-red-500 text-[10px] font-black px-1.5 py-0.5 rounded-md">
              {MOCK_CONSULTS.pending.length}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('answered')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'answered' ? 'bg-white text-brand shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <CheckCircle size={16} />
            آرشیو پاسخ‌ها
          </button>
        </div>
      </div>

      {/* 2. List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consults.map((consult) => (
          <div 
            key={consult.id} 
            onClick={() => openModal(consult)}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-brand-light hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
          >
            {/* Header Card */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getAvatarColor(consult.patientName)}`}>
                  {consult.patientName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{consult.patientName}</h4>
                  <span className="text-xs text-gray-400">{consult.date} | {consult.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* 🔒 بج نمونه */}
                <span className="bg-gray-100 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Lock size={8} /> نمونه
                </span>
                {activeTab === 'pending' && (
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </div>
            </div>
            
            {/* Body Card */}
            <div className="flex-1">
              <h5 className="font-bold text-gray-700 mb-2 text-sm truncate">{consult.subject}</h5>
              <p className="text-gray-500 text-xs leading-6 line-clamp-3">{consult.text}</p>
            </div>

            {/* Footer Card */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
              {consult.attachment ? (
                <span className="text-xs text-brand font-bold flex items-center gap-1 bg-brand-light/20 px-2 py-1 rounded-lg">
                  <Paperclip size={12} /> پیوست دارد
                </span>
              ) : (
                <span className="text-xs text-gray-300">بدون پیوست</span>
              )}
              <button className="text-xs font-bold text-gray-400 group-hover:text-brand flex items-center gap-1 transition-colors">
                {activeTab === 'pending' ? 'مشاهده' : 'مشاهده گفتگو'}
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Modal - فقط نمایشی */}
      {selectedConsult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl p-6 relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getAvatarColor(selectedConsult.patientName)}`}>
                  {selectedConsult.patientName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{selectedConsult.patientName}</h3>
                  <span className="text-xs text-gray-400">{selectedConsult.subject}</span>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-6 px-2 mb-6">
              
              {/* Patient Message */}
              <div className="bg-gray-50 p-4 rounded-2xl rounded-tr-none border border-gray-100 mr-8">
                <p className="text-gray-700 text-sm leading-7">{selectedConsult.text}</p>
                {selectedConsult.attachment && (
                  <div className="mt-3 flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-200 w-fit">
                    <FileText size={18} className="text-red-500" />
                    <span className="text-xs font-bold">{selectedConsult.attachment}</span>
                  </div>
                )}
                <span className="text-[10px] text-gray-400 mt-2 block text-left">{selectedConsult.time}</span>
              </div>

              {/* Doctor Reply */}
              {selectedConsult.reply && (
                <div className="bg-brand-light/20 p-4 rounded-2xl rounded-tl-none border border-brand/10 ml-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs">Dr</span>
                    <span className="text-xs font-bold text-brand-dark">پاسخ شما:</span>
                  </div>
                  <p className="text-gray-800 text-sm leading-7">{selectedConsult.reply}</p>
                </div>
              )}
            </div>

            {/* 🔒 بخش پاسخ - قفل شده */}
            {activeTab === 'pending' ? (
              <div className="relative">
                {/* textarea غیرفعال */}
                <div className="pointer-events-none opacity-50">
                  <textarea 
                    disabled
                    placeholder="متن پاسخ خود را بنویسید..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pl-14 min-h-[100px] text-sm resize-none cursor-not-allowed"
                  ></textarea>
                </div>
                {/* دکمه قفل */}
                <div className="absolute bottom-4 left-4 bg-gray-300 text-gray-500 p-2 rounded-xl cursor-not-allowed">
                  <Lock size={20} />
                </div>
                {/* پیام قفل */}
                <p className="text-center text-xs text-amber-600 font-bold mt-2 flex items-center justify-center gap-1">
                  <Lock size={10} /> امکان پاسخگویی به زودی فعال می‌شود
                </p>
              </div>
            ) : (
              <div className="bg-green-50 text-green-700 p-3 rounded-xl text-center text-sm font-bold border border-green-100 flex items-center justify-center gap-2">
                <CheckCircle size={18} />
                این پیام قبلاً پاسخ داده شده است.
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminConsults;