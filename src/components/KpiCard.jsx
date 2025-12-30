export function KpiCard({ label, value, format = 'number' }) {
  let displayValue = value;
  
  if (format === 'currency') {
    displayValue = typeof value === 'number' ? value.toFixed(2) : '0.00';
  } else if (format === 'percent') {
    displayValue = typeof value === 'number' ? (value * 100).toFixed(2) + '%' : '0.00%';
  } else if (format === 'number') {
    displayValue = typeof value === 'number' ? value.toLocaleString() : '0';
  }
  
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{displayValue}</div>
    </div>
  );
}