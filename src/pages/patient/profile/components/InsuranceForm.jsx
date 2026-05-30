import { CreditCard } from 'lucide-react';
import { INSURANCE_OPTIONS, SUPPLEMENTARY_OPTIONS } from '../constants/options';

const InsuranceForm = ({ userData, setUserData }) => {
  const handleChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <CreditCard className="text-brand" />
        <h3 className="font-bold text-xl text-gray-800">وضعیت بیمه</h3>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-700 mb-6">
        اطلاعات این بخش برای محاسبه هزینه ویزیت و صدور نسخه الکترونیک استفاده می‌شود.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* بیمه پایه */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600">بیمه پایه</label>
          <select 
            value={userData.insuranceType} 
            onChange={(e) => handleChange('insuranceType', e.target.value)} 
            className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-brand focus:bg-white transition-all outline-none"
          >
            {INSURANCE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* شماره بیمه */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600">شماره دفترچه / بیمه</label>
          <input 
            type="text" 
            value={userData.insuranceCode} 
            onChange={(e) => handleChange('insuranceCode', e.target.value)} 
            className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-brand focus:bg-white transition-all outline-none text-left" 
            dir="ltr" 
          />
        </div>

        {/* بیمه تکمیلی */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600">بیمه تکمیلی</label>
          <select 
            value={userData.supplementary} 
            onChange={(e) => handleChange('supplementary', e.target.value)} 
            className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-brand focus:bg-white transition-all outline-none"
          >
            {SUPPLEMENTARY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
};

export default InsuranceForm;