import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatAUD, formatPHP } from '../../utils/profitCalc';

const thStyle = {
  padding: '10px 14px',
  textAlign: 'left',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: '#71717a',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  borderBottom: '1px solid #1f1f1f',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '12px 14px',
  fontSize: '0.83rem',
  color: '#e4e4e7',
  borderBottom: '1px solid #181818',
  verticalAlign: 'middle',
};

export default function ItemTable({ items, shipments, isAdmin, onEdit, onDelete }) {
  const shipMap = Object.fromEntries(shipments.map((s) => [s.id, s.name]));

  if (items.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 20px', color: '#3f3f46',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📦</div>
        <div style={{ fontSize: '1rem', fontWeight: 600 }}>No items found</div>
        <div style={{ fontSize: '0.82rem', marginTop: '6px' }}>Try adjusting your filters or add an item.</div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #1f1f1f' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
        <thead style={{ background: '#141414' }}>
          <tr>
            {['Name','Product Type','Set','Condition','Owner','Location','Status','Cost (AUD)','Desired (PHP)','Shipment', isAdmin ? 'Actions' : null]
              .filter(Boolean)
              .map((h) => <th key={h} style={thStyle}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ transition: 'background 0.1s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#141414'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ ...tdStyle, fontWeight: 600, maxWidth: '220px' }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.name}>
                  {item.name}
                </div>
              </td>
              <td style={{ ...tdStyle, color: '#a1a1aa' }}>{item.cardType}</td>
              <td style={{ ...tdStyle, color: '#a1a1aa', maxWidth: '140px' }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.set}>
                  {item.set || '—'}
                </div>
              </td>
              <td style={tdStyle}>{item.condition}</td>
              <td style={tdStyle}>{item.owner}</td>
              <td style={tdStyle}><Badge label={item.location} /></td>
              <td style={tdStyle}><Badge label={item.status} /></td>
              <td style={tdStyle}>{formatAUD(item.purchasePriceAUD)}</td>
              <td style={tdStyle}>{item.desiredPricePHP ? formatPHP(item.desiredPricePHP) : '—'}</td>
              <td style={{ ...tdStyle, color: '#a1a1aa', fontSize: '0.78rem' }}>
                {item.shipmentId ? shipMap[item.shipmentId] || '—' : '—'}
              </td>
              {isAdmin && (
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete(item)}>Del</Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
