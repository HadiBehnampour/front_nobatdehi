import React, { useState, useEffect } from 'react';
import {
  X, User, Loader2, Save, Calendar
} from 'lucide-react';
import { patientService } from '../../../api/services/patient';
import { useNavigate } from 'react-router-dom';

const PatientInfoModal = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  // Constants for Solar Hijri Date
  const currentYear = 1405;
  const years = Array.from({ length: 121 }, (_, i) => currentYear - i); // 1405 to 1285
  const months = [
    { val: '01', label: 'فروردین' }, { val: '02', label: 'اردیبهشت' },
    { val: '03', label: 'خرداد' }, { val: '04', label: 'تیر' },
    { val: '05', label: 'مرداد' }, { val: '06', label: 'شهریور' },
    { val: '07', label: 'مهر' }, { val: '08', label: 'آبان' },
    { val: '09', label: 'آذر' }, { val: '10', label: 'دی' },
    { val: '11', label: 'بهمن' }, { val: '12', label: 'اسفند' }
  ];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const [formData, setFormData] = useState({
    name: '', nationalId: '', mobile: '', birthDate: '',
    insuranceType: 'none', insuranceCode: '', supplementary: 'none',
    medicalHistory: ''
  });

  // Helper states for split date
  const [dateParts, setDateParts] = useState({ day: '01', month: '01', year: '1370' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await patientService.getProfile();
        setPatient(data);
        
        // Initializing form data
        const initialData = {
          name: data.name || '',
          nationalId: data.nationalId || '',
          mobile: data.mobile || '',
          birthDate: data.birthDate || '1370-01-01',
          insuranceType: data.insuranceType || 'none',
          insuranceCode: data.insuranceCode || '',
          supplementary: data.supplementary || 'none',
          medicalHistory: data.medicalHistory || '',
        };
        setFormData(initialData);

        // Parsing initial birthDate if exists
        if (data.birthDate && data.birthDate.includes('-')) {
          const parts = data.birthDate.split('-');
          setDateParts({
            year: parts[0] || '1370',
            month: parts[1] || '01',
            day: parts[2] || '01'
          });
        }
      } catch (error) {
        console.error('خطا در دریافت پروفایل:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (part, value) => {
    const newParts = { ...dateParts, [part]: value };
    setDateParts(newParts);
    // Combine back to YYYY-MM-DD for formData
    const combinedDate = `${newParts.year}-${newParts.month}-${newParts.day}`;
    setFormData(prev => ({ ...prev, birthDate: combinedDate }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await patientService.updateProfile(formData);
      navigate('/patient/dashboard');
    } catch (error) {
      const errData = error.response?.data;
      if (errData && typeof errData === 'object') {
        const messages = Object.entries(errData)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join('\n');
        alert('❌ خطا:\n' + messages);
      } else {
        alert('خطا در ذخیره اطلاعات');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <User size={20} className="text-blue-600" />
            اطلاعات بیمار
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="pt-5">
          {loading ? (
            <div className="py-16 text-center">
              <Loader2 className="mx-auto animate-spin text-blue-500" size={30} />
              <p className="mt-2 text-gray-400 text-sm">در حال دریافت اطلاعات...</p>
            </div>
          ) : (
            <div className="space-y-5">

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">کد ملی</label>
                  <input
                    type="text"
                    value={formData.nationalId}
                    onChange={(e) => handleChange('nationalId', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">شماره موبایل</label>
                  <input
                    type="text"
                    value={formData.mobile}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Date of Birth Triple Select */}
                <div className="col-span-1">
                   <label className="text-xs text-gray-500 mb-1 block font-medium flex items-center gap-1">
                     <Calendar size={12} /> تاریخ تولد
                   </label>
                   <div className="grid grid-cols-3 gap-2">
                     <select
                       value={dateParts.year}
                       onChange={(e) => handleDateChange('year', e.target.value)}
                       className="border border-gray-200 rounded-xl px-1 py-2 text-sm focus:outline-none focus:border-blue-500 scroll-smooth"
                     >
                       {years.map(y => <option key={y} value={y}>{y}</option>)}
                     </select>
                     <select
                       value={dateParts.month}
                       onChange={(e) => handleDateChange('month', e.target.value)}
                       className="border border-gray-200 rounded-xl px-1 py-2 text-sm focus:outline-none focus:border-blue-500"
                     >
                       {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                     </select>
                     <select
                       value={dateParts.day}
                       onChange={(e) => handleDateChange('day', e.target.value)}
                       className="border border-gray-200 rounded-xl px-1 py-2 text-sm focus:outline-none focus:border-blue-500"
                     >
                       {days.map(d => <option key={d} value={d}>{d}</option>)}
                     </select>
                   </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">نوع بیمه</label>
                  <select
                    value={formData.insuranceType}
                    onChange={(e) => handleChange('insuranceType', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="none">ندارد</option>
                    <option value="tamin">تامین اجتماعی</option>
                    <option value="salamat">سلامت</option>
                    <option value="mosallah">نیروهای مسلح</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">کد بیمه</label>
                  <input
                    type="text"
                    value={formData.insuranceCode}
                    onChange={(e) => handleChange('insuranceCode', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block font-medium">بیمه تکمیلی</label>
                  <select
                    value={formData.supplementary}
                    onChange={(e) => handleChange('supplementary', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="none">ندارد</option>
                    <option value="iran">ایران</option>
                    <option value="asia">آسیا</option>
                    <option value="alborz">البرز</option>
                    <option value="dana">دانا</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block font-medium">سوابق پزشکی (بیماری خاص، حساسیت دارویی و...)</label>
                  <textarea
                    rows="3"
                    value={formData.medicalHistory}
                    onChange={(e) => handleChange('medicalHistory', e.target.value)}
                    placeholder="در صورت داشتن سابقه بیماری یا حساسیت بنویسید..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 text-sm transition-colors"
                >
                  بستن
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 text-sm disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  ذخیره اطلاعات بیمار
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientInfoModal;
