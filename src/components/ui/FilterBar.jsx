const selectStyle = {
  background: '#141414',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  color: '#e4e4e7',
  padding: '7px 12px',
  fontSize: '0.82rem',
  outline: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export default function FilterBar({ filters, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {filters.map(({ key, label, options, value }) => (
        <select
          key={key}
          value={value}
          onChange={(e) => onChange(key, e.target.value)}
          style={selectStyle}
        >
          <option value="">{label}: All</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ))}
    </div>
  );
}
