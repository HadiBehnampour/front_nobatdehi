import { useState, useEffect } from "react";
import { Search, Plus, Ban, LogIn, Eye, Play, X, Loader2, Building2, Users, Mail, Phone, MapPin, ExternalLink, ShieldCheck, PackageCheck } from "lucide-react";
import apiClient from "../../api/core";
import jalaali from "jalaali-js";

import Badge from "../../components/ui/Badge";

const toJalaali = (dateStr) => {
  if (!dateStr || dateStr === "—") return "—";
  try {
    const d = new Date(dateStr);
    const { jy, jm, jd } = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    return `${jy}/${jm.toString().padStart(2, '0')}/${jd.toString().padStart(2, '0')}`;
  } catch (e) { return "—"; }
};

function ClinicStatus(is_active) {
  return is_active ? "active" : "suspended";
}

export default function PlatformClinics() {
  const [loading, setLoading] = useState(true);
  const [clinics, setClinics] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", doctor_name: "", doctor_mobile: "", specialty: "" });
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (showCreate) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [showCreate]);

  const fetchClinics = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (filterStatus !== "all") params.status = filterStatus;
    apiClient.get("/platform/clinics/", { params })
      .then(r => setClinics(r.data.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchClinics(); }, [search, filterStatus]);

  const openDetail = async (clinicId) => {
    setDetailLoading(true);
    setSelected({ id: clinicId }); // Show placeholder
    try {
      const r = await apiClient.get(`/platform/clinics/${clinicId}/`);
      setSelected(r.data);
    } catch (e) { 
      console.error(e);
      setSelected(null);
    }
    finally { setDetailLoading(false); }
  };

  const handleToggle = async (clinicId, action) => {
    setActionLoading(clinicId);
    try {
      await apiClient.patch(`/platform/clinics/${clinicId}/toggle/`, { action });
      fetchClinics();
      if (selected?.id === clinicId) openDetail(clinicId);
    } catch (e) { alert(e?.response?.data?.error || "خطا"); }
    finally { setActionLoading(null); }
  };

  const handleImpersonate = async (clinicId) => {
    try {
      const r = await apiClient.post(`/platform/clinics/${clinicId}/impersonate/`);
      const d = r.data;
      const impersonateData = { access: d.access, refresh: d.refresh, user: d.user };
      localStorage.setItem("access", d.access);
      localStorage.setItem("refresh", d.refresh);
      localStorage.setItem("user", JSON.stringify(d.user));
      window.open("/admin/dashboard", "_blank");
    } catch (e) { alert(e?.response?.data?.error || "خطا در ورود جعلی"); }
  };

  const handleCreate = async () => {
    if (!createForm.name || !createForm.doctor_mobile) { alert("نام مطب و شماره پزشک الزامی است"); return; }
    setCreating(true);
    try {
      await apiClient.post("/platform/clinics/", createForm);
      setShowCreate(false);
      setCreateForm({ name: "", doctor_name: "", doctor_mobile: "", specialty: "" });
      fetchClinics();
    } catch (e) { alert(e?.response?.data?.error || "خطا در ساخت"); }
    finally { setCreating(false); }
  };

  const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);

  return (
    <div className="space-y-6 fade-in" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">مدیریت کلینیک‌ها</h1>
          <p className="text-sm text-slate-500 mt-1">تعداد {fmt(clinics.length)} مطب فعال در پلتفرم</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary py-3 px-6 shadow-lg shadow-primary-200">
          <Plus size={20} /> افزودن کلینیک جدید
        </button>
      </div>

      {/* Filters & Search */}
      <div className="card p-2 sm:p-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              className="input pr-12 h-12 bg-slate-50 border-transparent focus:bg-white focus:border-primary-500 transition-all" 
              placeholder="جستجو بر اساس نام کلینیک، پزشک یا شماره تماس..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            {[
              { id: "all", label: "همه" },
              { id: "active", label: "فعال" },
              { id: "suspended", label: "تعلیق‌شده" }
            ].map(s => (
              <button 
                key={s.id} 
                onClick={() => setFilterStatus(s.id)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === s.id ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="card overflow-hidden border-slate-100 shadow-xl shadow-slate-200/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-primary-500" size={40} />
            <p className="text-sm text-slate-500 font-medium">در حال بارگذاری لیست کلینیک‌ها...</p>
          </div>
        ) : clinics.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={40} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold text-lg">کلینیکی با این مشخصات یافت نشد</p>
            <button onClick={() => {setSearch(""); setFilterStatus("all")}} className="text-primary-600 text-sm mt-2 font-medium">پاک کردن فیلترها</button>
          </div>
        ) : (
          <div className="table-container overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-right">اطلاعات کلینیک</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-right">مدیریت / پزشک</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-center">وضعیت</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-center">اشتراک</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-center">بیماران</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-right">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {clinics.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 font-bold shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{c.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5 ltr text-right">smartnobat.ir/{c.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-slate-700">{c.owner?.full_name || c.doctor_name || "—"}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 ltr justify-end">
                        <span className="ltr inline-block">{c.owner?.mobile || "—"}</span>
                        <Phone size={10} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center align-middle">
                      <Badge status={ClinicStatus(c.is_active)} />
                    </td>
                    <td className="px-6 py-4 text-center align-middle">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                          {c.plan}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-1 font-bold">انقضا: {toJalaali(c.plan_expiry)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center align-middle">
                      <span className="text-sm font-bold text-slate-700 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{fmt(c.patient_count)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openDetail(c.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-primary-500 hover:text-white transition-all shadow-sm" title="مشاهده کامل">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleImpersonate(c.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm" title="ورود به پنل">
                          <LogIn size={18} />
                        </button>
                        <button onClick={() => handleToggle(c.id, c.is_active ? "suspend" : "reactivate")}
                          disabled={actionLoading === c.id}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all shadow-sm ${c.is_active ? "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white"}`}>
                          {actionLoading === c.id ? <Loader2 size={16} className="animate-spin" /> : c.is_active ? <Ban size={18} /> : <Play size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelected(null)} />
          <div className="fixed top-0 left-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col fade-in-right" dir="rtl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-primary-200">
                  {selected.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-800">{selected.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><ExternalLink size={12}/> {selected.slug}.smartnobat.ir</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {detailLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-primary-500" size={32} />
                  <p className="text-sm text-slate-400 font-medium">در حال دریافت جزئیات کلینیک...</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-center gap-2 mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">لینک اختصاصی:</span>
                    <code className="text-xs font-mono text-primary-600">smartnobat.ir/{selected.slug}</code>
                  </div>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                      <p className="text-[10px] text-blue-500 font-bold mb-1">بیماران</p>
                      <p className="text-xl font-black text-blue-700">{fmt(selected.patient_count)}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                      <p className="text-[10px] text-emerald-500 font-bold mb-1">پرسنل</p>
                      <p className="text-xl font-black text-emerald-700">{fmt(selected.staff_count)}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-center">
                      <p className="text-[10px] text-purple-500 font-bold mb-1">پیامک</p>
                      <p className="text-xl font-black text-purple-700">{fmt(selected.sms_used || 0)}</p>
                    </div>
                  </div>

                  {/* Info Sections */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShieldCheck size={14}/> اطلاعات پایه و امنیت
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                          <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1"><Users size={12}/> مدیر / پزشک</p>
                          <p className="text-sm font-bold text-slate-800">{selected.owner?.full_name || selected.doctor_name}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl">
                          <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1"><Phone size={12}/> شماره تماس</p>
                          <p className="text-sm font-bold text-slate-800 ltr text-right">{selected.owner?.mobile || selected.mobile}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl">
                          <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1"><ShieldCheck size={12}/> انقضای اشتراک</p>
                          <p className="text-sm font-bold text-slate-800">{toJalaali(selected.plan_expiry)}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl">
                          <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1"><ShieldCheck size={12}/> وضعیت سیستمی</p>
                          <Badge status={ClinicStatus(selected.is_active)} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MapPin size={14}/> اطلاعات تماس و آدرس
                      </h4>
                      <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-xs text-slate-500">آدرس مطب:</span>
                          <span className="text-sm font-medium text-slate-800 text-left max-w-[200px]">{selected.address || "ثبت نشده"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-500">تلفن ثابت:</span>
                          <span className="text-sm font-bold text-slate-800 ltr">{selected.phone || "—"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Staff list */}
                    {selected.staff?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Users size={14}/> لیست پرسنل و دسترسی‌ها
                        </h4>
                        <div className="space-y-2">
                          {selected.staff.map(s => (
                            <div key={s.id} className="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${s.role === 'doctor' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                  {s.full_name?.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-700">{s.full_name}</p>
                                  <p className="text-[11px] text-slate-400 ltr text-right">{s.mobile}</p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${s.role === "doctor" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                                {s.role === "doctor" ? "پزشک" : "منشی"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
              <button onClick={() => handleImpersonate(selected.id)}
                className="btn-primary justify-center h-12 shadow-lg shadow-primary-100">
                <LogIn size={18} /> ورود به پنل مدیریت
              </button>
              <button onClick={() => handleToggle(selected.id, selected.is_active ? "suspend" : "reactivate")}
                className={`justify-center h-12 inline-flex items-center gap-2 px-4 py-2 text-sm font-black rounded-2xl transition-all shadow-sm ${selected.is_active ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"}`}>
                {selected.is_active ? <><Ban size={18} /> تعلیق کلینیک</> : <><Play size={18} /> فعال‌سازی مجدد</>}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
          <div className="modal-content max-w-md h-fit" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
              <h3 className="text-base font-bold text-slate-800">افزودن کلینیک جدید</h3>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-surface-muted text-slate-500"><X size={20} /></button>
            </div>
            
            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">نام مطب / کلینیک <span className="text-red-500">*</span></label>
                <input className="input" value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: مرکز درمانی تخصصی پارس" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">نام پزشک</label>
                  <input className="input" value={createForm.doctor_name} onChange={e => setCreateForm(p => ({ ...p, doctor_name: e.target.value }))} placeholder="دکتر ..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">شماره همراه <span className="text-red-500">*</span></label>
                  <input className="input ltr text-left" value={createForm.doctor_mobile} onChange={e => setCreateForm(p => ({ ...p, doctor_mobile: e.target.value }))} placeholder="09123456789" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">تخصص پزشک</label>
                <input className="input" value={createForm.specialty} onChange={e => setCreateForm(p => ({ ...p, specialty: e.target.value }))} placeholder="مثال: قلب و عروق" />
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                <div className="flex items-center gap-2 mb-1">
                  <PackageCheck size={14} className="text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">پلن آزمایشی هوشمند</span>
                </div>
                <p className="text-[11px] text-blue-600 leading-relaxed">
                  با تایید این فرم، دسترسی رایگان <span className="font-bold">۷ روزه</span> به تمامی امکانات سیستم برای این مطب فعال می‌شود.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-surface-border bg-slate-50/80 flex gap-3">
              <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1 justify-center py-2.5">انصراف</button>
              <button onClick={handleCreate} disabled={creating} className="btn-primary flex-1 justify-center py-2.5 shadow-lg shadow-primary-200">
                {creating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                تایید و ساخت مطب
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
