import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',           label: 'Stock',     icon: '📦' },
  { to: '/sales',      label: 'Sales',     icon: '💰' },
  { to: '/shipments',  label: 'Shipments', icon: '🚢' },
  { to: '/dashboard',  label: 'Dashboard', icon: '📊' },
];

export default function Nav() {
  return (
    <nav style={{
      background: '#111',
      borderBottom: '1px solid #1f1f1f',
      display: 'flex',
      gap: '4px',
      padding: '0 20px',
    }}>
      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 14px',
            fontSize: '0.83rem',
            fontWeight: 600,
            color: isActive ? '#E3350D' : '#71717a',
            borderBottom: isActive ? '2px solid #E3350D' : '2px solid transparent',
            textDecoration: 'none',
            transition: 'color 0.15s',
          })}
        >
          <span>{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
