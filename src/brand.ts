import { defineBrand } from './lib/brand-type';

export const brand = defineBrand({
  name: 'Watch Face',
  colors: { primary: '#F97316', primaryText: '#FFFFFF', accent: '#334155' },
  screens: [{ name: 'index', title: 'Face designer' }],
});
