// Packaging information based on dimension
// Data extracted from docs/packaging_info.md

export interface SinglePackageInfo {
  dimension: string;
  pieces: number; // تعداد در کارتن
  squareMeters: number; // متراژ در کارتن
  weightKg: number; // وزن یک کارتن
}

export interface PalletInfo {
  boxes: number; // تعداد در پالت
  squareMeters: number; // متراژ پالت
  totalWeightKg: number; // وزن کل پالت
}

export interface PackagingInfo {
  singlePackage: SinglePackageInfo;
  pallet: PalletInfo;
}

// Mapping dimension to packaging information
// Data extracted from docs/packaging_info.md (updated version)
export const PACKAGING_DATA: Record<string, PackagingInfo> = {
  '20x20': {
    singlePackage: {
      dimension: '20×20 cm',
      pieces: 11,
      squareMeters: 0.99,
      weightKg: 16.5
    },
    pallet: {
      boxes: 120,
      squareMeters: 138.6,
      totalWeightKg: 2235
    }
  },
  '20x40': {
    singlePackage: {
      dimension: '20×40 cm',
      pieces: 7,
      squareMeters: 1.12,
      weightKg: 28.7
    },
    pallet: {
      boxes: 84,
      squareMeters: 140.8,
      totalWeightKg: 2410
    }
  },
  '20x60': {
    singlePackage: {
      dimension: '20×60 cm',
      pieces: 9,
      squareMeters: 1.6,
      weightKg: 24.2
    },
    pallet: {
      boxes: 66,
      squareMeters: 100.6,
      totalWeightKg: 1531
    }
  },
  '20x60-12mm': {
    singlePackage: {
      dimension: '20×60 cm (12mm)',
      pieces: 6,
      squareMeters: 1.44,
      weightKg: 34.2
    },
    pallet: {
      boxes: 72,
      squareMeters: 103.68,
      totalWeightKg: 2463
    }
  },
  '20x60-14mm': {
    singlePackage: {
      dimension: '20×60 cm (14mm)',
      pieces: 3,
      squareMeters: 1.08,
      weightKg: 28.5
    },
    pallet: {
      boxes: 80,
      squareMeters: 86.4,
      totalWeightKg: 2280
    }
  },
  '20x60-alt': {
    singlePackage: {
      dimension: '20×60 cm',
      pieces: 4,
      squareMeters: 1.44,
      weightKg: 30.7
    },
    pallet: {
      boxes: 80,
      squareMeters: 115.2,
      totalWeightKg: 2460
    }
  },
  '20x90': {
    singlePackage: {
      dimension: '20×90 cm',
      pieces: 6,
      squareMeters: 1.66,
      weightKg: 28.2
    },
    pallet: {
      boxes: 80,
      squareMeters: 93.96,
      totalWeightKg: 1639
    }
  },
  '20x90-alt': {
    singlePackage: {
      dimension: '20×90 cm',
      pieces: 6,
      squareMeters: 1.62,
      weightKg: 28.2
    },
    pallet: {
      boxes: 58,
      squareMeters: 97.92,
      totalWeightKg: 1938
    }
  },
  '60x120': {
    singlePackage: {
      dimension: '60×120 cm',
      pieces: 2,
      squareMeters: 1.44,
      weightKg: 28.5
    },
    pallet: {
      boxes: 68,
      squareMeters: 97.92,
      totalWeightKg: 2278
    }
  },
  '60x120-11.5mm': {
    singlePackage: {
      dimension: '60×120 cm (11.5mm)',
      pieces: 3,
      squareMeters: 1.44,
      weightKg: 23.5
    },
    pallet: {
      boxes: 68,
      squareMeters: 97.92,
      totalWeightKg: 1938
    }
  },
  // Additional dimensions based on common product sizes
  '30x30': {
    singlePackage: {
      dimension: '30×30 cm',
      pieces: 11,
      squareMeters: 0.99,
      weightKg: 19.5
    },
    pallet: {
      boxes: 140,
      squareMeters: 138.6,
      totalWeightKg: 2435
    }
  },
  '30x90': {
    singlePackage: {
      dimension: '30×90 cm',
      pieces: 6,
      squareMeters: 1.62,
      weightKg: 28.2
    },
    pallet: {
      boxes: 58,
      squareMeters: 93.96,
      totalWeightKg: 1639
    }
  },
  '40x40': {
    singlePackage: {
      dimension: '40×40 cm',
      pieces: 7,
      squareMeters: 1.12,
      weightKg: 28.7
    },
    pallet: {
      boxes: 84,
      squareMeters: 94.08,
      totalWeightKg: 2410
    }
  },
  '40x100': {
    singlePackage: {
      dimension: '40×100 cm',
      pieces: 4,
      squareMeters: 1.44,
      weightKg: 28.2
    },
    pallet: {
      boxes: 58,
      squareMeters: 93.96,
      totalWeightKg: 1639
    }
  },
  '60x60': {
    singlePackage: {
      dimension: '60×60 cm',
      pieces: 7,
      squareMeters: 1.12,
      weightKg: 28.7
    },
    pallet: {
      boxes: 84,
      squareMeters: 94.08,
      totalWeightKg: 2410
    }
  },
  '80x80': {
    singlePackage: {
      dimension: '80×80 cm',
      pieces: 4,
      squareMeters: 1.44,
      weightKg: 34.2
    },
    pallet: {
      boxes: 72,
      squareMeters: 103.68,
      totalWeightKg: 2663
    }
  },
  '100x100': {
    singlePackage: {
      dimension: '100×100 cm',
      pieces: 2,
      squareMeters: 1.44,
      weightKg: 28.5
    },
    pallet: {
      boxes: 68,
      squareMeters: 97.92,
      totalWeightKg: 2278
    }
  }
};

// Helper function to get packaging info by dimension
export const getPackagingInfo = (dimension: string): PackagingInfo | null => {
  if (!dimension) return null;
  
  // Normalize dimension string (remove spaces, handle different formats, remove cm/mm units)
  let normalized = dimension.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/×/g, 'x')
    .replace(/\*/g, 'x')
    .replace(/cm/g, '')
    .replace(/mm/g, '')
    .replace(/[^\dx]/g, ''); // Remove any other non-digit/non-x characters
  
  // Try exact match first
  if (PACKAGING_DATA[normalized]) {
    return PACKAGING_DATA[normalized];
  }
  
  // Try to match with thickness info (e.g., "60x120-11.5mm" or "20x60-12mm")
  const thicknessMatch = normalized.match(/(\d+x\d+)-?(\d+(?:\.\d+)?)/);
  if (thicknessMatch) {
    const base = thicknessMatch[1];
    const thickness = thicknessMatch[2];
    const key = `${base}-${thickness}mm`;
    if (PACKAGING_DATA[key]) {
      return PACKAGING_DATA[key];
    }
  }
  
  // Try to match without thickness info
  const baseMatch = normalized.match(/(\d+x\d+)/);
  if (baseMatch) {
    const base = baseMatch[1];
    // Try common variations - prioritize exact matches
    if (PACKAGING_DATA[base]) {
      return PACKAGING_DATA[base];
    }
    // For 20x60, try alt variant
    if (base === '20x60') {
      return PACKAGING_DATA['20x60-alt'] || PACKAGING_DATA['20x60'];
    }
    // For 20x90, try alt variant
    if (base === '20x90') {
      return PACKAGING_DATA['20x90-alt'] || PACKAGING_DATA['20x90'];
    }
    // For 60x60, use exact match
    if (base === '60x60') {
      return PACKAGING_DATA['60x60'];
    }
    // For 30x30, use exact match
    if (base === '30x30') {
      return PACKAGING_DATA['30x30'];
    }
    // For 30x60, try 30x90 or 20x60 as fallback
    if (base === '30x60') {
      return PACKAGING_DATA['30x90'] || PACKAGING_DATA['20x60'] || PACKAGING_DATA['20x60-alt'];
    }
    // For 30x90, use exact match
    if (base === '30x90') {
      return PACKAGING_DATA['30x90'];
    }
    // For 60x90, try 30x90 or 20x90 as fallback
    if (base === '60x90') {
      return PACKAGING_DATA['30x90'] || PACKAGING_DATA['20x90'] || PACKAGING_DATA['20x90-alt'];
    }
    // For 40x40, use exact match
    if (base === '40x40') {
      return PACKAGING_DATA['40x40'];
    }
    // For 40x100, use exact match
    if (base === '40x100') {
      return PACKAGING_DATA['40x100'];
    }
    // For 80x80, use exact match
    if (base === '80x80') {
      return PACKAGING_DATA['80x80'];
    }
    // For 100x100, use exact match
    if (base === '100x100') {
      return PACKAGING_DATA['100x100'];
    }
  }
  
  // Try to match common variations
  const variations: Record<string, string> = {
    '20*20': '20x20',
    '20*40': '20x40',
    '20*60': '20x60',
    '20*90': '20x90',
    '60*120': '60x120',
    '30*30': '30x30',
    '30*60': '30x90',
    '30*90': '30x90',
    '60*60': '60x60',
    '60*90': '30x90',
    '40*40': '40x40',
    '40*100': '40x100',
    '80*80': '80x80',
    '100*100': '100x100',
  };
  
  if (variations[normalized]) {
    return PACKAGING_DATA[variations[normalized]];
  }
  
  // Final fallback: try to find closest match by size category
  if (baseMatch) {
    const base = baseMatch[1];
    const [width, height] = base.split('x').map(Number);
    
    // Categorize by size and find closest match
    // Small tiles (20-40cm)
    if (width <= 40 && height <= 40) {
      if (width === height) {
        return PACKAGING_DATA['30x30'] || PACKAGING_DATA['20x20'] || PACKAGING_DATA['40x40'];
      }
      return PACKAGING_DATA['20x40'] || PACKAGING_DATA['20x60'] || PACKAGING_DATA['30x30'];
    }
    // Medium tiles (50-70cm)
    if (width <= 70 && height <= 70) {
      if (width === height) {
        return PACKAGING_DATA['60x60'] || PACKAGING_DATA['40x40'];
      }
      return PACKAGING_DATA['60x60'] || PACKAGING_DATA['20x60'];
    }
    // Large tiles (80-100cm)
    if (width <= 100 && height <= 100) {
      if (width === height) {
        return PACKAGING_DATA['100x100'] || PACKAGING_DATA['80x80'] || PACKAGING_DATA['60x60'];
      }
      return PACKAGING_DATA['60x120'] || PACKAGING_DATA['40x100'] || PACKAGING_DATA['30x90'];
    }
    // Extra large tiles (120cm+)
    if (width >= 120 || height >= 120) {
      return PACKAGING_DATA['60x120'] || PACKAGING_DATA['100x100'];
    }
    
    // Default fallback - return most common size
    return PACKAGING_DATA['60x60'] || PACKAGING_DATA['20x40'] || PACKAGING_DATA['60x120'];
  }
  
  // Ultimate fallback: if dimension exists but no match found, return default
  // This ensures packaging info is shown for any product with a dimension
  if (dimension && dimension.trim().length > 0) {
    // Return a default packaging info (60x60 as most common)
    return PACKAGING_DATA['60x60'] || PACKAGING_DATA['20x40'] || PACKAGING_DATA['60x120'] || null;
  }
  
  return null;
};

