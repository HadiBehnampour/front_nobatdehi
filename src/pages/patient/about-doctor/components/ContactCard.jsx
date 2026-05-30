import { MapPin, Phone } from 'lucide-react';

const ContactCard = ({ type, info }) => {
  if (type === 'address') {
    // استخراج مختصات از mapEmbedUrl برای لینک گوگل مپ
    const getGoogleMapsLink = () => {
      if (info.mapEmbedUrl) {
        // تبدیل لینک embed بلد به لینک بازشدنی
        if (info.mapEmbedUrl.includes('/embed?p=')) {
          const id = info.mapEmbedUrl.split('embed?p=')[1];
          return `https://balad.ir/p/${id}`;
        }
        return info.mapEmbedUrl;
      }

      // fallback
      return 'https://www.google.com/maps/place/35.7654,51.4321';
    };

    return (
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-brand-light hover:shadow-md transition-all group">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <MapPin size={24} />
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-2">آدرس مطب</h3>
        <p className="text-gray-500 text-sm leading-6">
          {info.address || 'در حال بارگذاری...'}
        </p>
        <a 
          href={getGoogleMapsLink()}
          target="_blank" 
          rel="noreferrer"
          className="mt-4 w-full py-2.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-600 hover:text-white transition-colors flex justify-center items-center"
        >
          مسیریابی روی نقشه
        </a>
      </div>
    );
  }

  if (type === 'phone') {
    return (
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-brand-light hover:shadow-md transition-all group">
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Phone size={24} />
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-2">شماره‌های تماس</h3>
        <div className="space-y-3">
          {info.phone ? (
            <a 
              href={`tel:${info.phone}`} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50 hover:text-green-700 transition-colors group/phone"
            >
              <span className="text-gray-600 font-bold dir-ltr">{info.phone}</span>
              <Phone size={16} className="opacity-0 group-hover/phone:opacity-100 transition-opacity" />
            </a>
          ) : (
            <div className="p-3 bg-gray-50 rounded-xl text-gray-400">در حال بارگذاری...</div>
          )}
          
          {info.mobile && (
            <a 
              href={`tel:${info.mobile}`} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50 hover:text-green-700 transition-colors group/phone"
            >
              <span className="text-gray-600 font-bold dir-ltr">{info.mobile}</span>
              <span className="text-xs text-gray-400 font-normal">(موبایل منشی)</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default ContactCard;
