/** Shape of each app's src/brand.ts. */
export interface BrandColors {
  primary: string;
  primaryText: string;
  accent: string;
}

export interface BrandScreen {
  name: string;
  title: string;
  large?: boolean;
  modal?: boolean;
}

export interface Brand {
  name: string;
  colors: BrandColors;
  screens: BrandScreen[];
}

export const defineBrand = (b: Brand) => b;
