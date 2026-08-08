import { BilateralTensionPair } from '../../lib/types';
import { MOCK_38_COUNTRIES_CII } from './instabilityData';

const generateMockMatrixPairs = (): BilateralTensionPair[] => {
  const countries = MOCK_38_COUNTRIES_CII.map((c) => c.country_code);
  const pairs: BilateralTensionPair[] = [];

  // High hostility pairs override mapping
  const knownHighTensions: Record<string, { score: number; driver: string }> = {
    'YEM-SAU': { score: 88, driver: 'Bab al-Mandab Conflict & Border Interdiction' },
    'UKR-RUS': { score: 98, driver: 'Full-Scale Kinetic Front Warfare' },
    'TWN-CHN': { score: 92, driver: 'Strait Air Defense Exclusion & Naval Exercises' },
    'IRN-ISR': { score: 95, driver: 'Proxy Missile Strikes & Maritime Harassment' },
    'IND-PAK': { score: 78, driver: 'Line of Control Skirmishes & Cross-Border Shelling' },
    'PRK-KOR': { score: 85, driver: 'Ballistic Missile Tests & Demilitarized Zone Standoff' },
    'USA-RUS': { score: 89, driver: 'Strategic Proxy Confrontation & Sanction Escalation' },
    'USA-CHN': { score: 72, driver: 'Tech Embargo & South China Sea Maritime Friction' },
    'ISR-LBN': { score: 91, driver: 'Northern Border Artillery & Drone Interdiction' },
    'SYR-TUR': { score: 74, driver: 'Northern Syria Buffer Zone Operations' },
    'ARM-AZE': { score: 82, driver: 'Nagorno-Karabakh Border Dispute' },
    'SDN-EGY': { score: 65, driver: 'Nile Basin Dam Water Rights & Spillover' },
    'ETH-SOM': { score: 68, driver: 'Somaliland Port Memorandum Disagreements' },
    'VEN-COL': { score: 62, driver: 'Border Guerrilla Movement & Contraband Smuggling' },
  };

  for (let i = 0; i < countries.length; i++) {
    for (let j = i + 1; j < countries.length; j++) {
      const a = countries[i];
      const b = countries[j];
      const key1 = `${a}-${b}`;
      const key2 = `${b}-${a}`;

      let score = 5 + Math.floor(((i * 7 + j * 13) % 45)); // Default low-to-moderate background score
      let driver = 'Diplomatic frictions & trade tariffs';

      if (knownHighTensions[key1]) {
        score = knownHighTensions[key1].score;
        driver = knownHighTensions[key1].driver;
      } else if (knownHighTensions[key2]) {
        score = knownHighTensions[key2].score;
        driver = knownHighTensions[key2].driver;
      }

      pairs.push({
        country_a: a,
        country_b: b,
        score,
        last_updated: '2026-08-07T04:00:00Z',
        primary_conflict_driver: driver,
      });
    }
  }

  return pairs;
};

export const MOCK_BILATERAL_TENSION_PAIRS: BilateralTensionPair[] = generateMockMatrixPairs();
