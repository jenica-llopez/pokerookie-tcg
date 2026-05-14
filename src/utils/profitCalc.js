const AU_CHANNELS = ['AU Marketplace', 'eBay', 'Direct'];
const PH_CHANNELS = ['PH Shop', 'PH Marketplace'];

export function getSaleCurrency(channel) {
  if (AU_CHANNELS.includes(channel)) return 'AUD';
  if (PH_CHANNELS.includes(channel)) return 'PHP';
  return null;
}

export function calcProfit(item) {
  const { soldPrice, saleChannel, purchasePriceAUD, shippingCostAUD, phpToAudRate } = item;
  if (!soldPrice || !saleChannel) return null;

  const cost = (purchasePriceAUD || 0) + (shippingCostAUD || 0);

  if (AU_CHANNELS.includes(saleChannel)) {
    return soldPrice - cost;
  }
  if (PH_CHANNELS.includes(saleChannel)) {
    const rate = phpToAudRate || 35;
    return (soldPrice / rate) - cost;
  }
  return null;
}

export function calcMarginPct(item) {
  const profit = calcProfit(item);
  if (profit === null) return null;
  const cost = (item.purchasePriceAUD || 0) + (item.shippingCostAUD || 0);
  if (cost === 0) return null;
  return (profit / cost) * 100;
}

export function formatAUD(val) {
  if (val === null || val === undefined) return '—';
  return `A$${Number(val).toFixed(2)}`;
}

export function formatPHP(val) {
  if (val === null || val === undefined) return '—';
  return `₱${Number(val).toFixed(0)}`;
}
