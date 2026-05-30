import React, { useState } from 'react';
import { Star, MessageCircle, Lock } from 'lucide-react';

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
        بخش نظرسنجی به زودی فعال خواهد شد. در حال حاضر امکان ثبت نظر وجود ندارد.
      </p>
    </div>
  </div>
);

// ==============================
// 🔒 کامپوننت اصلی - قفل شده
// ==============================
const Survey = () => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-4 md:px-0" dir="rtl">
      
      {/* 🔒 بنر هشدار */}
      <LockedBanner />

      {/* 1. Header */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-brand-light flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-right">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center md:justify-start gap-3">
            <MessageCircle className="text-brand" fill="currentColor" fillOpacity={0.1} />
            نظرات و تجربیات بیماران
            <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
              <Lock size={10} /> به زودی
            </span>
          </h2>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            نظرات ارزشمند شما به ما در بهبود کیفیت خدمات کمک می‌کند.<br className="hidden md:block"/>
            تجربه خود را با دیگران به اشتراک بگذارید.
          </p>
        </div>
        
        {/* Average Rating Badge - غیرفعال */}
        <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 flex flex-col items-center min-w-[140px] opacity-50">
          <span className="text-3xl font-black text-gray-400">--</span>
          <div className="flex text-gray-300 my-1 text-xs">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>
          <span className="text-xs text-gray-400">هنوز نظری ثبت نشده</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. فرم ثبت نظر - قفل شده */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-brand/5 border border-brand-light sticky top-24 relative overflow-hidden">
            
            {/* لایه قفل */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center mx-4">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="text-amber-600" size={24} />
                </div>
                <h4 className="font-bold text-amber-800 text-sm mb-1">ثبت نظر غیرفعال است</h4>
                <p className="text-amber-600 text-xs">این قابلیت به زودی فعال می‌شود</p>
              </div>
            </div>

            <h3 className="font-bold text-gray-800 mb-6 text-center">ثبت نظر جدید</h3>
            
            {/* فرم غیرفعال */}
            <div className="space-y-6 opacity-40 pointer-events-none select-none">
              {/* Star Rating */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">امتیاز دهید:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      size={32} 
                      className="text-gray-200"
                    />
                  ))}
                </div>
              </div>

              {/* Comment Text */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 mr-1">متن نظر شما:</label>
                <textarea 
                  disabled
                  rows="5"
                  placeholder="از تجربه ویزیت خود بنویسید..."
                  className="w-full p-4 rounded-2xl bg-gray-100 border border-gray-200 resize-none text-sm cursor-not-allowed"
                ></textarea>
              </div>

              <button 
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                ارسال نظر
              </button>
            </div>
          </div>
        </div>

        {/* 3. لیست نظرات - خالی */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-gray-700 text-lg mb-4 pr-2 border-r-4 border-brand-light">آخرین دیدگاه‌ها</h3>
          
          {/* حالت خالی */}
          <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-dashed border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-gray-300" size={36} />
            </div>
            <h4 className="font-bold text-gray-400 mb-2">هنوز نظری ثبت نشده است</h4>
            <p className="text-gray-300 text-sm">
              پس از فعال‌سازی این بخش، نظرات بیماران اینجا نمایش داده می‌شود
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Survey;