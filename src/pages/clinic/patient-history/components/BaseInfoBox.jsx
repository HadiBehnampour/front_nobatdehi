import React from 'react';
import { ClipboardList, Droplets, AlertTriangle, Heart, Save, Loader2, Pill } from 'lucide-react';

export default function BaseInfoBox({
  clinical,
  setClinical,
  isEditing,
  onEdit,
  onSave,
  saving,
}) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="text-brand" size={20} /> اطلاعات پایه
        </h3>

        {isEditing ? (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1 text-xs font-bold text-white bg-brand-dark px-3 py-1.5 rounded-lg hover:bg-black disabled:opacity-70"
          >
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            ذخیره
          </button>
        ) : (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-bold text-brand hover:underline"
          >
            ویرایش
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="rounded-xl border border-gray-200 border-t-[4px] border-[#E53935] bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-2 text-[#E53935]">
            <Droplets size={14} />
            <span className="text-xs font-semibold">گروه خونی</span>
          </div>

          {isEditing ? (
            <select
              value={clinical.bloodType}
              onChange={e => setClinical(c => ({ ...c, bloodType: e.target.value }))}
              className="w-full p-3 rounded-xl text-sm border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <option value="">انتخاب کنید</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          ) : (
            <p className="text-sm font-bold text-gray-800 text-center">
              {clinical.bloodType || '---'}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 border-t-[4px] border-[#00897B] bg-teal-50 p-4">
          <div className="flex items-center gap-2 mb-2 text-[#00897B]">
            <Heart size={14} />
            <span className="text-xs font-semibold">سوابق جراحی</span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={clinical.surgeryHistory}
                  onChange={e => setClinical(c => ({ ...c, surgeryHistory: e.target.checked }))}
                />
                دارای سابقه جراحی هستم
              </label>

              {clinical.surgeryHistory && (
                <>
                  <input
                    value={clinical.surgeryType}
                    onChange={e => setClinical(c => ({ ...c, surgeryType: e.target.value }))}
                    className="w-full p-3 rounded-xl text-sm border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    placeholder="نوع جراحی"
                  />

                  <label className="flex items-center gap-2 text-[13px] leading-tight">
                    <input
                      type="checkbox"
                      checked={!!clinical.surgeryProsthesis}
                      onChange={e =>
                        setClinical(c => ({ ...c, surgeryProsthesis: e.target.checked }))
                      }
                    />
                    آیا عمل پروتز یا پلاتین داشته‌اید؟
                  </label>
                </>
              )}
            </div>
          ) : (
            <div className="text-sm font-bold text-gray-800">
		      {clinical.surgeryHistory ? (
		        <div className="space-y-1">
		          {clinical.surgeryType && <div>{clinical.surgeryType}</div>}
		          {clinical.surgeryProsthesis && (
		            <div className="text-[11px] text-red-600 font-medium">
		              دارای عمل پروتز / پلاتین
		            </div>
		          )}
		          {!clinical.surgeryType && !clinical.surgeryProsthesis && <span>دارای سابقه جراحی</span>}
		        </div>
		      ) : (
		        'خیر'
		      )}
		    </div>

          )}
        </div>

        <div className="rounded-xl border border-gray-200 border-t-[4px] border-[#FB8C00] bg-orange-50 p-4">
          <div className="flex items-center gap-2 mb-2 text-[#FB8C00]">
            <ClipboardList size={14} />
            <span className="text-xs font-semibold">بیماری‌های زمینه‌ای</span>
          </div>

          {isEditing ? (
            <textarea
              value={clinical.chronicDiseases}
              onChange={e => setClinical(c => ({ ...c, chronicDiseases: e.target.value }))}
              className="w-full p-3 rounded-xl text-sm border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
              rows="2"
              placeholder="دیابت، فشار خون و..."
            />
          ) : (
            <p className="text-sm font-bold text-gray-800">
              {clinical.chronicDiseases || '---'}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 border-t-[4px] border-[#3949AB] bg-indigo-50 p-4">
          <div className="flex items-center gap-2 mb-2 text-[#3949AB]">
            <Pill size={14} />
            <span className="text-xs font-semibold">داروهای مصرفی</span>
          </div>

          {isEditing ? (
            <textarea
              value={clinical.medications}
              onChange={e => setClinical(c => ({ ...c, medications: e.target.value }))}
              className="w-full p-3 rounded-xl text-sm border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              rows="2"
              placeholder="نام داروها..."
            />
          ) : (
            <p className="text-sm font-bold text-gray-800">
              {clinical.medications || '---'}
            </p>
          )}
        </div>

        <div className="md:col-span-2 rounded-xl border border-gray-200 border-t-[4px] border-[#E53935] bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-2 text-[#E53935]">
            <AlertTriangle size={14} />
            <span className="text-xs font-semibold">حساسیت‌ها</span>
          </div>

          {isEditing ? (
            <textarea
              value={clinical.allergies}
              onChange={e => setClinical(c => ({ ...c, allergies: e.target.value }))}
              className="w-full p-3 rounded-xl text-sm border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
              rows="2"
              placeholder="دارویی، غذایی و..."
            />
          ) : (
            <p className="text-sm font-bold text-gray-800">
              {clinical.allergies || 'ندارد'}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
