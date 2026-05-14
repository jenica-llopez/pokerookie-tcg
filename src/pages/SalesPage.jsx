import { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { useShipments } from '../hooks/useShipments';
import { useAuth } from '../hooks/useAuth';
import ItemModal from '../components/items/ItemModal';
import Modal from '../components/ui/Modal';
import SearchBar from '../components/ui/SearchBar';
import FilterBar from '../components/ui/FilterBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import StatCard from '../components/dashboard/StatCard';
import { calcProfit, calcMarginPct, formatAUD, getSaleCurrency } from '../utils/profitCalc';

const thStyle = {
  padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem',
  fontWeight: 700, color: '#71717a', letterSpacing: '0.05em',
  textTransform: 'uppercase', borderBottom: '1px solid #1f1f1f', whiteSpace: 'nowrap',
};
const tdStyle = {
  padding: '12px 14px', fontSize: '0.83rem', color: '#e4e4e7',
  borderBottom: '1px solid #181818', verticalAlign: 'middle',
};

export default function SalesPage() {
  const { items, loading, updateItem } = useInventory();
  const { shipments } = useShipments();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ owner: '', saleChannel: '' });
  const [editItem, setEditItem] = useState(null);

  const soldItems = items.filter((i) => i.status === 'Sold');

  const filtered = soldItems.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.owner && item.owner !== filters.owner) return false;
    if (filters.saleChannel && item.saleChannel !== filters.saleChannel) return false;
    return true;
  });

  const totalProfit = filtered.reduce((acc, i) => acc + (calcProfit(i) ?? 0), 0);
  const totalRevenue = filtered.reduce((acc, i) => {
    if (!i.soldPrice) return acc;
    const cur = getSaleCurrency(i.saleChannel);
    if (cur === 'AUD') return acc + i.soldPrice;
    if (cur === 'PHP') return acc + i.soldPrice / (i.phpToAudRate || 35);
    return acc;
  }, 0);
  const margins = filtered.map(calcMarginPct).filter((m) => m !== null);
  const avgMargin = margins.length ? margins.reduce((a, b) => a + b, 0) / margins.length : null;

  const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Sales</h1>
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#71717a' }}>{soldItems.length} items sold</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Total Revenue" value={formatAUD(totalRevenue)} accent="#FFD700" />
        <StatCard label="Total Profit" value={formatAUD(totalProfit)} accent="#E3350D" />
        <StatCard label="Items Sold" value={soldItems.length} accent="#4ade80" />
        <StatCard label="Avg Margin" value={avgMargin !== null ? `${avgMargin.toFixed(1)}%` : '—'} accent="#60a5fa" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name..." />
        <FilterBar
          filters={[
            { key: 'owner', label: 'Owner', value: filters.owner, options: ['Nica', 'Steph', 'Shared'] },
            { key: 'saleChannel', label: 'Channel', value: filters.saleChannel, options: ['PH Shop', 'PH Marketplace', 'eBay', 'AU Marketplace', 'Direct'] },
          ]}
          onChange={setFilter}
        />
        {Object.values(filters).some(Boolean) && (
          <Button variant="ghost" size="sm" onClick={() => setFilters({ owner: '', saleChannel: '' })}>
            Clear filters
          </Button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#52525b' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#3f3f46' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💰</div>
          <div style={{ fontWeight: 600 }}>No sales yet</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #1f1f1f' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead style={{ background: '#141414' }}>
              <tr>
                {['Name','Type','Set','Owner','Channel','Sold Price','Cost (AUD)','Profit (AUD)','Sale Notes','Date Sold', isAdmin ? 'Actions' : null]
                  .filter(Boolean).map((h) => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const profit = calcProfit(item);
                const profitColor = profit === null ? '#71717a' : profit >= 0 ? '#4ade80' : '#f87171';
                const cur = getSaleCurrency(item.saleChannel);
                const soldStr = item.soldPrice != null
                  ? `${cur === 'PHP' ? '₱' : 'A$'}${Number(item.soldPrice).toFixed(cur === 'PHP' ? 0 : 2)}`
                  : '—';
                const dateStr = item.dateSold?.toDate?.()
                  ? item.dateSold.toDate().toLocaleDateString()
                  : item.dateSold ? new Date(item.dateSold).toLocaleDateString() : '—';
                return (
                  <tr key={item.id}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#141414'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    style={{ transition: 'background 0.1s' }}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, maxWidth: '200px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.name}>{item.name}</div>
                    </td>
                    <td style={{ ...tdStyle, color: '#a1a1aa' }}>{item.cardType}</td>
                    <td style={{ ...tdStyle, color: '#a1a1aa', maxWidth: '120px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.set || '—'}</div>
                    </td>
                    <td style={tdStyle}>{item.owner}</td>
                    <td style={tdStyle}>{item.saleChannel ? <Badge label={item.saleChannel.includes('PH') ? 'Cebu' : 'Melbourne'} /> : '—'}{' '}<span style={{ fontSize: '0.75rem', color: '#71717a' }}>{item.saleChannel || ''}</span></td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{soldStr}</td>
                    <td style={tdStyle}>{formatAUD((item.purchasePriceAUD || 0) + (item.shippingCostAUD || 0))}</td>
                    <td style={{ ...tdStyle, color: profitColor, fontWeight: 600 }}>
                      {profit !== null ? formatAUD(profit) : '—'}
                    </td>
                    <td style={{ ...tdStyle, color: '#71717a', maxWidth: '160px', fontSize: '0.78rem' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.saleNotes || '—'}</div>
                    </td>
                    <td style={{ ...tdStyle, color: '#71717a', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{dateStr}</td>
                    {isAdmin && (
                      <td style={tdStyle}>
                        <Button variant="ghost" size="sm" onClick={() => setEditItem(item)}>Edit</Button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isAdmin && (
        <ItemModal
          isOpen={!!editItem}
          onClose={() => setEditItem(null)}
          onSave={async (data) => { await updateItem(editItem.id, data); setEditItem(null); }}
          item={editItem}
          shipments={shipments}
        />
      )}
    </div>
  );
}
