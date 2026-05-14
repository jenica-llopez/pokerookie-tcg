import Header from './Header';
import Nav from './Nav';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#e4e4e7' }}>
      <Header />
      <Nav />
      <main style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
