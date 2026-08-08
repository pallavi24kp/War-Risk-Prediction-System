import { ContagionArcData } from '../../lib/types';

export const MOCK_CONTAGION_ARCS: ContagionArcData[] = [
  {
    id: 'c-yem-1',
    source_country: 'YEM',
    target_country: 'SAU',
    source_coords: [15.369, 44.191], // Yemen
    target_coords: [24.713, 46.675], // Saudi Arabia
    contagion_score: 88,
    spillover_type: 'KINETIC_SPREAD',
    altitude: 0.25,
  },
  {
    id: 'c-yem-2',
    source_country: 'YEM',
    target_country: 'OMN',
    source_coords: [15.369, 44.191], // Yemen
    target_coords: [23.588, 58.382], // Oman
    contagion_score: 74,
    spillover_type: 'REFUGEE_SURGE',
    altitude: 0.20,
  },
  {
    id: 'c-yem-3',
    source_country: 'YEM',
    target_country: 'DJI',
    source_coords: [15.369, 44.191], // Yemen
    target_coords: [11.825, 42.59], // Djibouti
    contagion_score: 91,
    spillover_type: 'TRADE_BLOCKADE',
    altitude: 0.22,
  },
  {
    id: 'c-ukr-1',
    source_country: 'UKR',
    target_country: 'POL',
    source_coords: [48.379, 31.165], // Ukraine
    target_coords: [52.229, 21.012], // Poland
    contagion_score: 82,
    spillover_type: 'REFUGEE_SURGE',
    altitude: 0.24,
  },
  {
    id: 'c-ukr-2',
    source_country: 'UKR',
    target_country: 'ROU',
    source_coords: [48.379, 31.165], // Ukraine
    target_coords: [44.432, 26.106], // Romania
    contagion_score: 76,
    spillover_type: 'TRADE_BLOCKADE',
    altitude: 0.21,
  },
  {
    id: 'c-twn-1',
    source_country: 'TWN',
    target_country: 'JPN',
    source_coords: [23.697, 120.96], // Taiwan
    target_coords: [35.676, 139.65], // Japan
    contagion_score: 85,
    spillover_type: 'TRADE_BLOCKADE',
    altitude: 0.26,
  },
  {
    id: 'c-twn-2',
    source_country: 'TWN',
    target_country: 'PHL',
    source_coords: [23.697, 120.96], // Taiwan
    target_coords: [14.599, 120.98], // Philippines
    contagion_score: 79,
    spillover_type: 'CYBER_SPILLOVER',
    altitude: 0.22,
  },
  {
    id: 'c-irn-1',
    source_country: 'IRN',
    target_country: 'IRQ',
    source_coords: [32.427, 53.688], // Iran
    target_coords: [33.315, 44.366], // Iraq
    contagion_score: 87,
    spillover_type: 'KINETIC_SPREAD',
    altitude: 0.23,
  },
  {
    id: 'c-irn-2',
    source_country: 'IRN',
    target_country: 'UAE',
    source_coords: [32.427, 53.688], // Iran
    target_coords: [24.453, 54.377], // UAE
    contagion_score: 72,
    spillover_type: 'CYBER_SPILLOVER',
    altitude: 0.20,
  },
];
