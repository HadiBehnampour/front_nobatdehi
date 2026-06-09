import { useState, useEffect } from "react";
import { Check, Edit2, Plus, Infinity, X, Loader2, Package, Save } from "lucide-react";
import apiClient from "../../api/core";

const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);
const fmtInput = (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const unfmt = (v) => parseInt(v.replace(/,/g, "")) || 0;

const colorMap = {
  slate: { card: "border-slate-200", badge: "bg-slate-100 text-slate-700", btn: "bg-slate-700 hover:bg-slate-800 text-white" },
  primary: { card: "border-primary-300 ring-2 ring-primary-200", badge: "bg-primary-100 text-primary-700", btn: "bg-primary-600 hover:bg-primary-700 text-white" },
  yellow: { card: "border-amber-300", badge: "bg-amber-100 text-amber-700", btn: "bg-amber-500 hover:bg-amber-600 text-white" },
};

// ── مودال ساخت/ویرایش ──
function PlanModal({ open, onClose, onSave, plan }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    title: "", duration: "ماهانه", price: 0,
    maxAppointments: 500, maxDoctors: 1, maxSecretaries: 1, smsCredits: 100,
    isUnlimited: false,
    analytics: false, eprescribe: false, customSms: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (plan) {
      setForm({
        title: plan.title, duration: plan.duration, price: plan.price,
        maxAppointments: plan.maxAppointments === -1 ? 0 : plan.maxAppointments,
        maxDoctors: plan.maxDoctors === -1 ? 0 : plan.maxDoctors,
        maxSecretaries: plan.maxSecretaries === -1 ? 0 : plan.maxSecretaries,
        smsCredits: plan.smsCredits,
        isUnlimited: plan.isUnlimited || plan.maxAppointments === -1,
        analytics: plan.flags?.analytics || false,
        eprescribe: plan.flags?.eprescribe || false,
        customSms: plan.flags?.customSms || false,
      });
    }
  }, [plan]);

  if (!open) return null;

  const tabs = ["مشخصات مالی", "محدودیت منابع", "ماژول‌های فعال"];

  const handleSubmit = async () => {
    if (!form.title) { alert("عنوان الزامی است"); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) { alert(e?.response?.data?.error || "خطا"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h3 className="text-base font-semibold text-slate-800">{plan ? "ویرایش پکیج" : "پکیج جدید"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-muted text-slate-500"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-border">
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`flex-1 py-3 text-xs font-medium transition ${tab === i ? "text-primary-600 border-b-2 border-primary-600" : "text-slate-400 hover:text-slate-600"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* تب ۱: مشخصات مالی */}
          {tab === 0 && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">عنوان پکیج <span className="text-red-400">*</span></label>
                <input className="input" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="مثال: استاندارد" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">مدت</label>
                  <select className="input" value={form.duration} onChange={e => setForm(p => ({...p, duration: e.target.value}))}>
                    <option>ماهانه</option><option>۳ ماهه</option><option>۶ ماهه</option><option>سالانه</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">قیمت (تومان)</label>
                  <input className="input ltr text-left" value={fmtInput(form.price)} onChange={e => setForm(p => ({...p, price: unfmt(e.target.value)}))} inputMode="numeric" />
                </div>
              </div>
            </>
          )}

          {/* تب ۲: محدودیت منابع */}
          {tab === 1 && (
            <>
              <div className="flex items-center justify-between p-3 bg-surface-muted rounded-xl">
                <span className="text-sm text-slate-700">منابع نامحدود</span>
                <button onClick={() => setForm(p => ({...p, isUnlimited: !p.isUnlimited}))}
                  className={`w-10 h-6 rounded-full transition-colors relative ${form.isUnlimited ? "bg-primary-600" : "bg-slate-300"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isUnlimited ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
              {[
                ["سقف نوبت در ماه", "maxAppointments"],
                ["تعداد پزشک مجاز", "maxDoctors"],
                ["تعداد منشی مجاز", "maxSecretaries"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input className="input ltr text-left" type="number" value={form[key]} disabled={form.isUnlimited}
                    onChange={e => setForm(p => ({...p, [key]: parseInt(e.target.value) || 0}))}
                    style={form.isUnlimited ? { opacity: 0.4, cursor: "not-allowed" } : {}} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">سهمیه پیامک رایگان</label>
                <input className="input ltr text-left" type="number" value={form.smsCredits}
                  onChange={e => setForm(p => ({...p, smsCredits: parseInt(e.target.value) || 0}))} />
              </div>
            </>
          )}

          {/* تب ۳: ماژول‌ها */}
          {tab === 2 && (
            <div className="space-y-3">
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
          )}
        </div>

        <div className="px-6 py-4 border-t border-surface-border flex gap-3">
          {tab > 0 && <button onClick={() => setTab(t => t - 1)} className="btn-secondary flex-1 justify-center">قبلی</button>}
          {tab < 2 ? (
            <button onClick={() => setTab(t => t + 1)} className="btn-primary flex-1 justify-center">بعدی</button>
          ) : (
            <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              ذخیره پکیج
            </button>
          )}
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

  const handleSave = async (form) => {
    await apiClient.post("/platform/plans/", form);
    fetchPlans();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="animate-spin text-primary-500" size={40} /></div>;
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">پکیج‌های اشتراک</h1>
          <p className="text-sm text-slate-500 mt-0.5">تعریف و مدیریت پلن‌های درآمدی پلتفرم</p>
        </div>
        <button onClick={() => { setEditPlan(null); setShowModal(true); }} className="btn-primary"><Plus size={16} />پکیج جدید</button>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const c = colorMap[plan.color] || colorMap.slate;
          return (
            <div key={plan.id} className={`card border-2 relative ${c.card}`}>
              {plan.badge && (
                <div className="absolute -top-3 right-5">
                  <span className={`badge ${c.badge} px-3 py-1 text-xs font-semibold`}>{plan.badge}</span>
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">{plan.title}</h3>
                  <p className="text-xs text-slate-500">{plan.duration}</p>
                </div>
                <button onClick={() => { setEditPlan(plan); setShowModal(true); }}
                  className="p-1.5 rounded-lg hover:bg-surface-muted text-slate-400">
                  <Edit2 size={14} />
                </button>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-slate-900">{fmt(plan.price)}</span>
                <span className="text-sm text-slate-500 mr-1">تومان / ماه</span>
              </div>

              {/* Quotas */}
              <div className="space-y-2 mb-5">
                {[
                  ["سقف نوبت", plan.maxAppointments === -1 ? <Infinity size={14} /> : fmt(plan.maxAppointments)],
                  ["تعداد پزشک", plan.maxDoctors === -1 ? <Infinity size={14} /> : plan.maxDoctors],
                  ["تعداد منشی", plan.maxSecretaries === -1 ? <Infinity size={14} /> : plan.maxSecretaries],
                  ["پیامک رایگان", fmt(plan.smsCredits)],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{label}</span>
                    <span className="font-semibold text-slate-800 flex items-center">{val}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="space-y-2 pt-4 border-t border-surface-border">
                {(plan.features || []).map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check size={14} className="text-emerald-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <button onClick={() => { setEditPlan(plan); setShowModal(true); }}
                className={`mt-5 w-full py-2.5 rounded-xl text-sm font-medium transition ${c.btn}`}>
                ویرایش پکیج
              </button>
            </div>
          );
        })}
      </div>

      {/* Matrix Table */}
      <div className="card">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">ماتریس مقایسه محدودیت‌ها</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ویژگی / محدودیت</th>
                {plans.map(p => <th key={p.id} className="text-center">{p.title}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["سقف نوبت در ماه", p => p.maxAppointments === -1 ? "نامحدود" : fmt(p.maxAppointments)],
                ["تعداد پزشک مجاز", p => p.maxDoctors === -1 ? "نامحدود" : p.maxDoctors],
                ["تعداد منشی مجاز", p => p.maxSecretaries === -1 ? "نامحدود" : p.maxSecretaries],
                ["پیامک رایگان", p => fmt(p.smsCredits)],
                ["آمار مالی", p => p.flags?.analytics ? "✓" : "✗"],
                ["نسخه الکترونیک", p => p.flags?.eprescribe ? "✓" : "✗"],
                ["پیامک سفارشی", p => p.flags?.customSms ? "✓" : "✗"],
              ].map(([feat, getter]) => (
                <tr key={feat}>
                  <td className="font-medium">{feat}</td>
                  {plans.map(p => (
                    <td key={p.id} className="text-center text-slate-600">{getter(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <PlanModal open={showModal} onClose={() => setShowModal(false)} onSave={handleSave} plan={editPlan} />
    </div>
  );
}
