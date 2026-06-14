import { useState, useEffect } from "react";
import { Check, Edit2, Plus, X, Loader2, Package, Save, Trash2, PieChart as PieChartIcon, Users, MessageSquare, Shield, Layers, HelpCircle, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import apiClient from "../../api/core";

const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);
const fmtInput = (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const unfmt = (v) => parseInt(v.toString().replace(/,/g, "")) || 0;

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const colorMap = {
  slate: { accent: "bg-slate-400", border: "border-slate-100", text: "text-slate-600", bg: "bg-slate-50", label: "خاکستری" },
  primary: { accent: "bg-blue-600", border: "border-blue-200 shadow-blue-50/50", text: "text-blue-600", bg: "bg-blue-50/50", label: "آبی ویژه" },
  yellow: { accent: "bg-amber-500", border: "border-amber-200 shadow-amber-50/50", text: "text-amber-600", bg: "bg-amber-50/50", label: "طلایی" },
  emerald: { accent: "bg-emerald-500", border: "border-emerald-200 shadow-emerald-50/50", text: "text-emerald-600", bg: "bg-emerald-50/50", label: "سبز" },
  rose: { accent: "bg-rose-500", border: "border-rose-200 shadow-rose-50/50", text: "text-rose-600", bg: "bg-rose-50/50", label: "قرمز" },
};

// ── مودال ساخت/ویرایش بدون تب (ساختار منسجم تک صفحه‌ای) ──
function PlanModal({ open, onClose, onSave, plan }) {
  const [form, setForm] = useState({
    title: "", duration: "ماهانه", price: 0,
    maxDoctors: 1, maxSecretaries: 1, smsCredits: 100,
    analytics: false, eprescribe: false, customSms: false,
    color: "slate", description: "",
    features: [],
  });
  
  const [newFeature, setNewFeature] = useState("");
  const [saving, setSaving] = useState(false);

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
        description: plan.description || "",
        features: plan.features || [],
      });
    } else {
      setForm({
        title: "", duration: "ماهانه", price: 0,
        maxDoctors: 1, maxSecretaries: 1, smsCredits: 100,
        analytics: false, eprescribe: false, customSms: false,
        color: "slate", description: "",
        features: [],
      });
    }
  }, [plan, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert("عنوان پکیج الزامی است"); return; }
    setSaving(true);
    try {
      // ارسال تخفیف‌ها به صورت صفر و نال به بک‌اند جهت هماهنگی کامل با دیتابیس
      const payload = {
        ...form,
        discount_percentage: 0,
        discount_start_date: null,
        discount_end_date: null,
      };
      await onSave(payload, plan?.id);
      onClose();
    } catch (e) { 
      alert(e?.response?.data?.error || "خطا در ذخیره اطلاعات"); 
    } finally { 
      setSaving(false); 
    }
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content max-w-2xl max-h-[92vh] border border-slate-100" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-800">
              {plan ? `ویرایش پکیج: ${plan.title}` : "ایجاد پکیج اشتراک جدید"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">اطلاعات، محدودیت‌ها و ماژول‌های پکیج را تنظیم نمایید</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content (Single Scrollable Layout) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
          
          {/* Section 1: اطلاعات پایه و مالی */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
              <Layers size={14} className="text-primary-500" /> ۱. اطلاعات پایه و مالی
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1.5">عنوان پکیج <span className="text-red-500">*</span></label>
                <input className="input focus:ring-primary-500" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="مثال: نقره‌ای، پیشرفته، VIP" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">مدت دوره</label>
                <select className="input focus:ring-primary-500 bg-white" value={form.duration} onChange={e => setForm(p => ({...p, duration: e.target.value}))}>
                  <option>ماهانه</option>
                  <option>۳ ماهه</option>
                  <option>۶ ماهه</option>
                  <option>سالانه</option>
                  <option>یک هفته</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">قیمت (تومان)</label>
                <div className="relative">
                  <input className="input ltr text-left pl-14 font-semibold" value={form.price ? fmtInput(form.price) : ""} onChange={e => setForm(p => ({...p, price: unfmt(e.target.value)}))} inputMode="numeric" placeholder="۰" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">تومان</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">رنگ تم و تمایز پکیج</label>
                <select className="input focus:ring-primary-500 bg-white" value={form.color} onChange={e => setForm(p => ({...p, color: e.target.value}))}>
                  <option value="slate">خاکستری (ساده)</option>
                  <option value="primary">آبی (ویژه / پرطرفدار)</option>
                  <option value="yellow">طلایی (بسته‌های VIP)</option>
                  <option value="emerald">سبز (اقتصادی)</option>
                  <option value="rose">قرمز (نامحدود)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">توضیحات کوتاه پکیج</label>
              <textarea className="input min-h-[80px] focus:ring-primary-500 leading-relaxed" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="توضیح کوتاه جهت نمایش در کارت پکیج..." />
            </div>
          </div>

          {/* Section 2: محدودیت‌ها و ماژول‌ها */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
              <Shield size={14} className="text-emerald-500" /> ۲. محدودیت‌های دسترسی و ماژول‌های سیستم
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">تعداد پزشک مجاز</label>
                <input className="input ltr text-left font-bold" type="number" min="1" value={form.maxDoctors} onChange={e => setForm(p => ({...p, maxDoctors: parseInt(e.target.value) || 1}))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">تعداد منشی مجاز</label>
                <input className="input ltr text-left font-bold" type="number" min="1" value={form.maxSecretaries} onChange={e => setForm(p => ({...p, maxSecretaries: parseInt(e.target.value) || 1}))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">سهمیه پیامک رایگان</label>
                <input className="input ltr text-left font-bold" type="number" min="0" value={form.smsCredits} onChange={e => setForm(p => ({...p, smsCredits: parseInt(e.target.value) || 0}))} />
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">فعال‌سازی ماژول‌های پکیج</p>
              
              {[
                ["analytics", "آمار، گزارش‌گیری و نمودارهای پیشرفته مالی و نوبت‌دهی"],
                ["eprescribe", "دسترسی کامل به ماژول نسخه الکترونیک بیمه سلامت و تأمین اجتماعی"],
                ["customSms", "امکان اختصاص خط پیامکی دلخواه و شخصی‌سازی متون پیامکی"],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl transition-colors">
                  <span className="text-xs font-bold text-slate-700">{label}</span>
                  <button onClick={() => setForm(p => ({...p, [key]: !p[key]}))}
                    className={`w-11 h-6.5 rounded-full transition-all relative ${form[key] ? "bg-primary-600" : "bg-slate-300"}`}>
                    <span className={`absolute top-0.5 w-5.5 h-5.5 bg-white rounded-full shadow transition-transform ${form[key] ? "right-1" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: ویژگی‌های سفارشی */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
              <Plus size={14} className="text-amber-500" /> ۳. ویژگی‌های متمایز کننده (آیتم‌های کارت پکیج)
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">افزودن ویژگی جدید</label>
              <div className="flex gap-2">
                <input className="input focus:ring-primary-500 h-11 text-xs" value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder="مثال: پشتیبانی تلفنی اختصاصی ۲۴ ساعته" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                <button onClick={addFeature} className="btn-secondary px-4 hover:bg-slate-200"><Plus size={18}/></button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {form.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-primary-50/50 rounded-xl text-xs font-semibold text-primary-700 border border-primary-100">
                  {f}
                  <button onClick={() => removeFeature(i)} className="text-primary-400 hover:text-red-500 transition-colors"><X size={14}/></button>
                </div>
              ))}
              {form.features.length === 0 && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs italic py-2">
                  <AlertCircle size={14} /> هیچ ویژگی سفارشی افزوده نشده است.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center h-12 rounded-2xl">انصراف</button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1 justify-center h-12 rounded-2xl shadow-lg shadow-primary-100">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {plan ? "بروزرسانی پکیج" : "تایید و ایجاد پکیج"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── صفحه اصلی پکیج‌ها ──
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
      alert(e?.response?.data?.error || "خطا در حذف پکیج");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary-500" size={44} />
        <p className="text-sm font-medium text-slate-400">در حال بارگذاری لیست پکیج‌های اشتراک...</p>
      </div>
    );
  }

  const chartData = plans.map((p, idx) => ({
    name: p.title,
    value: p.active_clinics_count || 0,
    color: COLORS[idx % COLORS.length]
  })).filter(d => d.value > 0);

  const totalClinics = plans.reduce((acc, p) => acc + (p.active_clinics_count || 0), 0);

  return (
    <div className="space-y-8 fade-in" dir="rtl">
      
      {/* Header section with clean design */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">بسته‌های اشتراک سیستم</h1>
          <p className="text-sm text-slate-400 mt-1.5 font-medium">پایش، ایجاد و مدیریت پلن‌های درآمدی پلتفرم و مشاهده توزیع بازار</p>
        </div>
        <button onClick={() => { setEditPlan(null); setShowModal(true); }} className="btn-primary py-3.5 px-6 shadow-lg shadow-primary-100 rounded-2xl text-xs font-bold shrink-0">
          <Plus size={18} /> ایجاد پکیج جدید
        </button>
      </div>

      {/* KPI Stats & Market Share Chart */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* KPI Cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-6 border-slate-100 flex items-center gap-5 bg-white/80 backdrop-blur-md shadow-xl shadow-slate-100/50 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-1.5 w-full bg-blue-500" />
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 transition-colors group-hover:bg-blue-100">
              <Package size={26}/>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">تعداد پکیج‌های فعال</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{fmt(plans.length)} <span className="text-xs text-slate-400 font-bold">پکیج</span></p>
            </div>
          </div>

          <div className="card p-6 border-slate-100 flex items-center gap-5 bg-white/80 backdrop-blur-md shadow-xl shadow-slate-100/50 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-1.5 w-full bg-emerald-500" />
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 transition-colors group-hover:bg-emerald-100">
              <Users size={26}/>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">اشتراک‌های فعال مطب‌ها</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{fmt(totalClinics)} <span className="text-xs text-slate-400 font-bold">کلینیک</span></p>
            </div>
          </div>
        </div>

        {/* Market Share Chart */}
        <div className="lg:w-96 card p-5 border-slate-100 bg-white/80 backdrop-blur-md shadow-xl shadow-slate-100/50 flex flex-col">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <PieChartIcon size={15} className="text-primary-500" /> سهم بازار بسته‌های اشتراک
          </h3>
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[140px]">
            {chartData.length > 0 ? (
              <>
                <div className="w-32 h-32 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={4} dataKey="value">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} مطب`, 'تعداد']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2 w-full">
                  {chartData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="truncate max-w-[110px]">{item.name}</span>
                      </span>
                      <span className="text-slate-400 font-black">%{roundShare(item.value, totalClinics)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-slate-400 italic text-xs flex items-center gap-1.5">
                <AlertCircle size={14} /> دیتایی جهت تحلیل نموداری ثبت نشده است
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Subscription Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const c = colorMap[plan.color] || colorMap.slate;
          return (
            <div key={plan.id} className={`card border-slate-100 bg-white shadow-xl shadow-slate-100/30 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:translate-y-[-4px]`}>
              
              {/* Color accent bar at the top instead of full border matching */}
              <div className={`absolute top-0 right-0 left-0 h-1.5 ${c.accent}`} />
              
              <div className="pt-3 pb-5 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-800">{plan.title}</h3>
                  <div className="inline-flex items-center gap-1.5 mt-1 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <span className={`w-1.5 h-1.5 rounded-full ${c.accent}`} />
                    {plan.duration}
                  </div>
                </div>
              </div>

              {/* Clean Pricing display without any messy discount rows */}
              <div className="mb-4 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-bold">هزینه اشتراک:</span>
                <div>
                  <span className="text-2xl font-black text-slate-800">{fmt(plan.price)}</span>
                  <span className="text-xs text-slate-400 font-bold mr-1">تومان</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-5 leading-relaxed min-h-[38px]">{plan.description || "بدون توضیحات اضافی"}</p>

              {/* Resource Limits with fine design */}
              <div className="space-y-2.5 mb-5 bg-slate-50/40 p-3.5 border border-slate-100/60 rounded-2xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5"><Users size={13}/> ادمین و پزشک مجاز</span>
                  <span className="font-black text-slate-700">{fmt(plan.maxDoctors)} پزشک</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5"><Users size={13}/> منشی مجاز</span>
                  <span className="font-black text-slate-700">{fmt(plan.maxSecretaries)} منشی</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5"><MessageSquare size={13}/> سهمیه پیامک رایگان</span>
                  <span className="font-black text-slate-700">{fmt(plan.smsCredits)} پیامک</span>
                </div>
              </div>

              {/* Enabled modules as beautiful pill tags */}
              <div className="pt-3 pb-4 border-t border-slate-100 flex flex-wrap gap-2 mb-4">
                {[
                  ["analytics", "آمار و گزارش"],
                  ["eprescribe", "نسخه الکترونیک"],
                  ["customSms", "پیامک اختصاصی"]
                ].map(([key, label]) => {
                  const active = plan.flags?.[key];
                  return (
                    <span key={key} className={`text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1 ${active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-300"}`} />
                      {label}
                    </span>
                  );
                })}
              </div>

              {/* Features bullets with green checks */}
              {plan.features?.length > 0 && (
                <div className="space-y-2 pb-5 border-b border-slate-100 mb-5 flex-1">
                  {plan.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <p className="text-[10px] text-primary-600 font-bold pr-5">+{plan.features.length - 4} ویژگی بیشتر</p>
                  )}
                </div>
              )}

              {/* Action buttons (Clean grouping at bottom) */}
              <div className="mt-auto flex gap-2 pt-2">
                <button onClick={() => { setEditPlan(plan); setShowModal(true); }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                  <Edit2 size={13} /> ویرایش پکیج
                </button>
                <button onClick={() => handleDelete(plan)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 w-12 rounded-2xl flex items-center justify-center transition-colors border border-rose-100" title="حذف پکیج">
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Subscription List Table */}
      <div className="card border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-700">توزیع اشتراک‌ها بر اساس بسته‌ها</h3>
            <p className="text-[10px] text-slate-400 mt-1">آمار تحلیلی سهم بازار و نهایی پکیج‌های ثبت شده در سیستم</p>
          </div>
        </div>
        
        <div className="table-container border-none rounded-none overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-black text-slate-500 text-right">عنوان پکیج</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 text-center">مطب‌های متصل</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 text-center">سهم بازار</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 text-left">قیمت دوره</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {plans.map(p => {
                const c = colorMap[p.color] || colorMap.slate;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.accent}`} />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{p.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">پکیج {p.duration}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center align-middle font-bold text-primary-600 text-sm">
                      {fmt(p.active_clinics_count)} کلینیک
                    </td>
                    <td className="px-6 py-4 text-center align-middle font-bold text-slate-600 text-sm">
                      % {fmt(p.market_share)}
                    </td>
                    <td className="px-6 py-4 text-left align-middle font-black text-slate-700 text-sm">
                      {fmt(p.price)} <span className="text-[10px] text-slate-400 font-bold">تومان</span>
                    </td>
                  </tr>
                );
              })}
              {plans.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400 font-bold italic">
                    هیچ پکیجی در سیستم ثبت نشده است.
                  </td>
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

// کمکی سهم درصد
function roundShare(val, total) {
  if (!total) return 0;
  return Math.round((val / total) * 100);
}
