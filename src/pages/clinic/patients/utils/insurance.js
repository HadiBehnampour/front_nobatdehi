// utils/insurance.js

export const getInsuranceLabel = (type) => {
  const map = {
    'tamin': 'تامین اجتماعی',
    'salamat': 'سلامت',
    'armed': 'نیروهای مسلح',
    'none': 'آزاد'
  };
  return map[type] || 'آزاد';
};

export const getInsuranceColor = (type) => {
  const map = {
    'tamin': 'bg-blue-100 text-blue-600',
    'salamat': 'bg-green-100 text-green-600',
    'armed': 'bg-purple-100 text-purple-600',
    'none': 'bg-gray-100 text-gray-500'
  };
  return map[type] || 'bg-gray-100 text-gray-500';
};