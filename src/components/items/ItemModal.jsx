import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { getSaleCurrency } from '../../utils/profitCalc';

const EMPTY_FORM = {
  name: '',
  cardType: 'Booster Box (36 packs)',
  set: '',
  condition: 'Near Mint',
  owner: 'Nica',
  location: 'Melbourne',
  status: 'In Stock',
  purchasePriceAUD: '',
  shippingCostAUD: '',
  desiredPricePHP: '',
  soldPrice: '',
  saleChannel: '',
  phpToAudRate: 35,
  saleNotes: '',
  shipmentId: '',
};

const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#71717a', marginBottom: '5px', fontWeight: 600 };
const inputStyle = {
  width: '100%', background: '#0f0f0f', border: '1px solid #2a2a2a',
  borderRadius: '8px', color: '#e4e4e7', padding: '8px 12px',
  fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};
const selectStyle = { ...inputStyle, cursor: 'pointer' };

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = 'text', placeholder, min, step }) {
  return (
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder} min={min} step={step}
      style={inputStyle}
      onFocus={(e) => e.target.style.borderColor = '#E3350D'}
      onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
    />
  );
}

function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange} style={selectStyle}
      onFocus={(e) => e.target.style.borderColor = '#E3350D'}
      onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
    >
      {children}
    </select>
  );
}

const TABS = ['Details', 'Financials', 'Shipment'];

export default function ItemModal({ isOpen, onClose, onSave, item, shipments }) {
  const isEdit = !!item;
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTab(0);
      setError('');
      if (item) {
        setForm({
          ...EMPTY_FORM,
          ...item,
          purchasePriceAUD: item.purchasePriceAUD ?? '',
          shippingCostAUD: item.shippingCostAUD ?? '',
          desiredPricePHP: item.desiredPricePHP ?? '',
          soldPrice: item.soldPrice ?? '',
          phpToAudRate: item.phpToAudRate ?? 35,
          saleChannel: item.saleChannel ?? '',
          saleNotes: item.saleNotes ?? '',
          shipmentId: item.shipmentId ?? '',
        });
      } else {
        setForm(EMPTY_FORM);
        setQuantity(1);
      }
    }
  }, [isOpen, item]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const saleCurrency = getSaleCurrency(form.saleChannel);

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required.'); setTab(0); return; }
    setSaving(true);
    setError('');
    try {
      const data = {
        ...form,
        purchasePriceAUD: parseFloat(form.purchasePriceAUD) || 0,
        shippingCostAUD: parseFloat(form.shippingCostAUD) || 0,
        desiredPricePHP: parseFloat(form.desiredPricePHP) || 0,
        soldPrice: form.status === 'Sold' ? (parseFloat(form.soldPrice) || null) : null,
        saleChannel: form.status === 'Sold' ? (form.saleChannel || null) : null,
        saleCurrency: form.status === 'Sold' ? saleCurrency : null,
        phpToAudRate: parseFloat(form.phpToAudRate) || 35,
        saleNotes: form.saleNotes || null,
        shipmentId: form.shipmentId || null,
        dateSold: form.status === 'Sold' && !item?.dateSold ? new Date() : (item?.dateSold ?? null),
      };
      await onSave(data, isEdit ? 1 : quantity);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Item' : 'Add Item'} width="680px">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid #2a2a2a', paddingBottom: '0' }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600,
              color: tab === i ? '#E3350D' : '#71717a',
              borderBottom: tab === i ? '2px solid #E3350D' : '2px solid transparent',
              marginBottom: '-1px', transition: 'color 0.15s', fontFamily: 'inherit',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab 1: Details */}
      {tab === 0 && (
        <div>
          <Field label="Card / Product Name *">
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Pikachu ex SAR 245/191" />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Product Type">
              <Select value={form.cardType} onChange={(e) => set('cardType', e.target.value)}>
                {[
                  'Blister Pack',
                  'Booster Bundle (6-pack)',
                  'Booster Box (36 packs)',
                  'Elite Trainer Box (ETB)',
                  'Ultra Premium Collection (UPC)',
                  'Premium Collection',
                  'Special Collection Box',
                  'First Partner Illustration Collection',
                  'Mini Tin',
                  'Collector Chest',
                  'Poster Collection',
                  'Sticker Collection',
                  '2-Pack Blister',
                  '3-Pack Blister',
                  'Pin Collection',
                  'Figure Collection',
                  'Jumbo Card',
                  'Other',
                ].map(o => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Set">
              <Input value={form.set} onChange={(e) => set('set', e.target.value)} placeholder="e.g. Prismatic Evolutions" />
            </Field>
            <Field label="Condition">
              <Select value={form.condition} onChange={(e) => set('condition', e.target.value)}>
                {['Mint','Near Mint','Lightly Played','Played'].map(o => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Owner">
              <Select value={form.owner} onChange={(e) => set('owner', e.target.value)}>
                {['Nica','Steph','Shared'].map(o => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Location">
              <Select value={form.location} onChange={(e) => set('location', e.target.value)}>
                {['Melbourne','In Transit','Cebu'].map(o => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
                {['In Stock','Reserved','Sold'].map(o => <option key={o}>{o}</option>)}
              </Select>
            </Field>
          </div>
          {!isEdit && (
            <Field label="Quantity (creates that many separate items)">
              <Input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" />
            </Field>
          )}
        </div>
      )}

      {/* Tab 2: Financials */}
      {tab === 1 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <Field label="Purchase Price (AUD)">
              <Input type="number" value={form.purchasePriceAUD} onChange={(e) => set('purchasePriceAUD', e.target.value)} placeholder="0.00" min="0" step="0.01" />
            </Field>
            <Field label="Shipping Cost (AUD)">
              <Input type="number" value={form.shippingCostAUD} onChange={(e) => set('shippingCostAUD', e.target.value)} placeholder="0.00" min="0" step="0.01" />
            </Field>
            <Field label="Desired Price (PHP)">
              <Input type="number" value={form.desiredPricePHP} onChange={(e) => set('desiredPricePHP', e.target.value)} placeholder="0" min="0" />
            </Field>
          </div>

          {form.status === 'Sold' && (
            <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: '0.78rem', color: '#71717a', marginBottom: '12px', fontWeight: 600 }}>SALE DETAILS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Sale Channel">
                  <Select value={form.saleChannel} onChange={(e) => set('saleChannel', e.target.value)}>
                    <option value="">Select channel...</option>
                    {['PH Shop','PH Marketplace','eBay','AU Marketplace','Direct'].map(o => <option key={o}>{o}</option>)}
                  </Select>
                </Field>
                <Field label={`Sold Price (${saleCurrency || '—'})`}>
                  <Input type="number" value={form.soldPrice} onChange={(e) => set('soldPrice', e.target.value)} placeholder="0.00" min="0" step="0.01" />
                </Field>
                <Field label="PHP → AUD Rate">
                  <Input type="number" value={form.phpToAudRate} onChange={(e) => set('phpToAudRate', e.target.value)} min="1" step="0.5" />
                </Field>
                <Field label="Sale Notes">
                  <Input value={form.saleNotes} onChange={(e) => set('saleNotes', e.target.value)} placeholder="Buyer name, link, date..." />
                </Field>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Shipment */}
      {tab === 2 && (
        <div>
          <Field label="Assign to Shipment">
            <Select value={form.shipmentId} onChange={(e) => set('shipmentId', e.target.value)}>
              <option value="">Unassigned</option>
              {shipments.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.status})</option>
              ))}
            </Select>
          </Field>
          {form.shipmentId && (
            <div style={{ fontSize: '0.8rem', color: '#71717a', marginTop: '8px' }}>
              Item will be linked to this shipment for tracking.
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '12px', padding: '8px 12px', background: '#7f1d1d33', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #2a2a2a' }}>
        <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : `Add${!isEdit && quantity > 1 ? ` (×${quantity})` : ''}`}
        </Button>
      </div>
    </Modal>
  );
}
