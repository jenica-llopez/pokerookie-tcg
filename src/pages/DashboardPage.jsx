import { useInventory } from '../hooks/useInventory';
import { useShipments } from '../hooks/useShipments';
import StatCard from '../components/dashboard/StatCard';
import Badge from '../components/ui/Badge';
import { calcProfit, formatAUD } from '../utils/profitCalc';

export default function DashboardPage() {
  const { items, loading } = useInventory();
  const { shipments } = useShipments();

  const stock = items.filter((i) => i.status === 'In Stock' || i.status === 'Reserved');
  const sold = items.filter((i) => i.status === 'Sold');

  const totalStockValue = stock.reduce((a, i) => a + (i.purchasePriceAUD || 0), 0);
  const totalProfit = sold.reduce((a, i) => a + (calcProfit(i) ?? 0), 0);

  const byLocation = {
    Melbourne: stock.filter((i) => i.location === 'Melbourne').length,
    'In Transit': stock.filter((i) => i.location === 'In Transit').length,
    Cebu: stock.filter((i) => i.location === 'Cebu').length,
  };

  const activeShipments = shipments.filter((s) => s.status !== 'Arrived');

  const recent = [...items]
    .sort((a, b) => {
      const ta = a.dateAdded?.toMillis?.() ?? 0;
      const tb = b.dateAdded?.toMillis?.() ?? 0;
      return tb - ta;
    })
    .slice(0, 8);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Dashboard</h1>
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#71717a' }}>Overview of your inventory</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#52525b' }}>Loading...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            <StatCard label="Items in Stock" value={stock.length} accent="#4ade80" />
            <StatCard label="Stock Value (AUD)" value={formatAUD(totalStockValue)} accent="#FFD700" />
            <StatCard label="Total Profit" value={formatAUD(totalProfit)} accent="#E3350D" />
            <StatCard label="Items Sold" value={sold.length} accent="#60a5fa" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            <StatCard label="In Melbourne" value={byLocation.Melbourne} sub="awaiting shipment" accent="#60a5fa" />
            <StatCard label="In Transit" value={byLocation['In Transit']} sub="en route to Cebu" accent="#c084fc" />
            <StatCard label="In Cebu" value={byLocation.Cebu} sub="at consignment" accent="#2dd4bf" />
            <StatCard label="Active Shipments" value={activeShipments.length} accent="#fbbf24" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: '16px' }}>Recent Items</div>
              {recent.length === 0 ? (
                <div style={{ color: '#52525b', fontSize: '0.82rem' }}>No items yet.</div>
              ) : recent.map((item) => (
                <div key={item.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: '1px solid #1a1a1a',
                }}>
                  <div>
                    <div style={{ fontSize: '0.83rem', fontWeight: 600, color: '#e4e4e7', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#71717a' }}>{item.owner} · {item.cardType}</div>
                  </div>
                  <Badge label={item.status} size="sm" />
                </div>
              ))}
            </div>

            <div style={{ background: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: '16px' }}>Active Shipments</div>
              {activeShipments.length === 0 ? (
                <div style={{ color: '#52525b', fontSize: '0.82rem' }}>No active shipments.</div>
              ) : activeShipments.map((s) => (
                <div key={s.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: '1px solid #1a1a1a',
                }}>
                  <div>
                    <div style={{ fontSize: '0.83rem', fontWeight: 600, color: '#e4e4e7' }}>{s.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#71717a' }}>{s.type} · ETA {s.estimatedArrival || '—'}</div>
                  </div>
                  <Badge label={s.status} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
