import React, { useMemo, useEffect } from 'react';
import { Scale, Ruler, Save, Loader2, Stethoscope } from 'lucide-react';
import { calcBMI, getBMIColor, getBMIBgColor, getBMILabel } from '../utils/bmi';

const defaultForm = {
  weight: '',
  height: '',
  chiefComplaint: '',
  physicalExam: '',
  diagnosis: '',
  prescription: '',
};

export default function VisitForm({
  initialHeight,
  initialReason,
  form,
  setForm,
  onSubmit,
  saving,
  draftEncounter,
}) {
  useEffect(() => {
    if (draftEncounter) {
      setForm(f => ({
        ...f,
        weight: draftEncounter.weight || f.weight || '',
        height: draftEncounter.height || f.height || '',
        chiefComplaint: draftEncounter.chiefComplaint || f.chiefComplaint || '',
        physicalExam: draftEncounter.physicalExam || f.physicalExam || '',
        diagnosis: draftEncounter.diagnosis || f.diagnosis || '',
        prescription: draftEncounter.prescription || f.prescription || '',
      }));
    } else if (initialReason && !form.chiefComplaint) {
      setForm(f => ({ ...f, chiefComplaint: initialReason }));
    }
  }, [draftEncounter, initialReason]);

  const bmi = useMemo(() => {
    const w = form.weight && Number(form.weight);
    const h = (form.height && Number(form.height)) || (initialHeight && Number(initialHeight));
    if (!w || !h || h <= 0) return null;
    const val = calcBMI(w, h);
    return Number.isFinite(val) ? val : null;
  }, [form.weight, form.height, initialHeight]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
        <Stethoscope size={20} className="text-brand" />
        ثبت ویزیت جاری
        {draftEncounter && (
          <span className="text-xs text-orange-500 font-medium">(پیش‌نویس ذخیره شده)</span>
        )}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* وزن و قد */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
              <Scale size={12} /> وزن (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={form.weight}
              onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
              className="w-full p-3 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-brand text-center"
              placeholder="70"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
              <Ruler size={12} /> قد (cm)
            </label>
            <input
              type="number"
              min="0"
              value={form.height || initialHeight || ''}
              onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
              className="w-full p-3 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-brand text-center"
              placeholder="170"
            />
          </div>
        </div>

        {/* BMI */}
        {bmi != null && (
          <div className={`p-4 rounded-xl text-center ${getBMIBgColor(bmi)} border ${bmi < 25 ? 'border-green-200' : bmi < 30 ? 'border-orange-200' : 'border-red-200'}`}>
            <span className="text-[10px] text-gray-500 block mb-1">شاخص BMI (محاسبه خودکار)</span>
            <span className={`text-2xl font-black ${getBMIColor(bmi)}`}>{bmi}</span>
            <span className={`text-xs block mt-1 ${getBMIColor(bmi)}`}>{getBMILabel(bmi)}</span>
          </div>
        )}

        {/* شکایت اصلی */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400">
            شکایت اصلی
            {initialReason && !draftEncounter && (
              <span className="text-brand mr-2">(از علت مراجعه بیمار پر شده)</span>
            )}
          </label>
          <textarea
            rows={2}
            value={form.chiefComplaint}
            onChange={e => setForm(f => ({ ...f, chiefComplaint: e.target.value }))}
            className="w-full p-3 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-brand resize-none"
            placeholder="شکایت اصلی بیمار..."
          />
        </div>

        {/* معاینات فیزیکی */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400">معاینات فیزیکی</label>
          <textarea
            rows={2}
            value={form.physicalExam}
            onChange={e => setForm(f => ({ ...f, physicalExam: e.target.value }))}
            className="w-full p-3 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-brand resize-none"
            placeholder="مشاهدات بالینی..."
          />
        </div>

        {/* ✅ تشخیص - فیلد جدا */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400">تشخیص</label>
          <textarea
            rows={2}
            value={form.diagnosis}
            onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))}
            className="w-full p-3 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-brand resize-none"
            placeholder="تشخیص پزشک..."
          />
        </div>

        {/* ✅ تجویز - فیلد جدا */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400">تجویز / نسخه</label>
          <textarea
            rows={3}
            value={form.prescription}
            onChange={e => setForm(f => ({ ...f, prescription: e.target.value }))}
            className="w-full p-3 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-brand resize-none"
            placeholder="دستورات دارویی..."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-[1.5rem] font-black text-lg bg-brand text-white shadow-lg hover:bg-brand-dark transition-all flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
          ثبت و ادامه
        </button>
      </form>
    </div>
  );
}

export { defaultForm };