import { useState, useEffect } from "react";
import { Search, Plus, Ban, LogIn, Eye, Play, X, Loader2, Building2, Users, ChevronLeft } from "lucide-react";
import apiClient from "../../api/core";

import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";

const PLAN_LABELS = { vip: "پیشرفته VIP", standard: "استاندارد", trial: "آزمایشی", economy: "اقتصادی" };

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
    try {
      const r = await apiClient.get(`/platform/clinics/${clinicId}/`);
      setSelected(r.data);
    } catch (e) { console.error(e); }
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
      // Open in new tab
      const impersonateData = { access: d.access, refresh: d.refresh, user: d.user };
      const url = `/admin/dashboard?impersonate=1`;
      const win = window.open(url, "_blank");
      // Set tokens in new tab
      setTimeout(() => {
        try {
          win.localStorage.setItem("access", d.access);
          win.localStorage.setItem("refresh", d.refresh);
          win.localStorage.setItem("user", JSON.stringify(d.user));
          win.location.reload();
        } catch { /* cross-origin fallback */ }
      }, 500);
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
    } catch (e) { alert(e?.response?.data?.error || "خطا"); }
    finally { setCreating(false); }
  };

  const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);

  return (
    <div className="space-y-5 fade-in" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">مدیریت کلینیک‌ها</h1>
          <p className="text-sm text-slate-500 mt-0.5">{clinics.length} مستأجر در سیستم</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus size={16} />افزودن کلینیک
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pr-9" placeholder="جستجو در کلینیک‌ها..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["all", "active", "trial", "suspended"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition ${filterStatus === s ? "bg-primary-600 text-white" : "bg-surface-muted text-slate-600 hover:bg-surface-border"}`}>
                {s === "all" ? "همه" : s === "active" ? "فعال" : s === "trial" ? "آزمایشی" : "تعلیق‌شده"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>
      ) : clinics.length === 0 ? (
        <div className="card text-center py-16">
          <Building2 size={40} className="mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 font-medium">کلینیکی یافت نشد</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>نام کلینیک</th>
                <th>پزشک اصلی</th>
                <th>تخصص</th>
                <th>وضعیت</th>
                <th>پکیج</th>
                <th>انقضا</th>
                <th>بیماران</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clinics.map(c => (
                <tr key={c.id}>
                  <td>
                    <p className="font-medium text-slate-800">{c.name}</p>
                    <p className="text-[11px] text-slate-400">{c.slug}.smartnobat.ir</p>
                  </td>
                  <td>
                    <p className="text-slate-700">{c.owner?.full_name || c.doctor_name || "—"}</p>
                    <p className="text-[11px] text-slate-400 ltr text-left">{c.owner?.mobile || "—"}</p>
                  </td>
                  <td className="text-slate-600">{c.specialty || "—"}</td>
                  <td><Badge status={ClinicStatus(c.is_active)} /></td>
                  <td>
                    <span className="text-xs font-medium text-primary-600">
                      {PLAN_LABELS[c.plan] || c.plan}
                    </span>
                  </td>
                  <td className="text-slate-600 text-xs">{c.plan_expiry || "—"}</td>
                  <td className="font-medium text-slate-700">{fmt(c.patient_count)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openDetail(c.id)}
                        className="p-1.5 rounded-lg hover:bg-surface-muted text-slate-500 hover:text-primary-600" title="جزئیات">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => handleImpersonate(c.id)}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-500 hover:text-amber-600" title="ورود جعلی">
                        <LogIn size={15} />
                      </button>
                      <button onClick={() => handleToggle(c.id, c.is_active ? "suspend" : "reactivate")}
                        disabled={actionLoading === c.id}
                        className={`p-1.5 rounded-lg ${c.is_active ? "hover:bg-red-50 text-slate-500 hover:text-red-600" : "hover:bg-emerald-50 text-slate-500 hover:text-emerald-600"}`}
                        title={c.is_active ? "تعلیق" : "فعال‌سازی"}>
                        {actionLoading === c.id ? <Loader2 size={15} className="animate-spin" /> : c.is_active ? <Ban size={15} /> : <Play size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelected(null)} />
          <div className="fixed top-0 left-0 h-full w-full max-w-md bg-white z-50 shadow-elevated overflow-y-auto" dir="rtl">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-surface-border px-5 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-slate-800">جزئیات: {selected.name}</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-surface-muted"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {detailLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-500" size={24} /></div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Tenant ID", <span className="text-[10px] font-mono break-all">{selected.id}</span>],
                      ["ساب‌دامین", `${selected.slug}.smartnobat.ir`],
                      ["پزشک اصلی", selected.owner?.full_name || selected.doctor_name],
                      ["موبایل", <span className="ltr text-left">{selected.owner?.mobile || selected.mobile}</span>],
                      ["تخصص", selected.specialty || "—"],
                      ["آدرس", selected.address || "—"],
                      ["وضعیت", <Badge status={ClinicStatus(selected.is_active)} />],
                      ["بیماران", fmt(selected.patient_count)],
                      ["پرسنل", fmt(selected.staff_count)],
                      ["پکیج", PLAN_LABELS[selected.plan] || selected.plan],
                      ["انقضای اشتراک", selected.plan_expiry || "—"],
                      ["پیامک مصرفی", `${selected.sms_used || 0} از ${selected.sms_quota || 500}`],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-surface-muted rounded-xl px-4 py-3">
                        <p className="text-[11px] text-slate-500 mb-1">{k}</p>
                        <div className="text-sm font-medium text-slate-800">{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Staff list */}
                  {selected.staff?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2">پرسنل</p>
                      <div className="space-y-2">
                        {selected.staff.map(s => (
                          <div key={s.id} className="flex items-center justify-between bg-surface-muted rounded-xl px-4 py-2.5">
                            <div>
                              <p className="text-sm font-medium text-slate-700">{s.full_name}</p>
                              <p className="text-[11px] text-slate-400 ltr text-left">{s.mobile}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${s.role === "doctor" ? "bg-blue-100 text-blue-700" : s.role === "secretary" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>
                              {s.role === "doctor" ? "پزشک" : s.role === "secretary" ? "منشی" : "مدیر"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => handleImpersonate(selected.id)}
                      className="btn-secondary flex-1 justify-center"><LogIn size={15} />ورود جعلی</button>
                    <button onClick={() => { handleToggle(selected.id, selected.is_active ? "suspend" : "reactivate"); }}
                      className={`flex-1 justify-center inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors ${selected.is_active ? "bg-red-50 hover:bg-red-100 text-red-600" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"}`}>
                      {selected.is_active ? <><Ban size={15} />تعلیق</> : <><Play size={15} />فعال‌سازی</>}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-elevated" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
              <h3 className="font-bold text-slate-800">افزودن کلینیک جدید</h3>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-surface-muted"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">نام مطب <span className="text-red-400">*</span></label>
                <input className="input" value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: کلینیک دکتر اکبری" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">نام پزشک</label>
                <input className="input" value={createForm.doctor_name} onChange={e => setCreateForm(p => ({ ...p, doctor_name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">شماره موبایل پزشک <span className="text-red-400">*</span></label>
                <input className="input ltr text-left" value={createForm.doctor_mobile} onChange={e => setCreateForm(p => ({ ...p, doctor_mobile: e.target.value }))} placeholder="09123456789" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">تخصص</label>
                <input className="input" value={createForm.specialty} onChange={e => setCreateForm(p => ({ ...p, specialty: e.target.value }))} />
              </div>
              <button onClick={handleCreate} disabled={creating}
                className="btn-primary w-full justify-center py-3">
                {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                ساخت کلینیک
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
