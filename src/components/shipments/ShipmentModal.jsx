import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const EMPTY = {
  name: '',
  type: 'Air',
  status: 'Preparing',
  departureDate: '',
  estimatedArrival: '',
  notes: '',
};

const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#71717a', marginBottom: '5px', fontWeight: 600 };
const inputStyle = {
  width: '100%', background: '#0f0f0f', border: '1px solid #2a2a2a',
  borderRadius: '8px', color: '#e4e4e7', padding: '8px 12px',
  fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function ShipmentModal({ isOpen, onClose, onSave, shipment }) {
  const isEdit = !!shipment;
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setForm(shipment ? {
        name: shipment.name || '',
        type: shipment.type || 'Air',
        status: shipment.status || 'Preparing',
        departureDate: shipment.departureDate || '',
        estimatedArrival: shipment.estimatedArrival || '',
        notes: shipment.notes || '',
      } : EMPTY);
    }
  }, [isOpen, shipment]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const focus = (e) => (e.target.style.borderColor = '#E3350D');
  const blur = (e) => (e.target.style.borderColor = '#2a2a2a');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Shipment' : 'New Shipment'} width="500px">
      <Field label="Shipment Name *">
        <input value={form.name} onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Air Cargo 1" style={inputStyle} onFocus={focus} onBlur={blur} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Type">
          <select value={form.type} onChange={(e) => set('type', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
            <option>Air</option>
            <option>Sea</option>
          </select>
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={(e) => set('status', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
            <option>Preparing</option>
            <option>In Transit</option>
            <option>Arrived</option>
          </select>
        </Field>
        <Field label="Departure Date">
          <input type="date" value={form.departureDate} onChange={(e) => set('departureDate', e.target.value)}
            style={{ ...inputStyle, colorScheme: 'dark' }} onFocus={focus} onBlur={blur} />
        </Field>
        <Field label="Est. Arrival Date">
          <input type="date" value={form.estimatedArrival} onChange={(e) => set('estimatedArrival', e.target.value)}
            style={{ ...inputStyle, colorScheme: 'dark' }} onFocus={focus} onBlur={blur} />
        </Field>
      </div>
      <Field label="Notes">
        <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
          rows={3} placeholder="Optional notes..."
          style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }} onFocus={focus} onBlur={blur} />
      </Field>

      {error && (
        <div style={{ color: '#f87171', fontSize: '0.82rem', padding: '8px 12px', background: '#7f1d1d33', borderRadius: '6px', marginBottom: '12px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #2a2a2a' }}>
        <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Shipment'}
        </Button>
      </div>
    </Modal>
  );
}
