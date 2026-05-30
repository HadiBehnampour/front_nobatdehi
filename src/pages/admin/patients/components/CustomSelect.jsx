import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ value, onChange, options, placeholder, className }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white cursor-pointer focus:outline-none focus:border-brand text-sm flex justify-between items-center"
      >
        <span className={`${!value ? 'text-gray-400' : 'text-gray-800'}`}>
          {selectedLabel}
        </span>
        <span className="text-gray-400 text-xs">▾</span>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto animate-in fade-in">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange({ target: { value: opt.value } });
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                value === opt.value ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;