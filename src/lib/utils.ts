import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Ethiopian Regions, Zones, and Woredas for PastureAI
export const ETHIOPIAN_REGIONS = {
  SOMALI: {
    name: 'Somali Region',
    zones: [
      {
        name: 'Jijiga',
        woredas: ['Jijiga', 'Awbare', 'Babille', 'Gursum', 'Kebribeyah']
      },
      {
        name: 'Shabelle',
        woredas: ['Mustahil', 'Kelafo', 'Burdho', 'Imberi', 'East Imay']
      },
      {
        name: 'Korahey',
        woredas: ['Degehabur', 'Hawilte', 'Awbare', 'Dembel']
      },
      {
        name: 'Erer',
        woredas: ['Erer', 'Afdem', 'Amibara']
      },
      {
        name: 'Nogob',
        woredas: ['Segeg', 'Dollo', 'Danot', 'Wardher', 'Gunagado']
      },
      {
        name: 'Dollo',
        woredas: ['Warder', 'Galadi', 'Dolo Bay', 'Dollo Ado']
      }
    ]
  },
  OROMIA: {
    name: 'Oromia Region',
    zones: [
      {
        name: 'East Hararghe',
        woredas: ['Babile', 'Fedis', 'Goro Gutu', 'Jarar', 'Kersa', 'Melka Belo', 'Midega Tola']
      },
      {
        name: 'West Hararghe',
        woredas: ['Boke', 'Chiro', 'Doba', 'Guba Koricha', 'Habo', 'Menna', 'Tulo']
      },
      {
        name: 'Bale',
        woredas: ['Agarfa', 'Berehano Ahmmed Dinil', 'Delo Mena', 'Ginir', 'Goba', 'Gololcha', 'Jeretu']
      },
      {
        name: 'Borena',
        woredas: ['Arero', 'Dire', 'Elsa', 'Odo Shakiso', 'Soyama', 'Yabelo']
      }
    ]
  },
  AFAR: {
    name: 'Afar Region',
    zones: [
      {
        name: 'Zone 1 (Awsi Rasu)',
        woredas: ['Asayita', 'Afambo', 'Dalul', 'Erebti', 'Dubti', 'Megale']
      },
      {
        name: 'Zone 2 (Kilbet Rasu)',
        woredas: ['Abala', 'Afdera', 'Berhale', 'Dallol', 'Erebti', 'Koneba']
      },
      {
        name: 'Zone 3 (Gabbi Rasu)',
        woredas: ['Amibara', 'Awash Fentale', 'Dulecha', 'Gewane', 'Hadele Ela']
      },
      {
        name: 'Zone 4 (Fanci Rasu)',
        woredas: ['Elidar', 'Gulina', 'Teru', 'Yallo']
      }
    ]
  }
};

// Sample NDVI data for charts
export const generateNDVIData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => ({
    month,
    somali: Math.max(0, Math.min(1, 0.35 + Math.sin(index * 0.5) * 0.25 + Math.random() * 0.1)),
    oromia: Math.max(0, Math.min(1, 0.45 + Math.sin(index * 0.5) * 0.2 + Math.random() * 0.1)),
    afar: Math.max(0, Math.min(1, 0.28 + Math.sin(index * 0.5) * 0.22 + Math.random() * 0.1))
  }));
};

// Livestock population data
export const livestockData = {
  cattle: { total: 65000000, trend: '+2.3%' },
  camel: { total: 7200000, trend: '-0.8%' },
  goat: { total: 42000000, trend: '+3.1%' },
  sheep: { total: 38000000, trend: '+1.9%' }
};

// Alert severity colors
export const severityColors = {
  LOW: 'bg-blue-100 text-blue-800 border-blue-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  CRITICAL: 'bg-red-100 text-red-800 border-red-200'
};
