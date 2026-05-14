import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function ShipmentCard({ shipment, itemCount, isAdmin, onEdit, onDelete }) {
  const { name, type, status, departureDate, estimatedArrival, notes } = shipment;

  return (
    <div style={{
      background: '#141414',
      border: '1px solid #1f1f1f',
      borderRadius: '12px',
      padding: '20px',
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2a2a2a'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1f1f1f'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '6px' }}>{name}</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <Badge label={type} />
            <Badge label={status} />
          </div>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button variant="ghost" size="sm" onClick={() => onEdit(shipment)}>Edit</Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(shipment)}>Delete</Button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '12px' }}>
        <Stat label="Items" value={itemCount} />
        <Stat label="Departure" value={departureDate || '—'} />
        <Stat label="Est. Arrival" value={estimatedArrival || '—'} />
      </div>

      {notes && (
        <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#71717a', borderTop: '1px solid #1f1f1f', paddingTop: '12px' }}>
          {notes}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.68rem', color: '#52525b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.88rem', color: '#a1a1aa', fontWeight: 600 }}>{value}</div>
    </div>
  );
}
