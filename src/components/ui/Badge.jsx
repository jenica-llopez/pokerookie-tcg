const VARIANTS = {
  'In Stock':    { bg: '#14532d', color: '#4ade80', border: '#166534' },
  'Reserved':    { bg: '#713f12', color: '#fbbf24', border: '#854d0e' },
  'Sold':        { bg: '#7f1d1d', color: '#f87171', border: '#991b1b' },
  'Melbourne':   { bg: '#1e3a5f', color: '#60a5fa', border: '#1d4ed8' },
  'In Transit':  { bg: '#3b1f5e', color: '#c084fc', border: '#7e22ce' },
  'Cebu':        { bg: '#134e4a', color: '#2dd4bf', border: '#0f766e' },
  'Preparing':   { bg: '#713f12', color: '#fbbf24', border: '#854d0e' },
  'Arrived':     { bg: '#14532d', color: '#4ade80', border: '#166534' },
  'Air':         { bg: '#1e3a5f', color: '#60a5fa', border: '#1d4ed8' },
  'Sea':         { bg: '#134e4a', color: '#2dd4bf', border: '#0f766e' },
};

export default function Badge({ label, size = 'sm' }) {
  const style = VARIANTS[label] || { bg: '#27272a', color: '#a1a1aa', border: '#3f3f46' };
  const padding = size === 'sm' ? '2px 10px' : '4px 14px';
  return (
    <span style={{
      display: 'inline-block',
      padding,
      borderRadius: '9999px',
      fontSize: '0.72rem',
      fontWeight: 600,
      letterSpacing: '0.03em',
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}
