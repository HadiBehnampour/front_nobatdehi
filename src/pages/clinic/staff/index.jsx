import React, { useState, useEffect } from "react";
import { Users, Plus, Stethoscope, User, X, Loader2, ShieldCheck, Key, Save, ToggleLeft, ToggleRight, ArrowRight, Shield, AlertCircle, Award, Percent, Info, MapPin, Edit2 } from "lucide-react";
import apiClient from "../../../api/core";
import Badge from "../../../components/ui/Badge";

const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);

const ROLE_LABELS = { doctor: "پزشک", secretary: "منشی" };
const ROLE_COLORS = { doctor: "bg-blue-50 text-blue-700 border border-blue-100", secretary: "bg-green-50 text-green-700 border border-green-100" };

// لیست صفحات پنل منشی جهت اختصاص دسترسی گرانولار (شبیه ادمین جنگو)
const SECRETARY_PAGES = [
  { id: "dashboard", label: "میز کار و داشبورد مطب", actions: [
    { id: "view", label: "مشاهده داشبورد" },
    { id: "logs", label: "مشاهده لاگ سیستم" }
  ]},
  { id: "appointments", label: "تقویم و مدیریت نوبت‌ها", actions: [
    { id: "view", label: "مشاهده تقویم نوبت‌دهی" },
    { id: "create", label: "ثبت و رزرو نوبت جدید" },
    { id: "cancel", label: "کنسل و لغو کردن نوبت" },
    { id: "settings", label: "تغییر شیفت و ساعات کاری پزشکان" }
  ]},
  { id: "patients", label: "بانک اطلاعات و پرونده بیماران", actions: [
    { id: "view", label: "مشاهده لیست بیماران" },
    { id: "history", label: "مشاهده پرونده بالینی و درمانی" },
    { id: "edit", label: "🔐 ویرایش پرونده سلامت بالینی (تخصصی)" }
  ]},
  { id: "financials", label: "امور مالی کلینیک", actions: [
    { id: "view", label: "مشاهده سود، درآمد و تراکنش‌ها" },
    { id: "expenses", label: "ثبت و مدیریت هزینه‌های جاری" }
  ]}
];

const DEFAULT_PERMISSIONS = {
  secretary: {
    dashboard: { view: true, logs: false },
    appointments: { view: true, create: true, cancel: true, settings: false },
    patients: { view: true, history: true, edit: false },
    financials: { view: false, expenses: false }
  },
  doctor: {}
};

export default function StaffManagement() {
  const [view, setView] = useState("list"); // "list" | "form"
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); // پرسنل در حال ویرایش

  // استیت فرم سازنده پرسنل (پزشک / منشی)
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    nationalId: "",
    role: "secretary",
    medicalCode: "",
    feePercent: 70,
    permissions: {
      dashboard: { view: true, logs: false },
      appointments: { view: true, create: true, cancel: true, settings: false },
      patients: { view: true, history: true, edit: false },
      financials: { view: false, expenses: false }
    }
  });

  const [permissionsState, setPermissionsState] = useState({});

  const fetchStaff = () => {
    setLoading(true);
    apiClient.get("/platform/staff/")
      .then(r => {
        const staffData = r.data || [];
        setStaff(staffData);
        
        // همگام‌سازی و تولید پرمیشن‌های پیش‌فرض در استیت فرانت‌اند
        const initialPerms = {};
        staffData.forEach(s => {
          initialPerms[s.id] = s.permissions || DEFAULT_PERMISSIONS[s.role] || DEFAULT_PERMISSIONS.secretary;
        });
        setPermissionsState(initialPerms);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAddSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.fullName || !form.mobile || !form.nationalId) { 
      alert("پر کردن فیلدهای ستاره‌دار الزامی است"); 
      return; 
    }
    
    setSaving(true);
    try {
      const payload = {
        full_name: form.fullName,
        mobile: form.mobile,
        national_id: form.nationalId,
        role: form.role,
        medical_code: form.role === "doctor" ? form.medicalCode : "",
        fee_percent: form.role === "doctor" ? form.feePercent : null,
        permissions: form.role === "secretary" ? form.permissions : null
      };

      if (editingStaff) {
        // ۱. درخواست PUT ویرایش مشخصات به آدرس تفصیلی ادمین مطب
        await apiClient.put(`/platform/staff/${editingStaff.id}/`, payload);
      } else {
        // ۲. درخواست POST ایجاد پرسنل جدید
        await apiClient.post("/platform/staff/", payload);
      }
      
      // بازگشت به لیست و ریست فرم
      setView("list");
      setEditingStaff(null);
      setForm({
        fullName: "",
        mobile: "",
        nationalId: "",
        role: "secretary",
        medicalCode: "",
        feePercent: 70,
        permissions: {
          dashboard: { view: true, logs: false },
          appointments: { view: true, create: true, cancel: true, settings: false },
          patients: { view: true, history: true, edit: false },
          financials: { view: false, expenses: false }
        }
      });
      fetchStaff();
    } catch (e) { 
      alert(e?.response?.data?.error || "خطا در ثبت اطلاعات پرسنل"); 
    } finally { 
      setSaving(false); 
    }
  };

  const toggleActive = async (id) => {
    try {
      await apiClient.patch(`/platform/staff/${id}/toggle/`);
      fetchStaff();
    } catch (e) { alert(e?.response?.data?.error || "خطا"); }
  };

  // هندلر کلیک دکمه ویرایش و پایش پرسنل
  const handleOpenEdit = (member) => {
    setEditingStaff(member);
    setForm({
      fullName: member.full_name || "",
      mobile: member.mobile || "",
      nationalId: member.national_id || "",
      role: member.role || "secretary",
      medicalCode: member.medical_code || "",
      feePercent: member.fee_percent || 70,
      permissions: permissionsState[member.id] || DEFAULT_PERMISSIONS[member.role] || DEFAULT_PERMISSIONS.secretary
    });
    setView("form");
  };

  // سوئیچ کردن پرمیشن تکی منشی
  const handleTogglePermission = (pageId, actionId) => {
    setForm(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [pageId]: {
          ...prev.permissions[pageId],
          [actionId]: !prev.permissions[pageId]?.[actionId]
        }
      }
    }));
  };

  // سوئیچ کردن کل پرمیشن‌های یک صفحه منشی
  const handleToggleWholePage = (pageId, checked) => {
    setForm(prev => {
      const updatedPagePerms = {};
      const pageInfo = SECRETARY_PAGES.find(p => p.id === pageId);
      if (pageInfo) {
        pageInfo.actions.forEach(act => {
          updatedPagePerms[act.id] = checked;
        });
      }
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [pageId]: updatedPagePerms
        }
      };
    });
  };

  const doctors = staff.filter(s => s.role === "doctor");
  const secretaries = staff.filter(s => s.role === "secretary");

  return (
    <div className="space-y-6 fade-in text-right" dir="rtl">
      
      {/* ─── حالت ۱: لیست پرسنل و خلاصه وضعیت ─────────────────────────────────── */}
      {view === "list" && (
        <>
          {/* هدر صفحه */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">مدیریت پرسنل و دسترسی‌ها</h1>
              <p className="text-xs text-slate-500 mt-1">تعریف پرسنل جدید، کنترل گرانولار (دقیق) سطوح دسترسی پزشکان و منشی‌های مطب</p>
            </div>
            <button 
              onClick={() => { setEditingStaff(null); setView("form"); }} 
              className="btn-primary py-3 px-5 shadow-md shadow-primary-100 rounded-xl text-xs font-bold shrink-0"
            >
              <Plus size={16} /> افزودن پرسنل جدید
            </button>
          </div>

          {/* خلاصه پرسنل مطب */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Stethoscope size={22} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{fmt(doctors.filter(d => d.is_active).length)}</p>
                <p className="text-xs font-bold text-slate-400">پزشک فعال هم‌اکنون در مطب</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                <User size={22} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{fmt(secretaries.filter(s => s.is_active).length)}</p>
                <p className="text-xs font-bold text-slate-400">منشی فعال در نوبت‌دهی</p>
              </div>
            </div>
          </div>

          {/* جدول پرسنل مطب */}
          <div className="table-container border-slate-100 shadow-xl shadow-slate-100/40">
            {loading ? (
              <div className="flex justify-center py-20 bg-white"><Loader2 className="animate-spin text-primary-500" size={32} /></div>
            ) : staff.length === 0 ? (
              <div className="py-16 text-center text-gray-400 bg-white rounded-2xl">
                <Users size={40} className="mx-auto mb-3 opacity-40" />
                <p className="font-bold text-sm">پرسنلی ثبت نشده است</p>
                <p className="text-xs mt-1 text-slate-400">از دکمه «افزودن پرسنل جدید» استفاده کنید</p>
              </div>
            ) : (
              <table className="w-full text-right border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">نام و نام خانوادگی</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">شماره تماس</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 text-center">نقش پرسنلی</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 text-center">وضعیت فعالیت</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 text-left">ویرایش مشخصات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {staff.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 text-sm">{s.full_name}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 text-right" style={{ direction: "ltr", textAlign: "right" }}>{s.mobile}</td>
                      <td className="px-6 py-4 text-center align-middle">
                        <span className={`badge text-[10px] font-black ${ROLE_COLORS[s.role] || "bg-gray-100 text-slate-700"}`}>
                          {ROLE_LABELS[s.role] || s.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        <button onClick={() => toggleActive(s.id)} className="transition-opacity hover:opacity-80">
                          {s.is_active ? <ToggleRight size={28} className="text-emerald-500" /> : <ToggleLeft size={28} className="text-slate-300" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-left align-middle">
                        {/* دکمه تجمیع شده برای مدیریت همه‌جانبه مشخصات و پرمیشن‌های پرسنل */}
                        <button 
                          onClick={() => handleOpenEdit(s)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 hover:text-primary-700 rounded-xl text-xs font-bold transition-all border border-primary-100/50"
                        >
                          <Edit2 size={13} /> ویرایش و تنظیم دسترسی
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ─── حالت ۲: بخش تمام صفحه افزودن/ویرایش پرسنل با فلو گرانولار دسترسی‌ها ─── */}
      {view === "form" && (
        <form onSubmit={handleAddSubmit} className="space-y-6">
          {/* هدر بخش فرم تمام صفحه */}
          <div className="flex items-center justify-between border-b pb-4 mb-2">
            <div>
              <button 
                type="button" 
                onClick={() => { setEditingStaff(null); setView("list"); }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors mb-2 font-bold"
              >
                <ArrowRight size={14} /> بازگشت به لیست پرسنل مطب
              </button>
              <h2 className="text-xl font-bold text-slate-800">
                {editingStaff ? `ویرایش اطلاعات پرسنل: ${form.fullName}` : "تعریف و تنظیم دسترسی پرسنل جدید"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">مشخصات هویتی پزشک یا منشی را وارد کرده و سطوح دسترسی گرانولار را پایش کنید</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => { setEditingStaff(null); setView("list"); }}
                className="btn-secondary py-3 px-5 rounded-xl text-xs font-bold"
              >
                انصراف
              </button>
              <button 
                type="submit" 
                disabled={saving}
                className="btn-primary py-3 px-5 shadow-md shadow-primary-100 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {editingStaff ? "ذخیره تغییرات" : "ذخیره پرسنل جدید"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ستون اول: فرم اطلاعات فردی و شناسنامه‌ای پرسنل (عرض ۳۳٪) */}
            <div className="card border-slate-100 shadow-sm p-6 bg-white space-y-4 h-fit">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <User size={14} className="text-primary-500" /> مشخصات فردی و شناسنامه‌ای
              </h3>
              
              {/* انتخاب نقش پرسنل */}
              <div>
                <label className="text-slate-500 mb-1.5 block text-xs">نقش پرسنلی</label>
                <select 
                  className="input bg-white focus:ring-primary-500 text-xs h-11"
                  value={form.role}
                  onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                  disabled={!!editingStaff} // غیرفعال بودن تغییر نقش در زمان ویرایش پرسنل برای حفظ یکپارچگی داده‌ها
                >
                  <option value="secretary">منشی (پذیرش)</option>
                  <option value="doctor">پزشک (معالج)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 mb-1.5 block text-xs">نام و نام خانوادگی <span className="text-red-500">*</span></label>
                <input 
                  className="input focus:ring-primary-500" 
                  value={form.fullName}
                  onChange={e => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="مثال: دکتر حسین فرزانه / سارا راد" 
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 mb-1.5 block text-xs">شماره همراه <span className="text-red-500">*</span></label>
                  <input 
                    className="input focus:ring-primary-500 text-left ltr" 
                    value={form.mobile}
                    onChange={e => setForm(prev => ({ ...prev, mobile: e.target.value }))}
                    placeholder="09123456789" 
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-500 mb-1.5 block text-xs">کد ملی <span className="text-red-500">*</span></label>
                  <input 
                    className="input focus:ring-primary-500 text-left ltr" 
                    value={form.nationalId}
                    onChange={e => setForm(prev => ({ ...prev, nationalId: e.target.value }))}
                    placeholder="0012345678" 
                    required
                  />
                </div>
              </div>

              {/* فیلدهای اختصاصی پزشک */}
              {form.role === "doctor" && (
                <div className="pt-3 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="text-slate-500 mb-1.5 block text-xs flex items-center gap-1"><Award size={13}/> شماره نظام پزشکی <span className="text-red-500">*</span></label>
                    <input 
                      className="input focus:ring-primary-500 text-left ltr" 
                      value={form.medicalCode}
                      onChange={e => setForm(prev => ({ ...prev, medicalCode: e.target.value }))}
                      placeholder="مثال: ۱۲۳۴۵۶" 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 mb-1.5 block text-xs flex items-center gap-1"><Percent size={13}/> سهم پزشک از هر ویزیت (درصد) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        className="input focus:ring-primary-500 text-left ltr pl-10" 
                        value={form.feePercent}
                        onChange={e => setForm(prev => ({ ...prev, feePercent: parseInt(e.target.value) || 0 }))}
                        placeholder="۷۰" 
                        required
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">%</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* ستون دوم (بزرگتر): کنترل کامل سطوح دسترسی منشی به صورت گرانولار (جنگویی) */}
            <div className="lg:col-span-2 space-y-4">
              
              {form.role === "secretary" ? (
                <div className="card border-slate-100 shadow-sm p-6 bg-white space-y-5">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Shield size={14} className="text-indigo-600" /> کنترل گرانولار (دقیق) سطوح دسترسی منشی
                    </h3>
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-xl border border-indigo-100">
                      پذیرش مطب
                    </span>
                  </div>

                  <div className="space-y-6">
                    {SECRETARY_PAGES.map((page) => {
                      const allChecked = page.actions.every(act => form.permissions[page.id]?.[act.id]);
                      return (
                        <div key={page.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-sm font-bold text-slate-800">{page.label}</span>
                            
                            <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer select-none">
                              <input 
                                type="checkbox"
                                checked={allChecked}
                                onChange={(e) => handleToggleWholePage(page.id, e.target.checked)}
                                className="rounded text-primary-600 focus:ring-primary-500 w-3.5 h-3.5"
                              />
                              انتخاب همه دسترسی‌ها
                            </label>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {page.actions.map((act) => {
                              const active = form.permissions[page.id]?.[act.id];
                              return (
                                <div key={act.id} className="flex items-center justify-between bg-white border border-slate-100 p-2.5 rounded-xl transition-all hover:border-slate-200">
                                  <span className={`text-xs ${act.id === "edit" ? "text-indigo-600 font-extrabold" : "text-slate-600 font-medium"}`}>{act.label}</span>
                                  <button 
                                    type="button"
                                    onClick={() => handleTogglePermission(page.id, act.id)} 
                                    className="transition-opacity hover:opacity-80"
                                  >
                                    {active ? <ToggleRight size={24} className="text-primary-600" /> : <ToggleLeft size={24} className="text-slate-300" />}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 border-dashed text-center py-20 flex flex-col items-center justify-center gap-3">
                  <Stethoscope size={40} className="text-slate-400 animate-pulse" />
                  <h3 className="font-bold text-slate-700 text-sm">پزشکان دسترسی بالینی پیش‌فرض دارند</h3>
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed">برای نقش پزشک سهم هر ویزیت ملاک امور مالی است و به دلیل نوع کارکرد بالینی نیازی به پیکربندی پرمیشن‌های دستی ندارند.</p>
                </div>
              )}

            </div>

          </div>
        </form>
      )}

    </div>
  );
}
