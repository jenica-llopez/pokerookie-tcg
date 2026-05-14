export default function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: '#141414',
      border: '1px solid #1f1f1f',
      borderRadius: '12px',
      padding: '20px 24px',
      borderLeft: accent ? `3px solid ${accent}` : undefined,
    }}>
      <div style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: '#52525b', marginTop: '6px' }}>{sub}</div>}
    </div>
  );
}
