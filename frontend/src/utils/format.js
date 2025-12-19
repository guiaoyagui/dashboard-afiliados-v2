export function formatCurrency(value = 0) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2
  });
}

export function formatDateLabel(dateVal) {
  try {
    const d = new Date(dateVal);
    if (!isNaN(d)) {
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  } catch {}
  return String(dateVal);
}
