import { useState, useEffect } from "react";
import { Check, Edit2, Plus, X, Loader2, Package, Save, Trash2, PieChart as PieChartIcon, Users, Calendar, Percent } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import jalaali from "jalaali-js";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import apiClient from "../../api/core";

const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);
const fmtInput = (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const unfmt = (v) => parseInt(v.toString().replace(/,/g, "")) || 0;

// تبدیل میلادی به شمسی برای نمایش
const toJalaali = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const { jy, jm, jd } = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${jy}/${jm.toString().padStart(2, '0')}/${jd.toString().padStart(2, '0')}`;
};

// تبدیل شمسی به میلادی برای ذخیره
const toGregorian = (jalaliStr) => {
  if (!jalaliStr || !jalaliStr.includes("/")) return "";
  const [jy, jm, jd] = jalaliStr.split("/").map(Number);
  if (!jy || !jm || !jd) return "";
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return `${gy}-${gm.toString().padStart(2, '0')}-${gd.toString().padStart(2, '0')}`;
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const colorMap = {
  slate: { card: "border-slate-200", badge: "bg-slate-100 text-slate-700", btn: "bg-slate-700 hover:bg-slate-800 text-white" },
  primary: { card: "border-primary-300 ring-2 ring-primary-100", badge: "bg-primary-100 text-primary-700", btn: "bg-primary-600 hover:bg-primary-700 text-white" },
  yellow: { card: "border-amber-300", badge: "bg-amber-100 text-amber-700", btn: "bg-amber-500 hover:bg-amber-600 text-white" },
  emerald: { card: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", btn: "bg-emerald-600 hover:bg-emerald-700 text-white" },
  rose: { card: "border-rose-200", badge: "bg-rose-100 text-rose-700", btn: "bg-rose-600 hover:bg-rose-700 text-white" },
};

// ── مودال ساخت/ویرایش ──
function PlanModal({ open, onClose, onSave, plan }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    title: "", duration: "ماهانه", price: 0,
    maxDoctors: 1, maxSecretaries: 1, smsCredits: 100,
    analytics: false, eprescribe: false, customSms: false,
    color: "slate", badge: "", description: "",
    discount_percentage: 0,
    discount_start_date: "",
    discount_end_date: "",
    features: [],
  });
  
  // فیلدهای کمکی برای تقویم شمسی
  const [jalaliStart, setJalaliStart] = useState("");
  const [jalaliEnd, setJalaliEnd] = useState("");

  useEffect(() => {
    if (plan) {
      setForm({
        title: plan.title || "",
        duration: plan.duration || "ماهانه",
        price: plan.price || 0,
        maxDoctors: plan.maxDoctors || 1,
        maxSecretaries: plan.maxSecretaries || 1,
        smsCredits: plan.smsCredits || 0,
        analytics: plan.flags?.analytics || false,
        eprescribe: plan.flags?.eprescribe || false,
        customSms: plan.flags?.customSms || false,
        color: plan.color || "slate",
        badge: plan.badge || "",
        description: plan.description || "",
        discount_percentage: plan.discount_percentage || 0,
        discount_start_date: plan.discount_start_date || "",
        discount_end_date: plan.discount_end_date || "",
        features: plan.features || [],
      });
      setJalaliStart(toJalaali(plan.discount_start_date));
      setJalaliEnd(toJalaali(plan.discount_end_date));
    } else {
      setForm({
        title: "", duration: "ماهانه", price: 0,
        maxDoctors: 1, maxSecretaries: 1, smsCredits: 100,
        analytics: false, eprescribe: false, customSms: false,
        color: "slate", badge: "", description: "",
        discount_percentage: 0, discount_start_date: "", discount_end_date: "",
        features: [],
      });
      setJalaliStart("");
      setJalaliEnd("");
    }
  }, [plan, open]);

  const handleJalaliChange = (val, field) => {
    if (field === 'start') {
      setJalaliStart(val);
      if (val.length === 10) setForm(p => ({...p, discount_start_date: toGregorian(val)}));
    } else {
      setJalaliEnd(val);
      if (val.length === 10) setForm(p => ({...p, discount_end_date: toGregorian(val)}));
    }
  };

  const [newFeature, setNewFeature] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const tabs = ["پایه و مالی", "محدودیت و ماژول", "ویژگی‌ها و تخفیف"];

  const handleSubmit = async () => {
    if (!form.title) { alert("عنوان الزامی است"); return; }
    setSaving(true);
    try {
      await onSave(form, plan?.id);
      onClose();
    } catch (e) { alert(e?.response?.data?.error || "خطا در ذخیره"); }
    finally { setSaving(false); }
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setForm(p => ({ ...p, features: [...p.features, newFeature.trim()] }));
    setNewFeature("");
  };

  const removeFeature = (index) => {
    setForm(p => ({ ...p, features: p.features.filter((_, i) => i !== index) }));
  };

  return (
    <div className={open ? "modal-backdrop" : "hidden"} onClick={onClose}>
      <div className="modal-content max-w-xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h3 className="text-base font-semibold text-slate-800">{plan ? `ویرایش: ${plan.title}` : "ایجاد پکیج جدید"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-muted text-slate-500"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-border bg-slate-50">
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`flex-1 py-3 text-xs font-medium transition ${tab === i ? "text-primary-600 bg-white border-b-2 border-primary-600" : "text-slate-400 hover:text-slate-600"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {tab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">عنوان پکیج <span className="text-red-400">*</span></label>
                <input className="input" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="مثال: استاندارد" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">مدت</label>
                <select className="input" value={form.duration} onChange={e => setForm(p => ({...p, duration: e.target.value}))}>
                  <option>ماهانه</option><option>۳ ماهه</option><option>۶ ماهه</option><option>سالانه</option><option>یک هفته</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">قیمت (تومان)</label>
                <input className="input ltr text-left" value={fmtInput(form.price)} onChange={e => setForm(p => ({...p, price: unfmt(e.target.value)}))} inputMode="numeric" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">رنگ پکیج</label>
                <select className="input" value={form.color} onChange={e => setForm(p => ({...p, color: e.target.value}))}>
                  <option value="slate">خاکستری</option>
                  <option value="primary">آبی (ویژه)</option>
                  <option value="yellow">طلایی</option>
                  <option value="emerald">سبز</option>
                  <option value="rose">قرمز</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">بج (Badge)</label>
                <input className="input" value={form.badge} onChange={e => setForm(p => ({...p, badge: e.target.value}))} placeholder="مثال: محبوب‌ترین" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">توضیحات کوتاه</label>
                <textarea className="input min-h-[80px]" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              </div>
            </div>
          )}

          {tab === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">تعداد پزشک مجاز</label>
                  <input className="input ltr text-left" type="number" value={form.maxDoctors} onChange={e => setForm(p => ({...p, maxDoctors: parseInt(e.target.value) || 0}))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">تعداد منشی مجاز</label>
                  <input className="input ltr text-left" type="number" value={form.maxSecretaries} onChange={e => setForm(p => ({...p, maxSecretaries: parseInt(e.target.value) || 0}))} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">سهمیه پیامک رایگان</label>
                  <input className="input ltr text-left" type="number" value={form.smsCredits} onChange={e => setForm(p => ({...p, smsCredits: parseInt(e.target.value) || 0}))} />
                </div>
              </div>
              <div className="space-y-2 border-t pt-4">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">ماژول‌های فعال</p>
                {[
                  ["analytics", "آمار و گزارش‌گیری پیشرفته"],
                  ["eprescribe", "نسخه الکترونیک"],
                  ["customSms", "پیامک سفارشی"],
                ].map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-surface-muted rounded-xl">
                    <span className="text-sm text-slate-700">{label}</span>
                    <button onClick={() => setForm(p => ({...p, [key]: !p[key]}))}
                      className={`w-10 h-6 rounded-full transition-colors relative ${form[key] ? "bg-primary-600" : "bg-slate-300"}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[key] ? "right-0.5" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 2 && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <p className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2"><Percent size={16}/> تنظیمات تخفیف</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-amber-700 mb-1">درصد تخفیف</label>
                    <input className="input h-10" type="number" value={form.discount_percentage} onChange={e => setForm(p => ({...p, discount_percentage: parseInt(e.target.value) || 0}))} />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-[11px] text-amber-700 mb-1">تاریخ شروع</label>
                    <DatePicker
                      value={form.discount_start_date}
                      onChange={(date) => setForm(p => ({...p, discount_start_date: date?.toDate?.().toISOString() || ""} ))}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      portal={true}
                      fixMainPosition={true}
                      zIndex={9999}
                      containerClassName="w-full"
                      inputClass="input h-10 text-xs ltr w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-[11px] text-amber-700 mb-1">تاریخ پایان</label>
                    <DatePicker
                      value={form.discount_end_date}
                      onChange={(date) => setForm(p => ({...p, discount_end_date: date?.toDate?.().toISOString() || ""} ))}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      portal={true}
                      fixMainPosition={true}
                      zIndex={9999}
                      containerClassName="w-full"
                      inputClass="input h-10 text-xs ltr w-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">لیست ویژگی‌ها (توضیحات در کارت)</label>
                <div className="flex gap-2 mb-2">
                  <input className="input h-10" value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder="مثال: پشتیبانی ۲۴ ساعته" onKeyDown={e => e.key === 'Enter' && addFeature()} />
                  <button onClick={addFeature} className="btn-secondary px-3"><Plus size={18}/></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs text-slate-700 border border-slate-200">
                      {f}
                      <button onClick={() => removeFeature(i)} className="text-slate-400 hover:text-red-500"><X size={12}/></button>
                    </div>
                  ))}
                  {form.features.length === 0 && <p className="text-xs text-slate-400 italic">هیچ ویژگی ثبت نشده است</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-surface-border flex gap-3 bg-slate-50">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">انصراف</button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1 justify-center">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {plan ? "بروزرسانی تغییرات" : "ذخیره پکیج جدید"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── صفحه اصلی ──
export default function PlatformPlans() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  const fetchPlans = () => {
    setLoading(true);
    apiClient.get("/platform/plans/")
      .then(r => setPlans(r.data.plans || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSave = async (form, planId) => {
    if (planId) {
      await apiClient.put(`/platform/plans/${planId}/`, form);
    } else {
      await apiClient.post("/platform/plans/", form);
    }
    fetchPlans();
  };

  useEffect(() => {
    if (showModal) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [showModal]);

  const handleDelete = async (plan) => {
    if (plan.active_clinics_count > 0) {
      alert("این پکیج دارای کلینیک‌های فعال است و قابل حذف نیست.");
      return;
    }
    if (!confirm(`آیا از حذف پکیج «${plan.title}» مطمئن هستید؟`)) return;
    
    try {
      await apiClient.delete(`/platform/plans/${plan.id}/`);
      fetchPlans();
    } catch (e) {
      alert(e?.response?.data?.error || "خطا در حذف");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="animate-spin text-primary-500" size={40} /></div>;
  }

  // داده‌های نمودار
  const chartData = plans.map((p, idx) => ({
    name: p.title,
    value: p.active_clinics_count || 0,
    color: COLORS[idx % COLORS.length]
  })).filter(d => d.value > 0);

  const totalClinics = plans.reduce((acc, p) => acc + (p.active_clinics_count || 0), 0);

  return (
    <div className="space-y-6 fade-in" dir="rtl">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">بسته های اشتراک</h1>
              <p className="text-sm text-slate-500 mt-0.5">مدیریت محصولات و تحلیل سهم بازار</p>
            </div>
            <button onClick={() => { setEditPlan(null); setShowModal(true); }} className="btn-primary"><Plus size={16} />پکیج جدید</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5 border-r-4 border-r-blue-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Package size={24}/></div>
                <div>
                  <p className="text-xs text-slate-500">تعداد کل پکیج‌ها</p>
                  <p className="text-2xl font-bold text-slate-800">{fmt(plans.length)}</p>
                </div>
              </div>
            </div>
            <div className="card p-5 border-r-4 border-r-emerald-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Users size={24}/></div>
                <div>
                  <p className="text-xs text-slate-500">اشتراک‌های فعال</p>
                  <p className="text-2xl font-bold text-slate-800">{fmt(totalClinics)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:w-80 card p-4 flex flex-col items-center justify-center min-h-[200px]">
          <h3 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2 self-start"><PieChartIcon size={14}/> سهم بازار خدمات</h3>
          {chartData.length > 0 ? (
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">دیتایی برای نمایش وجود ندارد</p>
          )}
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const c = colorMap[plan.color] || colorMap.slate;
          const hasDiscount = plan.discount_percentage > 0;
          return (
            <div key={plan.id} className={`card border-2 relative flex flex-col ${c.card} hover:shadow-lg transition-all duration-300`}>
              {plan.badge && (
                <div className="absolute -top-3 right-5">
                  <span className={`badge ${c.badge} px-3 py-1 text-[10px] font-bold uppercase tracking-wider`}>{plan.badge}</span>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{plan.title}</h3>
                  <p className="text-xs text-slate-500">{plan.duration}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditPlan(plan); setShowModal(true); }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(plan)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                {hasDiscount ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-slate-900">{fmt(plan.current_price)}</span>
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">%{fmt(plan.discount_percentage)}</span>
                    </div>
                    <div className="text-sm text-slate-400 line-through">{fmt(plan.price)} تومان</div>
                  </div>
                ) : (
                  <div>
                    <span className="text-3xl font-black text-slate-900">{fmt(plan.price)}</span>
                    <span className="text-sm text-slate-500 mr-1">تومان</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 mb-5 leading-relaxed min-h-[32px]">{plan.description || "بدون توضیحات اضافی"}</p>

              {/* Stats mini bar */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-5">
                <div className="text-center flex-1 border-l border-slate-200">
                  <p className="text-[10px] text-slate-400 mb-0.5">کلینیک‌ها</p>
                  <p className="text-sm font-bold text-slate-700">{fmt(plan.active_clinics_count)}</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-[10px] text-slate-400 mb-0.5">سهم بازار</p>
                  <p className="text-sm font-bold text-slate-700">%{fmt(plan.market_share)}</p>
                </div>
              </div>

              {/* Limits */}
              <div className="space-y-3 mb-6 flex-1">
                {[
                  ["پزشک مجاز", plan.maxDoctors, <Users size={14}/>],
                  ["منشی مجاز", plan.maxSecretaries, <Users size={14}/>],
                  ["پیامک رایگان", fmt(plan.smsCredits), <Calendar size={14}/>],
                ].map(([label, val, icon]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2">{icon} {label}</span>
                    <span className="font-bold text-slate-800">{val}</span>
                  </div>
                ))}

                <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <div className={`text-[10px] text-center p-1 rounded-md ${plan.flags?.analytics ? "bg-emerald-50 text-emerald-700 font-bold" : "bg-slate-50 text-slate-400"}`}>آمار</div>
                  <div className={`text-[10px] text-center p-1 rounded-md ${plan.flags?.eprescribe ? "bg-emerald-50 text-emerald-700 font-bold" : "bg-slate-50 text-slate-400"}`}>نسخه</div>
                  <div className={`text-[10px] text-center p-1 rounded-md ${plan.flags?.customSms ? "bg-emerald-50 text-emerald-700 font-bold" : "bg-slate-50 text-slate-400"}`}>پیامک</div>
                </div>
              </div>

              {/* Features List */}
              {plan.features?.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-100 mb-6">
                  {plan.features.slice(0, 3).map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={12} className="text-emerald-500 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                  {plan.features.length > 3 && <p className="text-[10px] text-primary-500 font-medium">+{plan.features.length - 3} ویژگی دیگر</p>}
                </div>
              )}

              <button onClick={() => { setEditPlan(plan); setShowModal(true); }}
                className={`mt-auto w-full py-3 rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md ${c.btn}`}>
                مدیریت و ویرایش
              </button>
            </div>
          );
        })}
      </div>

      {/* Plans Market List */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700">لیست توزیع اشتراک‌ها</h3>
          <span className="text-[11px] font-medium text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">بروزرسانی شده</span>
        </div>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr className="bg-white">
                <th className="text-right">عنوان پکیج</th>
                <th className="text-center">تعداد مطب‌های فعال</th>
                <th className="text-center">سهم بازار</th>
                <th className="text-center">وضعیت تخفیف</th>
                <th className="text-left">قیمت نهایی</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="font-bold text-slate-700">{p.title}</td>
                  <td className="text-center font-medium text-blue-600">{fmt(p.active_clinics_count)} مطب</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full bg-primary-500" style={{ width: `${p.market_share}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-600">%{fmt(p.market_share)}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    {p.discount_percentage > 0 ? (
                      <span className="badge bg-red-50 text-red-600 border border-red-100 text-[10px]">فعال (%{fmt(p.discount_percentage)})</span>
                    ) : (
                      <span className="text-slate-300 text-[10px]">غیرفعال</span>
                    )}
                  </td>
                  <td className="text-left font-black text-slate-800 ltr">{fmt(p.current_price)} T</td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 italic">هیچ پکیجی تعریف نشده است</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <PlanModal open={showModal} onClose={() => setShowModal(false)} onSave={handleSave} plan={editPlan} />
    </div>
  );
}