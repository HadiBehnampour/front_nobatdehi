const MapSection = ({ embedUrl, address }) => {
  return (
    <div className="bg-gray-200 rounded-[2.5rem] overflow-hidden min-h-[300px] relative shadow-inner group">
      <iframe 
        src={embedUrl}
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`نقشه ${address}`}
        className="absolute inset-0 w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
      />
      
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold shadow-md">
        📍 موقعیت دقیق مطب روی نقشه
      </div>
    </div>
  );
};

export default MapSection;