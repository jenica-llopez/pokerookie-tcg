import { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { useShipments } from '../hooks/useShipments';
import { useAuth } from '../hooks/useAuth';
import ItemTable from '../components/items/ItemTable';
import ItemModal from '../components/items/ItemModal';
import Modal from '../components/ui/Modal';
import SearchBar from '../components/ui/SearchBar';
import FilterBar from '../components/ui/FilterBar';
import Button from '../components/ui/Button';

export default function StockPage() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useInventory();
  const { shipments } = useShipments();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ owner: '', location: '', status: '', cardType: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const stockItems = items.filter((i) => i.status === 'In Stock' || i.status === 'Reserved');

  const filtered = stockItems.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.owner && item.owner !== filters.owner) return false;
    if (filters.location && item.location !== filters.location) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.cardType && item.cardType !== filters.cardType) return false;
    return true;
  });

  const handleSave = async (data, qty) => {
    if (editItem) {
      await updateItem(editItem.id, data);
    } else {
      await addItem(data, qty);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteItem(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Stock</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#71717a' }}>
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} {stockItems.length !== filtered.length ? `(of ${stockItems.length})` : ''}
          </p>
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={() => { setEditItem(null); setModalOpen(true); }}>
            + Add Item
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name..." />
        <FilterBar
          filters={[
            { key: 'owner', label: 'Owner', value: filters.owner, options: ['Nica', 'Steph', 'Shared'] },
            { key: 'location', label: 'Location', value: filters.location, options: ['Melbourne', 'In Transit', 'Cebu'] },
            { key: 'status', label: 'Status', value: filters.status, options: ['In Stock', 'Reserved'] },
            { key: 'cardType', label: 'Type', value: filters.cardType, options: ['Blister Pack','Booster Bundle (6-pack)','Booster Box (36 packs)','Elite Trainer Box (ETB)','Ultra Premium Collection (UPC)','Premium Collection','Special Collection Box','First Partner Illustration Collection','Mini Tin','Collector Chest','Poster Collection','Sticker Collection','2-Pack Blister','3-Pack Blister','Pin Collection','Figure Collection','Jumbo Card','Other'] },
          ]}
          onChange={setFilter}
        />
        {Object.values(filters).some(Boolean) && (
          <Button variant="ghost" size="sm" onClick={() => setFilters({ owner: '', location: '', status: '', cardType: '' })}>
            Clear filters
          </Button>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#52525b' }}>Loading inventory...</div>
      )}
      {error && (
        <div style={{ color: '#f87171', padding: '16px', background: '#7f1d1d33', borderRadius: '8px', marginBottom: '16px' }}>
          Error: {error}
        </div>
      )}
      {!loading && (
        <ItemTable
          items={filtered}
          shipments={shipments}
          isAdmin={isAdmin}
          onEdit={(item) => { setEditItem(item); setModalOpen(true); }}
          onDelete={setDeleteTarget}
        />
      )}

      <ItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        item={editItem}
        shipments={shipments}
      />

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Item" width="420px">
        <p style={{ color: '#a1a1aa', margin: '0 0 20px' }}>
          Are you sure you want to delete <strong style={{ color: '#fff' }}>{deleteTarget?.name}</strong>? This cannot be undone.
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
