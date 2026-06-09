import React, { useState, useEffect } from 'react';
import { Users, Plus, Stethoscope, User, X, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import apiClient from '../../../api/core';

const ROLE_LABELS = { doctor: 'پزشک', secretary: 'منشی' };
const ROLE_COLORS = { doctor: 'bg-blue-100 text-blue-700', secretary: 'bg-green-100 text-green-700' };

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ full_name: '', mobile: '', role: 'secretary' });
  const [saving, setSaving] = useState(false);

  const fetchStaff = () => {
    setLoading(true);
    apiClient.get('/platform/staff/')
      .then(r => setStaff(r.data || []))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAdd = async () => {
    if (!form.full_name || !form.mobile) { alert('نام و شماره الزامی است'); return; }
    setSaving(true);
    try {
      await apiClient.post('/platform/staff/', form);
      setShowAdd(false);
      setForm({ full_name: '', mobile: '', role: 'secretary' });
      fetchStaff();
    } catch (e) { alert(e?.response?.data?.error || 'خطا'); }
    finally { setSaving(false); }
  };

  const toggleActive = async (id) => {
    try {
      await apiClient.patch(`/platform/staff/${id}/toggle/`);
      fetchStaff();
    } catch (e) { alert(e?.response?.data?.error || 'خطا'); }
  };

  const doctors = staff.filter(s => s.role === 'doctor');
  const secretaries = staff.filter(s => s.role === 'secretary');

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت پرسنل</h1>
          <p className="text-sm text-gray-500 mt-1">مدیریت پزشکان و منشی‌های مطب</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark">
          <Plus size={16} />افزودن پرسنل
        </button>
      </div>

      {/* خلاصه */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Stethoscope size={22} className="text-blue-600" /></div>
          <div><p className="text-2xl font-bold text-gray-800">{doctors.filter(d => d.is_active).length}</p><p className="text-xs text-gray-500">پزشک فعال</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><User size={22} className="text-green-600" /></div>
          <div><p className="text-2xl font-bold text-gray-800">{secretaries.filter(s => s.is_active).length}</p><p className="text-xs text-gray-500">منشی فعال</p></div>
        </div>
      </div>

      {/* لیست */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand" size={28} /></div>
        ) : staff.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">هنوز پرسنلی ثبت نشده</p>
            <p className="text-xs mt-1">از دکمه «افزودن پرسنل» استفاده کنید</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-xs text-gray-500">
              <th className="text-right px-4 py-3">نام</th>
              <th className="text-right px-4 py-3">موبایل</th>
              <th className="text-center px-4 py-3">نقش</th>
              <th className="text-center px-4 py-3">وضعیت</th>
            </tr></thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-800">{s.full_name}</td>
                  <td className="px-4 py-3 font-mono text-gray-500 text-xs" dir="ltr">{s.mobile}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${ROLE_COLORS[s.role] || 'bg-gray-100'}`}>
                      {ROLE_LABELS[s.role] || s.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(s.id)} className="text-gray-400 hover:text-gray-600">
                      {s.is_active ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} className="text-gray-300" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* مودال افزودن */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><Plus size={18} className="text-brand" />افزودن پرسنل</h3>
              <button onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">نام و نام خانوادگی *</label>
                <input value={form.full_name} onChange={e => setForm(p => ({...p, full_name: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/20" placeholder="مثال: دکتر احمدی" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">شماره موبایل *</label>
                <input dir="ltr" value={form.mobile} onChange={e => setForm(p => ({...p, mobile: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/20" placeholder="09123456789" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">نقش</label>
                <select value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/20">
                  <option value="doctor">پزشک</option>
                  <option value="secretary">منشی</option>
                </select>
              </div>
              <button onClick={handleAdd} disabled={saving}
                className="w-full py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand-dark disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                ثبت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
