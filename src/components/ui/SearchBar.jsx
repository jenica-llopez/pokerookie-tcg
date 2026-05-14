export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
        color: '#71717a', fontSize: '0.9rem', pointerEvents: 'none',
      }}>🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: '#141414',
          border: '1px solid #2a2a2a',
          borderRadius: '8px',
          color: '#e4e4e7',
          padding: '8px 12px 8px 36px',
          fontSize: '0.875rem',
          width: '240px',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={(e) => e.target.style.borderColor = '#E3350D'}
        onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
      />
    </div>
  );
}
