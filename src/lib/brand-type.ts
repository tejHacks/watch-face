/** Shape of each app's src/brand.ts. */
export interface BrandColors {
  primary: string;
  primaryText: string;
  accent: string;
}

export interface BrandScreen {
  name: string;
  title: string;
  /** @deprecated iOS large titles need the scroll view as the direct child; not used. */
  large?: boolean;
  /** Hide the native header (the screen draws its own). */
  hideHeader?: boolean;
  modal?: boolean;
}

export interface Brand {
  name: string;
  colors: BrandColors;
  screens: BrandScreen[];
}

export const defineBrand = (b: Brand) => b;
