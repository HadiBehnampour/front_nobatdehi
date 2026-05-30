import { Instagram, Send, Mail } from 'lucide-react';

const SocialMediaCard = ({ socialLinks }) => {
  const socialItems = [
    { key: 'instagram', icon: Instagram, hoverColor: 'hover:text-pink-600' },
    { key: 'telegram', icon: Send, hoverColor: 'hover:text-blue-500' },
    { key: 'email', icon: Mail, hoverColor: 'hover:text-red-500' }
  ];

  return (
    <div className="bg-brand text-white rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
      
      <h3 className="font-bold text-xl mb-6 z-10">
        ما را در شبکه‌های اجتماعی دنبال کنید
      </h3>
      
      <div className="flex gap-4 z-10">
        {socialItems.map(({ key, icon: Icon, hoverColor }) => (
          <a 
            key={key}
            href={socialLinks?.[key] || '#'} 
            className={`w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white ${hoverColor} transition-all border border-white/30`}
          >
            <Icon size={28} />
          </a>
        ))}
      </div>
      
      <p className="mt-6 text-sm opacity-80 z-10">
        مشاهده نمونه درمان‌ها و ویدیوهای آموزشی در اینستاگرام
      </p>
    </div>
  );
};

export default SocialMediaCard;