import { useState } from 'react';
import { useShipments } from '../hooks/useShipments';
import { useInventory } from '../hooks/useInventory';
import { useAuth } from '../hooks/useAuth';
import ShipmentCard from '../components/shipments/ShipmentCard';
import ShipmentModal from '../components/shipments/ShipmentModal';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

export default function ShipmentsPage() {
  const { shipments, loading, addShipment, updateShipment, deleteShipment } = useShipments();
  const { items } = useInventory();
  const { isAdmin } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editShipment, setEditShipment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const itemCountMap = items.reduce((acc, item) => {
    if (item.shipmentId) acc[item.shipmentId] = (acc[item.shipmentId] || 0) + 1;
    return acc;
  }, {});

  const handleSave = async (data) => {
    if (editShipment) {
      await updateShipment(editShipment.id, data);
    } else {
      await addShipment(data);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteShipment(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Shipments</h1>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#71717a' }}>{shipments.length} shipment{shipments.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={() => { setEditShipment(null); setModalOpen(true); }}>
            + New Shipment
          </Button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#52525b' }}>Loading...</div>
      ) : shipments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#3f3f46' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🚢</div>
          <div style={{ fontWeight: 600, color: '#52525b' }}>No shipments yet</div>
          {isAdmin && <div style={{ fontSize: '0.82rem', marginTop: '6px' }}>Create your first shipment to start tracking cargo.</div>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {shipments.map((shipment) => (
            <ShipmentCard
              key={shipment.id}
              shipment={shipment}
              itemCount={itemCountMap[shipment.id] || 0}
              isAdmin={isAdmin}
              onEdit={(s) => { setEditShipment(s); setModalOpen(true); }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <ShipmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        shipment={editShipment}
      />

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Shipment" width="420px">
        <p style={{ color: '#a1a1aa', margin: '0 0 8px' }}>
          Are you sure you want to delete <strong style={{ color: '#fff' }}>{deleteTarget?.name}</strong>?
        </p>
        <p style={{ color: '#71717a', fontSize: '0.82rem', margin: '0 0 20px' }}>
          Items assigned to this shipment will become unassigned. This cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
