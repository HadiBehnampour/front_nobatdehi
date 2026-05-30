// pages/auth/components/ProfileStep.jsx
import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { AUTH_MESSAGES, PERSIAN_MONTHS } from '../constants/messages';

const baseInputCls = (hasError) =>
  `w-full bg-slate-50/70 border-2 rounded-lg py-2 px-3 text-xs text-slate-800
   focus:outline-none focus:bg-white transition-all ${
     hasError
       ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
       : 'border-slate-200 focus:border-[#8BC4F0] focus:ring-2 focus:ring-[#BCDEFB]/40'
   }`;

const FieldLabel = ({ children, required }) => (
  <label className="block text-[10px] font-bold text-slate-600 mb-1">
    {children}
    {required && <span className="text-rose-400 mr-0.5">*</span>}
  </label>
);

const ProfileStep = ({
  profile,
  onFieldChange,
  onSubmit,
  loading,
  error,
  fieldErrors,
  mobile,
}) => {
  const { profileStep } = AUTH_MESSAGES;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Header — NO icon box */}
      <div className="text-center">
        <h2 className="text-lg font-extrabold text-slate-800 mb-1">{profileStep.title}</h2>
        <p className="text-[11px] text-slate-500 leading-relaxed">{profileStep.subtitle}</p>
      </div>

      {/* Verified phone confirmation chip */}
      <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-50 border border-emerald-100 rounded-lg text-[11px] text-emerald-700">
        <CheckCircle2 size={12} />
        <span>شماره</span>
        <span dir="ltr" className="font-bold tracking-wider">{mobile}</span>
        <span>تأیید شد</span>
      </div>

      {/* Compact form — fits without scroll */}
      <div className="space-y-2.5">
        {/* Row 1: Name + National ID */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <FieldLabel required>{profileStep.fields.fullName}</FieldLabel>
            <input
              type="text"
              placeholder={profileStep.placeholders.fullName}
              className={baseInputCls(!!fieldErrors.fullName)}
              value={profile.fullName}
              onChange={(e) => onFieldChange('fullName', e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <FieldLabel required>{profileStep.fields.nationalId}</FieldLabel>
            <input
              type="text"
              dir="ltr"
              inputMode="numeric"
              placeholder={profileStep.placeholders.nationalId}
              className={`${baseInputCls(!!fieldErrors.nationalId)} text-left tracking-widest`}
              value={profile.nationalId}
              onChange={(e) =>
                onFieldChange('nationalId', e.target.value.replace(/\D/g, '').slice(0, 10))
              }
              maxLength={10}
              disabled={loading}
            />
          </div>
        </div>

        {/* Row 2: Date of birth — Day(input) / Month(select) / Year(input) */}
        <div>
          <FieldLabel required>{profileStep.fields.dateOfBirth}</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            {/* Day — typed */}
            <input
              type="text"
              dir="ltr"
              inputMode="numeric"
              placeholder={profileStep.placeholders.day}
              className={`${baseInputCls(!!fieldErrors.birthDay)} text-center`}
              value={profile.birthDay}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                const n = parseInt(v, 10);
                if (v === '' || (n >= 0 && n <= 31)) {
                  onFieldChange('birthDay', v);
                }
              }}
              maxLength={2}
              disabled={loading}
            />
            {/* Month — only this stays as select */}
            <select
              className={`${baseInputCls(!!fieldErrors.birthMonth)} cursor-pointer`}
              value={profile.birthMonth}
              onChange={(e) => onFieldChange('birthMonth', e.target.value)}
              disabled={loading}
            >
              <option value="">{profileStep.fields.month}</option>
              {PERSIAN_MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            {/* Year — typed (no dropdown) */}
            <input
              type="text"
              dir="ltr"
              inputMode="numeric"
              placeholder={profileStep.placeholders.year}
              className={`${baseInputCls(!!fieldErrors.birthYear)} text-center`}
              value={profile.birthYear}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                onFieldChange('birthYear', v);
              }}
              maxLength={4}
              disabled={loading}
            />
          </div>
        </div>

        {/* Row 3: Sex + Primary insurance */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <FieldLabel required>{profileStep.fields.biologicalSex}</FieldLabel>
            <select
              className={`${baseInputCls(!!fieldErrors.biologicalSex)} cursor-pointer`}
              value={profile.biologicalSex}
              onChange={(e) => onFieldChange('biologicalSex', e.target.value)}
              disabled={loading}
            >
              <option value="">{profileStep.placeholders.select}</option>
              {profileStep.sexOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel required>{profileStep.fields.primaryInsurance}</FieldLabel>
            <select
              className={`${baseInputCls(!!fieldErrors.primaryInsurance)} cursor-pointer`}
              value={profile.primaryInsurance}
              onChange={(e) => onFieldChange('primaryInsurance', e.target.value)}
              disabled={loading}
            >
              <option value="">{profileStep.placeholders.select}</option>
              {profileStep.insuranceOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Secondary + Address */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <FieldLabel>{profileStep.fields.secondaryInsurance}</FieldLabel>
            <select
              className={`${baseInputCls(false)} cursor-pointer`}
              value={profile.secondaryInsurance}
              onChange={(e) => onFieldChange('secondaryInsurance', e.target.value)}
              disabled={loading}
            >
              {profileStep.supplementaryOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel required>{profileStep.fields.physicalAddress}</FieldLabel>
            <input
              type="text"
              placeholder={profileStep.placeholders.address}
              className={baseInputCls(!!fieldErrors.physicalAddress)}
              value={profile.physicalAddress}
              onChange={(e) => onFieldChange('physicalAddress', e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Server error */}
      {error && !Object.keys(fieldErrors).length && (
        <div className="p-2 bg-rose-50 border border-rose-100 text-rose-600 text-[11px] rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Submit CTA */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-white font-bold rounded-xl shadow-lg text-sm
          active:scale-[0.98] transition-all flex justify-center items-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        style={{
          background: loading
            ? '#A8D2F5'
            : 'linear-gradient(to left, #6CB1E8, #8BC4F0)',
          boxShadow: '0 10px 20px -8px rgba(108, 177, 232, 0.4)',
        }}
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : profileStep.cta}
      </button>
    </form>
  );
};

export default ProfileStep;
