export function formatPrice(price) {
  if (!price) return '0';
  return price.toLocaleString('fa-IR');
}

