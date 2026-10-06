import assert from 'node:assert/strict';
import { resolveCoupleSide, isViraasGarmentImagePath } from '../shared/coupleTryOn.mjs';

const couple = {
  id: 'garba-01',
  herProductIds: ['women-exact'],
  hisProductIds: ['men-exact'],
  image: '/images/couples/garba-01.png',
  her: { desc: 'Pink lehenga with a separate dupatta' },
  him: { desc: 'Ivory kurta with a separate stole' },
};
const products = new Map([
  ['women-exact', { id: 'women-exact', gender: 'women', tryOnEnabled: true, status: 'live', category: 'lehenga', imageUrl: '/images/women-previews/women-look-001.png', title: 'Pink Lehenga' }],
  ['men-exact', { id: 'men-exact', gender: 'men', tryOnEnabled: true, status: 'live', category: 'kurta', imageUrl: '/images/men-looks/men-look-001.png', title: 'Ivory Kurta' }],
  ['wrong-gender', { id: 'wrong-gender', gender: 'men', tryOnEnabled: true, status: 'live', category: 'kurta', imageUrl: '/images/men-looks/men-look-002.png' }],
  ['combined', { id: 'combined', gender: 'women', tryOnEnabled: true, status: 'live', category: 'lehenga', imageUrl: '/images/couples/garba-01.png' }],
  ['accessory', { id: 'accessory', gender: 'women', tryOnEnabled: true, status: 'live', category: 'jewellery', imageUrl: '/images/women-previews/women-look-002.png' }],
]);

const her = resolveCoupleSide(couple, 'her', products);
const him = resolveCoupleSide(couple, 'him', products);
assert.equal(her.ok, true);
assert.equal(her.productId, 'women-exact');
assert.equal(her.side, 'her');
assert.equal(him.ok, true);
assert.equal(him.productId, 'men-exact');
assert.equal(him.side, 'him');

assert.equal(resolveCoupleSide({ ...couple, herProductIds: ['wrong-gender'] }, 'her', products).ok, false);
assert.equal(resolveCoupleSide({ ...couple, herProductIds: ['combined'] }, 'her', products).ok, false);
assert.equal(resolveCoupleSide({ ...couple, herProductIds: ['accessory'] }, 'her', products).ok, false);
assert.equal(resolveCoupleSide({ ...couple, herProductIds: [] }, 'her', products).ok, false);
assert.equal(resolveCoupleSide(couple, 'other', products).ok, false);
assert.equal(isViraasGarmentImagePath('/images/women-previews/look.webp'), true);
assert.equal(isViraasGarmentImagePath('/images/couples/garba-01.png'), false);
assert.equal(isViraasGarmentImagePath('https://example.test/look.png'), false);
assert.equal(isViraasGarmentImagePath('/images/../private/photo.jpg'), false);

console.log('PASS Couple Try-On mapping: direct side-only references, gender/live/garment/path checks, no combined image substitution, and fail-closed unresolved sides.');
