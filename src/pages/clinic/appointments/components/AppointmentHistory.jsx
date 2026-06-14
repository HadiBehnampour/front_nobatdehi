import React, { useState } from 'react';
import { History, FileText, X, Printer, Globe } from 'lucide-react';

// ─── مودال فاکتور ──────────────────────────────────────────
const InvoiceViewModal = ({ apt, onClose }) => {
  const allServices = apt.services || [];
  const servicesTotal = allServices.reduce((sum, s) => sum + s.price, 0);
  const prepayment = apt.prepayment;
  const prepaymentAmount = prepayment?.amount || 0;
  const grandTotal = servicesTotal + prepaymentAmount;

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Tahoma, Arial, sans-serif; padding: 30px; background: #fff; color: #333; }
          .header { text-align: center; margin-bottom: 25px; }
          .header h1 { font-size: 20px; margin-bottom: 5px; }
          .line { width: 60px; height: 2px; background: #ccc; margin: 8px auto; }
          .info { background: #f8f8f8; border-radius: 10px; padding: 15px; margin-bottom: 20px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
          .info-label { color: #888; }
          .info-value { font-weight: bold; }
          .section-title { font-size: 12px; color: #888; font-weight: bold; margin-bottom: 10px; }
          .prepayment-box { background: #e8f5e9; border: 1px solid #a5d6a7; border-radius: 10px; padding: 12px 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
          .prepayment-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #2e7d32; }
          .prepayment-badge { background: #c8e6c9; color: #1b5e20; padding: 2px 8px; border-radius: 20px; font-size: 10px; }
          .prepayment-amount { font-weight: bold; font-size: 14px; color: #1b5e20; }
          .table { width: 100%; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
          .table-header { display: flex; justify-content: space-between; padding: 8px 15px; background: #f0f0f0; font-size: 11px; font-weight: bold; color: #888; }
          .table-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; font-size: 13px; border-top: 1px solid #f0f0f0; }
          .price { font-weight: bold; font-family: monospace; }
          .subtotal { display: flex; justify-content: space-between; padding: 10px 0; font-size: 13px; color: #666; }
          .total { border-top: 2px dashed #ccc; padding-top: 15px; display: flex; justify-content: space-between; align-items: center; }
          .total-amount { font-size: 22px; font-weight: 900; }
          .footer { text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #aaa; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header"><h1>🧾 صورتحساب</h1><div class="line"></div></div>
        <div class="info">
          <div class="info-row"><span class="info-label">نام بیمار:</span><span class="info-value">${apt.patient || '-'}</span></div>
          <div class="info-row"><span class="info-label">شماره تماس:</span><span class="info-value" dir="ltr">${apt.mobile || '-'}</span></div>
          <div class="info-row"><span class="info-label">تاریخ:</span><span class="info-value">${apt.date || '-'}</span></div>
          <div class="info-row"><span class="info-label">ساعت:</span><span class="info-value">${apt.time || '-'}</span></div>
        </div>
        
        ${prepaymentAmount > 0 ? `
          <p class="section-title">پیش‌پرداخت:</p>
          <div class="prepayment-box">
            <div class="prepayment-label">
              <span>💳</span>
              <span>هزینه رزرو نوبت</span>
              <span class="prepayment-badge">پرداخت آنلاین ✓</span>
            </div>
            <span class="prepayment-amount">${prepaymentAmount.toLocaleString()} تومان</span>
          </div>
        ` : ''}
        
        <p class="section-title">خدمات ارائه شده:</p>
        <div class="table">
          <div class="table-header"><span>شرح خدمت</span><span>مبلغ (تومان)</span></div>
          ${allServices.map(s => `
            <div class="table-row">
              <span>${s.service_name} (${s.added_by === 'doctor' ? 'پزشک' : 'منشی'})</span>
              <span class="price">${s.price.toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
        
        ${prepaymentAmount > 0 ? `
          <div class="subtotal"><span>جمع خدمات:</span><span>${servicesTotal.toLocaleString()} تومان</span></div>
          <div class="subtotal"><span>پیش‌پرداخت رزرو:</span><span>${prepaymentAmount.toLocaleString()} تومان</span></div>
        ` : ''}
        
        <div class="total">
          <span style="font-size:14px;font-weight:bold;color:#555">مجموع کل:</span>
          <span class="total-amount">${grandTotal.toLocaleString()} <span style="font-size:11px;color:#aaa">تومان</span></span>
        </div>
        <div class="footer"><p>با تشکر از مراجعه شما</p></div>
      </body>
      </html>
    `;
    const win = window.open('', '_blank', 'width=400,height=600');
    win.document.write(printContent);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* هدر */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText size={20} className="text-green-600" />
            فاکتور: {apt.patient}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* محتوا */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* اطلاعات بیمار */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">نام بیمار:</span>
              <span className="text-sm font-bold text-gray-800">{apt.patient}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">شماره تماس:</span>
              <span className="text-sm font-mono text-gray-700" dir="ltr">{apt.mobile}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">تاریخ:</span>
              <span className="text-sm font-mono text-gray-700">{apt.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">ساعت:</span>
              <span className="text-sm font-mono text-gray-700">{apt.time}</span>
            </div>
          </div>

          {/* ✅ پیش‌پرداخت رزرو */}
          {prepaymentAmount > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 mb-3">پیش‌پرداخت:</p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-800">هزینه رزرو نوبت</span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      پرداخت آنلاین ✓
                    </span>
                  </div>
                  <span className="font-mono font-bold text-green-700">
                    {prepaymentAmount.toLocaleString()}
                  </span>
                </div>
                {prepayment?.refId && (
                  <div className="mt-2 text-[10px] text-green-600">
                    کد پیگیری: {prepayment.refId}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* خدمات */}
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-500 mb-3">خدمات ارائه شده:</p>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex justify-between px-4 py-2 bg-gray-100 text-xs font-bold text-gray-500">
                <span>شرح خدمت</span>
                <span>مبلغ (تومان)</span>
              </div>
              {allServices.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-400 text-sm">
                  خدماتی ثبت نشده
                </div>
              ) : (
                allServices.map((s, idx) => (
                  <div key={s.id || idx}
                    className={`flex justify-between items-center px-4 py-3 text-sm
                      ${idx < allServices.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="font-medium text-gray-700">{s.service_name}</span>
                      <span className="text-[10px] text-gray-400">
                        ({s.added_by === 'doctor' ? 'پزشک' : 'منشی'})
                      </span>
                    </div>
                    <span className="font-mono font-bold text-gray-800">
                      {s.price.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* جمع‌بندی */}
          <div className="border-t-2 border-dashed border-gray-300 pt-4 space-y-2">
            {prepaymentAmount > 0 && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">جمع خدمات:</span>
                  <span className="font-mono text-gray-600">{servicesTotal.toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">پیش‌پرداخت رزرو:</span>
                  <span className="font-mono text-green-600">{prepaymentAmount.toLocaleString()} تومان</span>
                </div>
                <div className="border-t border-gray-200 pt-2"></div>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600">مجموع کل:</span>
              <span className="text-xl font-black text-gray-900">
                {grandTotal.toLocaleString()}
                <span className="text-xs text-gray-400 mr-1">تومان</span>
              </span>
            </div>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={handlePrint}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Printer size={16} />چاپ
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            بستن
          </button>
        </div>

      </div>
    </div>
  );
};

// ─── کامپوننت اصلی ──────────────────────────────────────────
const AppointmentHistory = ({ history }) => {
  const [viewInvoice, setViewInvoice] = useState(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <History className="text-gray-500" size={20} />
        <h2 className="font-bold text-gray-700">نوبت‌های انجام شده</h2>
        <span className="text-xs text-gray-400">({history.length} نوبت)</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* هدر */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500">
          <div className="col-span-1">ساعت</div>
          <div className="col-span-3">بیمار</div>
          <div className="col-span-3">موبایل</div>
          <div className="col-span-3">مبلغ کل</div>
          <div className="col-span-2 text-left">فاکتور</div>
        </div>

        {history.length === 0 ? (
          <div className="py-16 text-center">
            <History className="mx-auto mb-3 text-gray-300" size={40} />
            <p className="text-gray-400 text-sm">نوبت انجام شده‌ای در این روز ثبت نشده</p>
          </div>
        ) : (
          history.map(apt => {
            const servicesTotal = apt.services?.reduce((sum, s) => sum + s.price, 0) || 0;
            const prepaymentAmount = apt.prepayment?.amount || 0;
            const total = servicesTotal + prepaymentAmount;

            return (
              <div key={apt.id}
                className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-gray-100 last:border-0 text-sm hover:bg-gray-50 transition-colors">

                {/* ساعت */}
                <div className="col-span-1 font-mono font-bold text-gray-700">
                  {apt.time}
                </div>

                {/* بیمار */}
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {apt.patient?.[0] || '?'}
                    </div>
                    <span className="text-gray-800 truncate">{apt.patient || 'نامشخص'}</span>
                  </div>
                </div>

                {/* موبایل */}
                <div className="col-span-3 text-gray-500 font-mono text-xs" dir="ltr">
                  {apt.mobile || '—'}
                </div>

                {/* مبلغ */}
                <div className="col-span-3">
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-mono text-xs font-bold">
                      {total.toLocaleString()} <span className="text-gray-400">تومان</span>
                    </span>
                    {prepaymentAmount > 0 && (
                      <span className="text-[10px] text-green-600">
                        شامل {prepaymentAmount.toLocaleString()} رزرو آنلاین
                      </span>
                    )}
                  </div>
                </div>

                {/* فاکتور */}
                <div className="col-span-2 text-left">
                  <button onClick={() => setViewInvoice(apt)}
                    className="flex items-center gap-1 px-3 py-1.5 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors">
                    <FileText size={13} />مشاهده
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* مودال فاکتور */}
      {viewInvoice && (
        <InvoiceViewModal
          apt={viewInvoice}
          onClose={() => setViewInvoice(null)}
        />
      )}
    </div>
  );
};

export default AppointmentHistory;