import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

export default function Header() {
  const { currentUser, isAdmin, loginWithGoogle, logout } = useAuth();

  return (
    <header style={{
      background: '#111',
      borderBottom: '1px solid #1f1f1f',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #E3350D, #ff5c3a)',
          borderRadius: '8px',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
        }}>
          ⚡
        </div>
        <div>
          <div style={{
            fontWeight: 800,
            fontSize: '1.05rem',
            color: '#fff',
            letterSpacing: '-0.02em',
          }}>
            PokeRookie
          </div>
          <div style={{ fontSize: '0.65rem', color: '#71717a', marginTop: '-2px' }}>
            TCG Inventory
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isAdmin && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#1a1a1a', border: '1px solid #2a2a2a',
            borderRadius: '20px', padding: '4px 12px 4px 6px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80',
            }} />
            <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Admin</span>
          </div>
        )}
        {currentUser ? (
          <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={loginWithGoogle}>
            Admin Login
          </Button>
        )}
      </div>
    </header>
  );
}
