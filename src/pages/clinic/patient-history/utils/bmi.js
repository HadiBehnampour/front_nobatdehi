export const calcBMI = (weight, height) => {
  if (!weight || !height || height <= 0) return null;
  const h = Number(height) / 100;
  const w = Number(weight);
  return Math.round((w / (h * h)) * 10) / 10;
};

export const getBMIColor = (bmi) => {
  if (!bmi) return 'text-gray-400';
  if (bmi < 18.5) return 'text-blue-500';
  if (bmi < 25) return 'text-green-600';
  if (bmi < 30) return 'text-orange-500';
  return 'text-red-600';
};

export const getBMIBgColor = (bmi) => {
  if (!bmi) return 'bg-gray-50';
  if (bmi < 18.5) return 'bg-blue-50';
  if (bmi < 25) return 'bg-green-50';
  if (bmi < 30) return 'bg-orange-50';
  return 'bg-red-50';
};

export const getBMILabel = (bmi) => {
  if (!bmi) return '';
  if (bmi < 18.5) return 'کمبود وزن';
  if (bmi < 25) return 'نرمال';
  if (bmi < 30) return 'اضافه وزن';
  return 'چاقی';
};

export const getTodayJalali = () => {
  const parts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    calendar: 'persian',
  }).formatToParts(new Date());
  const y = parts.find(p => p.type === 'year').value;
  const m = parts.find(p => p.type === 'month').value.padStart(2, '0');
  const d = parts.find(p => p.type === 'day').value.padStart(2, '0');
  return `${y}/${m}/${d}`;
};
