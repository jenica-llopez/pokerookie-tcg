export default function Button({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', style: extraStyle }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
    ...extraStyle,
  };

  const sizes = {
    sm: { padding: '5px 12px', fontSize: '0.78rem' },
    md: { padding: '8px 16px', fontSize: '0.875rem' },
    lg: { padding: '11px 22px', fontSize: '1rem' },
  };

  const variants = {
    primary:  { background: '#E3350D', color: '#fff' },
    gold:     { background: '#FFD700', color: '#111' },
    ghost:    { background: 'transparent', color: '#a1a1aa', border: '1px solid #3f3f46' },
    danger:   { background: '#7f1d1d', color: '#f87171', border: '1px solid #991b1b' },
    success:  { background: '#14532d', color: '#4ade80', border: '1px solid #166534' },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant] }}
    >
      {children}
    </button>
  );
}
