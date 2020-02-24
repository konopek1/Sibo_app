import {Product} from './types/Product';

const countChance = (a?: number, b?: number) => {
  return ((a || 0) / (b || 1)) * 100;
};

const sortChances = (a: Product, b: Product) => {
  const m = countChance(a.bad, a.used);
  const n = countChance(b.bad, b.used);
  return m > n ? -1 : m < n ? 1 : 0;
};

const RENDER_ITEMS = 8;

export {countChance, sortChances, RENDER_ITEMS};
