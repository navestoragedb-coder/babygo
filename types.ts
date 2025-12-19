
export interface BabyName {
  name: string;
  origin: string;
  meaning: string;
  phoneticScore: number;
  popularityEra: string;
  culturalSignificance: string;
  gender: 'boy' | 'girl' | 'unisex';
  historicalTrend: 'rising' | 'falling' | 'stable';
}

export enum NamingStyle {
  CLASSIC = 'Classic',
  NATURE = 'Nature-inspired',
  RHYTHMIC = 'Rhythmic flow',
  MODERN = 'Modern',
  VINTAGE = 'Vintage'
}

export type SearchMode = 'historical' | 'ai';
