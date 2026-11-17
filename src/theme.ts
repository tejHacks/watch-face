/**
 * Design tokens. `brand` is the only thing that changes between apps —
 * everything else (surfaces, text, radii, spacing) is shared.
 */
import { useColorScheme } from 'react-native';

import { brand } from './brand';
import type { BrandColors } from './lib/brand-type';

const palettes = {
  light: {
    bg: '#FAFAF9',
    card: '#FFFFFF',
    border: '#E7E5E4',
    text: '#0F172A',
    muted: '#475569',
    subtle: '#94A3B8',
    danger: '#DC2626',
    success: '#059669',
  },
  dark: {
    bg: '#09090B',
    card: '#121215',
    border: '#27272A',
    text: '#F8FAFC',
    muted: '#A1A1AA',
    subtle: '#71717A',
    danger: '#F87171',
    success: '#34D399',
  },
} as const;

export type Palette = Record<keyof (typeof palettes)['light'], string> & BrandColors;

export function usePalette(): Palette {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { ...palettes[scheme], ...brand.colors };
}

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
