import React, { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Filter, Search, Globe } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

export default function TransactionsTable({ transactions }) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((trx) => {
      // فیلتر نوع
      let matchesType = filterType === 'all';
      if (filterType === 'prepayment') matchesType = trx.isPrepayment === true;
      if (filterType === 'services') matchesType = trx.isPrepayment === false;
      if (filterType === 'income') matchesType = trx.type === 'income';

      // جستجو
      const q = searchQuery || '';
      const matchesSearch =
        (trx.patient && trx.patient.includes(q)) ||
        (trx.service && trx.service.includes(q));

      return matchesType && matchesSearch;
    });
  }, [filterType, searchQuery, transactions]);

  return (
    <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
        <h3 className="font-black text-xl text-gray-800">تراکنش‌های صندوق</h3>

        <div className="flex gap-3 relative">
          <div className="relative">
            <Search className="absolute right-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="جستجوی نام بیمار..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-2xl py-3 pr-11 pl-4 text-sm w-64 focus:outline-none focus:border-brand focus:bg-white transition-all"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`p-3 rounded-2xl border transition-all ${
                filterType !== 'all'
                  ? 'bg-brand text-white border-brand'
                  : 'bg-gray-50 text-gray-500 border-gray-100 hover:text-brand'
              }`}
            >
              <Filter size={20} />
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-2 animate-in fade-in zoom-in duration-200">
                <div className="text-[10px] font-bold text-gray-400 px-3 py-2 uppercase">
                  فیلتر بر اساس نوع
                </div>
                {[
                  { key: 'all', label: 'همه تراکنش‌ها' },
                  { key: 'prepayment', label: '🌐 رزرو آنلاین' },
                  { key: 'services', label: '📋 خدمات' },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => {
                      setFilterType(t.key);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      filterType === t.key
                        ? 'bg-brand-light text-brand'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black border-b border-gray-100 uppercase tracking-widest">
              <th className="py-5 pr-8">بیمار / شرح</th>
              <th className="py-5 text-center">نوع</th>
              <th className="py-5 text-center">مبلغ (تومان)</th>
              <th className="py-5">تاریخ</th>
              <th className="py-5 pl-8 text-center">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400">
                  تراکنشی یافت نشد.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((trx) => (
                <tr key={trx.id} className="group hover:bg-gray-50 transition-all">
                  {/* بیمار / شرح */}
                  <td className="py-6 pr-8">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          trx.isPrepayment
                            ? 'bg-green-50 text-green-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {trx.isPrepayment ? (
                          <Globe size={18} />
                        ) : (
                          <ArrowDownLeft size={18} />
                        )}
                      </div>
                      <div>
                        <div className="font-black text-gray-800 text-sm">{trx.patient}</div>
                        <div className="text-[10px] text-gray-400 font-bold">{trx.service}</div>
                        {trx.refId && (
                          <div className="text-[9px] text-green-500 mt-0.5">
                            کد پیگیری: {trx.refId}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* نوع */}
                  <td className="py-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                        trx.isPrepayment
                          ? 'bg-green-50 text-green-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {trx.isPrepayment ? 'رزرو آنلاین' : 'خدمات'}
                    </span>
                  </td>

                  {/* مبلغ */}
                  <td className="py-6 text-center font-black text-gray-800">
                    {formatPrice(trx.amount)}
                  </td>

                  {/* تاریخ */}
                  <td className="py-6 text-xs font-bold text-gray-500">{trx.date}</td>

                  {/* وضعیت */}
                  <td className="py-6 pl-8 text-center">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black border bg-green-50 text-green-600 border-green-100">
                      موفق
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}