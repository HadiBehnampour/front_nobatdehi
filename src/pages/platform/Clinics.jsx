import { useState, useEffect } from "react";
import { Search, Plus, Ban, LogIn, Eye, Play, X, Loader2, Building2, Users, Phone, MapPin, ExternalLink, ShieldCheck, PackageCheck, Edit2, Save, Filter } from "lucide-react";
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

// تابع نگاشت و فرمت‌دهی زیبای نقش‌ها در دراور پرسنل
const roleFormat = (role) => {
  switch (role) {
    case "clinic_admin":
      return { label: "مدیر مطب", badgeClass: "bg-indigo-50 text-indigo-700 border border-indigo-100", avatarClass: "bg-indigo-50 text-indigo-600" };
    case "doctor":
      return { label: "پزشک", badgeClass: "bg-blue-50 text-blue-700 border border-blue-100", avatarClass: "bg-blue-50 text-blue-600" };
    case "secretary":
      return { label: "منشی", badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-100", avatarClass: "bg-emerald-50 text-emerald-600" };
    default:
      return { label: "پرسنل", badgeClass: "bg-slate-50 text-slate-700 border border-slate-100", avatarClass: "bg-slate-50 text-slate-600" };
  }
};

export default function PlatformClinics() {
  const [loading, setLoading] = useState(true);
  const [clinics, setClinics] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", doctor_name: "", doctor_mobile: "", specialty: "", slug: "" });
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // States for Edit Clinic
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", name: "", slug: "", doctor_name: "", specialty: "", mobile: "", phone: "", address: "" });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (showCreate || showEdit) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [showCreate, showEdit]);

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
      setCreateForm({ name: "", doctor_name: "", doctor_mobile: "", specialty: "", slug: "" });
      fetchClinics();
    } catch (e) { alert(e?.response?.data?.error || "خطا در ساخت"); }
    finally { setCreating(false); }
  };

  const openEditModal = (clinic) => {
    setEditForm({
      id: clinic.id,
      name: clinic.name || "",
      slug: clinic.slug || "",
      doctor_name: clinic.doctor_name || "",
      specialty: clinic.specialty || "",
      mobile: clinic.owner?.mobile || clinic.mobile || "",
      phone: clinic.phone || "",
      address: clinic.address || "",
    });
    setShowEdit(true);
  };

  const handleUpdateClinic = async () => {
    if (!editForm.name.trim() || !editForm.slug.trim()) { alert("نام مطب و آدرس اختصاصی الزامی هستند"); return; }
    setUpdating(true);
    try {
      await apiClient.put(`/platform/clinics/${editForm.id}/`, editForm);
      setShowEdit(false);
      fetchClinics();
      openDetail(editForm.id); // Re-fetch details to show updated data in drawer
    } catch (e) {
      alert(e?.response?.data?.error || "خطا در بروزرسانی اطلاعات کلینیک");
    } finally {
      setUpdating(false);
    }
  };

  const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);

  // استخراج داینامیک لیست پکیج‌ها برای فیلتر
  const plansList = Array.from(new Set(clinics.map(c => c.plan).filter(Boolean)));

  // فیلتر نهایی بر اساس پکیج در فرانت‌اند برای سرعت بالا و بدون تداخل
  const filteredClinics = clinics.filter(c => {
    return filterPlan === "all" || c.plan === filterPlan;
  });

  return (
    <div className="space-y-5 fade-in" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">مدیریت کلینیک‌ها</h1>
          <p className="text-sm text-slate-500 mt-0.5">{fmt(filteredClinics.length)} مستأجر در سیستم</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary py-2 px-4 shadow-md rounded-xl text-xs font-bold shrink-0">
          <Plus size={16} /> افزودن کلینیک
        </button>
      </div>

      {/* Filters (مشابه ساختار تمیز پروژه نمونه) */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          
          {/* کادر جستجو با فیکس تداخل آیکون - قرارگیری آیکون در سمت چپ برای حذف کامل تداخل */}
          <div className="relative flex-1 min-w-[280px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input 
              className="input !pl-9 !pr-4" 
              placeholder="جستجو در کلینیک‌ها..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ paddingLeft: "2.5rem", paddingRight: "1rem" }}
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* دکمه‌های فیلتر وضعیت به سبک پروژه نمونه */}
            <div className="flex gap-1.5">
              {[
                { id: "all", label: "همه" },
                { id: "active", label: "فعال" },
                { id: "suspended", label: "تعلیق‌شده" }
              ].map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setFilterStatus(s.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === s.id ? "bg-primary-600 text-white shadow-sm" : "bg-surface-muted text-slate-600 hover:bg-slate-200"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* فیلتر پکیج‌ها با استایل منسجم بدون دفرمه شدن */}
            <div className="flex items-center gap-2 pr-1">
              <span className="text-xs font-bold text-slate-400 shrink-0">پکیج:</span>
              <select 
                className="bg-surface-muted hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl h-9 px-3 cursor-pointer outline-none focus:ring-2 focus:ring-primary-500 border-none transition-all"
                value={filterPlan}
                onChange={e => setFilterPlan(e.target.value)}
                style={{ minWidth: "140px", appearance: "auto" }}
              >
                <option value="all">همه پکیج‌ها</option>
                {plansList.map(plan => (
                  <option key={plan} value={plan}>{plan}</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Table Container (تک لایه تمیز هماهنگ با پروژه نمونه بدون تداخل حاشیه‌ها) */}
      <div className="table-container">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-xl">
            <Loader2 className="animate-spin text-primary-500" size={32} />
            <p className="text-xs text-slate-400 font-bold">در حال دریافت اطلاعات کلینیک‌ها...</p>
          </div>
        ) : filteredClinics.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold text-sm">هیچ کلینیکی یافت نشد</p>
            <button onClick={() => {setSearch(""); setFilterStatus("all"); setFilterPlan("all");}} className="text-primary-600 text-xs mt-1.5 font-bold">پاک کردن فیلترها</button>
          </div>
        ) : (
          <table className="w-full text-right border-collapse">
            <thead>
              <tr>
                <th>نام کلینیک</th>
                <th>مدیر مطب</th>
                <th>تخصص</th>
                <th className="text-center">وضعیت اشتراک</th>
                <th className="text-center">پکیج</th>
                <th className="text-center">انقضا</th>
                <th className="text-center">نوبت این ماه</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredClinics.map(c => (
                <tr key={c.id}>
                  {/* نام کلینیک */}
                  <td>
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors text-right">{c.name}</p>
                      {/* حل کامل مشکل چپ‌چین شدن اسلاگ با استایل اختصاصی تراز راست */}
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5" style={{ direction: "ltr", textAlign: "right" }}>smartnobat.ir/{c.slug}</p>
                    </div>
                  </td>

                  {/* مدیر مطب */}
                  <td>
                    <div>
                      <p className="text-sm font-bold text-slate-700 text-right">{c.owner?.full_name || c.doctor_name || "—"}</p>
                      {/* حل کامل مشکل تراز راست شماره همراه */}
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5" style={{ direction: "ltr", textAlign: "right" }}>{c.owner?.mobile || "—"}</p>
                    </div>
                  </td>

                  {/* تخصص */}
                  <td className="text-slate-600 font-medium">{c.specialty || "—"}</td>

                  {/* وضعیت اشتراک */}
                  <td className="text-center align-middle">
                    <div className="flex justify-center">
                      <Badge status={ClinicStatus(c.is_active)} />
                    </div>
                  </td>

                  {/* پکیج */}
                  <td className="text-center align-middle text-xs font-bold text-slate-700">
                    {c.plan}
                  </td>

                  {/* انقضا */}
                  <td className="text-center align-middle text-slate-600 text-xs font-semibold">
                    {toJalaali(c.plan_expiry)}
                  </td>

                  {/* نوبت این ماه */}
                  <td className="text-center align-middle font-bold text-slate-700">
                    {fmt(c.appointments_this_month || 0)}
                  </td>

                  {/* عملیات */}
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openDetail(c.id)}
                        className="p-1.5 bg-transparent text-slate-400 hover:text-blue-600 transition-colors rounded-lg" title="مشاهده کامل">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => handleImpersonate(c.id)}
                        className="p-1.5 bg-transparent text-slate-400 hover:text-amber-500 transition-colors rounded-lg" title="ورود به پنل">
                        <LogIn size={15} />
                      </button>
                      <button onClick={() => handleToggle(c.id, c.is_active ? "suspend" : "reactivate")}
                        disabled={actionLoading === c.id}
                        className={`p-1.5 bg-transparent text-slate-400 transition-colors rounded-lg ${c.is_active ? "hover:text-red-500" : "hover:text-emerald-500"}`}
                        title={c.is_active ? "تعلیق کلینیک" : "فعال‌سازی مجدد"}>
                        {actionLoading === c.id ? <Loader2 size={13} className="animate-spin text-slate-400" /> : c.is_active ? <Ban size={15} /> : <Play size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
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
                          <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1"><ShieldCheck size={12}/> تاریخ ثبت کلینیک</p>
                          <p className="text-sm font-bold text-slate-800">{toJalaali(selected.created_at)}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl">
                          <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1"><ShieldCheck size={12}/> انقضای اشتراک</p>
                          <p className="text-sm font-bold text-slate-800">{toJalaali(selected.plan_expiry)}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl sm:col-span-2">
                          <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1"><ShieldCheck size={12}/> وضعیت سیستمی</p>
                          <div className="mt-1">
                            <Badge status={ClinicStatus(selected.is_active)} />
                          </div>
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
                          {selected.staff.map(s => {
                            const rInfo = roleFormat(s.role);
                            return (
                              <div key={s.id} className="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${rInfo.avatarClass}`}>
                                    {s.full_name?.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-slate-700">{s.full_name}</p>
                                    <p className="text-[11px] text-slate-400 ltr text-right">{s.mobile}</p>
                                  </div>
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${rInfo.badgeClass}`}>
                                  {rInfo.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
              <button onClick={() => handleImpersonate(selected.id)}
                className="btn-primary justify-center h-12 rounded-2xl text-xs font-bold shadow-lg shadow-primary-100">
                <LogIn size={16} /> ورود به پنل
              </button>
              
              <button onClick={() => handleToggle(selected.id, selected.is_active ? "suspend" : "reactivate")}
                className={`justify-center h-12 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-2xl transition-all shadow-sm ${selected.is_active ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"}`}>
                {selected.is_active ? <><Ban size={15} /> تعلیق</> : <><Play size={15} /> فعال‌سازی</>}
              </button>

              <button onClick={() => openEditModal(selected)}
                className="btn-secondary justify-center h-12 rounded-2xl text-xs font-bold hover:bg-slate-200">
                <Edit2 size={16} /> ویرایش اطلاعات
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
          <div className="modal-content max-w-md h-fit border border-slate-100" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
              <h3 className="text-base font-bold text-slate-800">افزودن کلینیک جدید</h3>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-surface-muted text-slate-500"><X size={20} /></button>
            </div>
            
            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">نام مطب / کلینیک <span className="text-red-500">*</span></label>
                <input className="input focus:ring-primary-500" value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: مرکز درمانی تخصصی پارس" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">آدرس اختصاصی URL (اسلاگ) <span className="text-slate-400 font-normal">(اختیاری)</span></label>
                <div className="relative">
                  <input className="input ltr text-left pl-28 font-mono focus:ring-primary-500" value={createForm.slug || ""} onChange={e => setCreateForm(p => ({ ...p, slug: e.target.value }))} placeholder="dr-yousefi" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">smartnobat.ir/</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">در صورت خالی بودن، اسلاگ به صورت خودکار از نام مطب ساخته خواهد شد.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">نام پزشک</label>
                  <input className="input focus:ring-primary-500" value={createForm.doctor_name} onChange={e => setCreateForm(p => ({ ...p, doctor_name: e.target.value }))} placeholder="دکتر ..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">شماره همراه <span className="text-red-500">*</span></label>
                  <input className="input ltr text-left focus:ring-primary-500" value={createForm.doctor_mobile} onChange={e => setCreateForm(p => ({ ...p, doctor_mobile: e.target.value }))} placeholder="09123456789" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">تخصص پزشک</label>
                <input className="input focus:ring-primary-500" value={createForm.specialty} onChange={e => setCreateForm(p => ({ ...p, specialty: e.target.value }))} placeholder="مثال: قلب و عروق" />
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

      {/* Edit Modal */}
      {showEdit && (
        <div className="modal-backdrop" onClick={() => setShowEdit(false)}>
          <div className="modal-content max-w-lg h-fit border border-slate-100" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
              <div>
                <h3 className="text-base font-bold text-slate-800">ویرایش اطلاعات کلینیک</h3>
                <p className="text-[11px] text-slate-400 mt-1">مشخصات عمومی و آدرس اختصاصی کلینیک را ویرایش کنید</p>
              </div>
              <button onClick={() => setShowEdit(false)} className="p-1.5 rounded-lg hover:bg-surface-muted text-slate-500"><X size={20} /></button>
            </div>
            
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">نام مطب / کلینیک <span className="text-red-500">*</span></label>
                <input className="input focus:ring-primary-500" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: کلینیک دندانپزشکی آریا" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">آدرس اختصاصی URL (اسلاگ) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input className="input ltr text-left pl-28 font-mono focus:ring-primary-500" value={editForm.slug} onChange={e => setEditForm(p => ({ ...p, slug: e.target.value }))} placeholder="dr-yousefi" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">smartnobat.ir/</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">نام پزشک</label>
                  <input className="input focus:ring-primary-500" value={editForm.doctor_name} onChange={e => setEditForm(p => ({ ...p, doctor_name: e.target.value }))} placeholder="دکتر ..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">تخصص پزشک</label>
                  <input className="input focus:ring-primary-500" value={editForm.specialty} onChange={e => setEditForm(p => ({ ...p, specialty: e.target.value }))} placeholder="مثال: قلب و عروق" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">شماره همراه کلینیک</label>
                  <input className="input ltr text-left focus:ring-primary-500" value={editForm.mobile} onChange={e => setEditForm(p => ({ ...p, mobile: e.target.value }))} placeholder="09123456789" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">تلفن ثابت مطب</label>
                  <input className="input ltr text-left focus:ring-primary-500" value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} placeholder="02112345678" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">آدرس فیزیکی مطب</label>
                <textarea className="input min-h-[60px] leading-relaxed focus:ring-primary-500" value={editForm.address} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))} placeholder="تهران، خیابان آزادی، ساختمان پزشکان پارس، طبقه ۳" />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-surface-border bg-slate-50/80 flex gap-3">
              <button onClick={() => setShowEdit(false)} className="btn-secondary flex-1 justify-center py-2.5">انصراف</button>
              <button onClick={handleUpdateClinic} disabled={updating} className="btn-primary flex-1 justify-center py-2.5 shadow-lg shadow-primary-200">
                {updating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
