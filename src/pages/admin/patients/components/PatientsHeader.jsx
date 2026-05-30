import React from 'react';
import { Search, UserPlus, User, Shield, Upload } from 'lucide-react';

const PatientsHeader = ({
  loading, filteredCount, searchTerm, setSearchTerm,
  filterInsurance, setFilterInsurance, openAddModal, openImportModal
}) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-brand-dark" />
            لیست پرونده‌ها
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {!loading && `${filteredCount} بیمار`}
            {!loading && searchTerm && ` • جستجو: "${searchTerm}"`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openImportModal}
            className="bg-white text-brand-dark px-4 py-3 rounded-xl flex items-center gap-2 border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Upload size={18} />
            <span className="font-bold text-sm">آپلود اکسل</span>
          </button>
          <button
            onClick={openAddModal}
            className="bg-brand-dark text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg"
          >
            <UserPlus size={20} />
            <span className="font-bold">بیمار جدید</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="relative md:col-span-2">
          <Search className="absolute right-3 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="جستجو (نام، کدملی، موبایل)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-xl py-3 pr-10 pl-4 border border-gray-200 focus:border-brand focus:outline-none"
          />
        </div>
        <div className="relative">
          <Shield className="absolute right-3 top-3.5 text-gray-400" size={18} />
          <select
            value={filterInsurance}
            onChange={(e) => setFilterInsurance(e.target.value)}
            className="w-full bg-white rounded-xl py-3 pr-10 pl-4 border border-gray-200 focus:border-brand focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">همه بیمه‌ها</option>
            <option value="tamin">تامین اجتماعی</option>
            <option value="salamat">سلامت</option>
            <option value="armed">نیروهای مسلح</option>
            <option value="none">آزاد</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PatientsHeader;
