/**
 * Global places database with coordinates for autocomplete
 * Supports major cities worldwide with location accuracy validation
 */

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category?: string;
  city?: string;
  country?: string;
  accuracy?: number; // Accuracy score 0-100
  population?: number; // Population for ranking
  importance?: number; // Importance score 0-100 (for visualization)
  alias?: string[];
}

/**
 * Mumbai Places Database
 */
export const MUMBAI_PLACES: Place[] = [
  // Landmarks & Tourist Attractions
  {
    id: 'gateway',
    name: 'Gateway of India',
    lat: 18.922,
    lng: 72.8347,
    category: 'Landmark',
    alias: ['gateway', 'monument', 'colaba'],
  },
  {
    id: 'taj',
    name: 'Taj Mahal Hotel',
    lat: 18.9261,
    lng: 72.8323,
    category: 'Hotel',
    alias: ['taj', 'hotel'],
  },
  {
    id: 'marine-drive',
    name: 'Marine Drive',
    lat: 18.9444,
    lng: 72.8265,
    category: 'Landmark',
    alias: ['marine drive', 'queens necklace', 'queen necklace'],
  },
  {
    id: 'sea-link',
    name: 'Bandra Worli Sea Link',
    lat: 19.033,
    lng: 72.8197,
    category: 'Bridge',
    alias: ['sea link', 'bandra worli', 'worli'],
  },
  {
    id: 'cst',
    name: 'CST Station (Chhatrapati Shivaji)',
    lat: 18.9398,
    lng: 72.8354,
    category: 'Railway',
    alias: ['cst', 'victoria terminus', 'station', 'chhatrapati'],
  },

  // Shopping & Entertainment
  {
    id: 'dadar-west',
    name: 'Dadar West',
    lat: 18.9750,
    lng: 72.8258,
    category: 'Shopping',
    alias: ['dadar', 'dadar west'],
  },
  {
    id: 'bandra',
    name: 'Bandra',
    lat: 19.0596,
    lng: 72.8295,
    category: 'Residential',
    alias: ['bandra', 'queen of suburbs'],
  },
  {
    id: 'andheri',
    name: 'Andheri',
    lat: 19.1136,
    lng: 72.9032,
    category: 'Residential',
    alias: ['andheri', 'film city'],
  },
  {
    id: 'juhu-beach',
    name: 'Juhu Beach',
    lat: 19.1073,
    lng: 72.9087,
    category: 'Beach',
    alias: ['juhu', 'beach', 'juhu beach', 'juhu tara road'],
  },
  {
    id: 'powai',
    name: 'Powai Lake',
    lat: 19.1073,
    lng: 72.9087,
    category: 'Lake',
    alias: ['powai', 'lake', 'powai lake'],
  },

  // Business Districts
  {
    id: 'bkc',
    name: 'BKC (Bandra Kurla Complex)',
    lat: 19.0176,
    lng: 72.8479,
    category: 'Business',
    alias: ['bkc', 'bandra kurla', 'financial', 'business'],
  },
  {
    id: 'lower-parel',
    name: 'Lower Parel',
    lat: 19.0176,
    lng: 72.8479,
    category: 'Business',
    alias: ['lower parel', 'parel', 'business district'],
  },
  {
    id: 'navi-mumbai',
    name: 'Navi Mumbai',
    lat: 19.0176,
    lng: 73.0197,
    category: 'City',
    alias: ['navi mumbai', 'cbd belapur', 'panvel'],
  },

  // Religious & Cultural
  {
    id: 'haji-ali',
    name: 'Haji Ali Dargah',
    lat: 18.9827,
    lng: 72.8047,
    category: 'Religious',
    alias: ['haji ali', 'dargah', 'mosque'],
  },
  {
    id: 'siddhivinayak',
    name: 'Siddhivinayak Temple',
    lat: 19.0115,
    lng: 72.8263,
    category: 'Religious',
    alias: ['siddhivinayak', 'temple', 'ganesh'],
  },
  {
    id: 'kala-ghoda',
    name: 'Kala Ghoda Arts',
    lat: 18.9348,
    lng: 72.8324,
    category: 'Cultural',
    alias: ['kala ghoda', 'arts', 'cultural', 'fort'],
  },

  // Hospitals & Healthcare
  {
    id: 'lilavati-hospital',
    name: 'Lilavati Hospital',
    lat: 19.0401,
    lng: 72.8211,
    category: 'Hospital',
    alias: ['lilavati', 'hospital', 'bandra hospital'],
  },
  {
    id: 'breach-candy',
    name: 'Breach Candy Hospital',
    lat: 18.9633,
    lng: 72.8296,
    category: 'Hospital',
    alias: ['breach candy', 'hospital', 'bhulabhai'],
  },

  // Parks & Recreation
  {
    id: 'borivali-park',
    name: 'Sanjay Gandhi National Park',
    lat: 19.3301,
    lng: 72.8093,
    category: 'Park',
    alias: ['borivali', 'national park', 'sanjay gandhi', 'park'],
  },
  {
    id: 'hanging-garden',
    name: 'Hanging Garden',
    lat: 19.0216,
    lng: 72.8203,
    category: 'Park',
    alias: ['hanging garden', 'garden', 'malabar hill'],
  },

  // Transportation Hubs
  {
    id: 'dadar-station',
    name: 'Dadar Railway Station',
    lat: 18.9756,
    lng: 72.8268,
    category: 'Railway',
    alias: ['dadar station', 'station', 'railway'],
  },
  {
    id: 'bandra-station',
    name: 'Bandra Railway Station',
    lat: 19.0601,
    lng: 72.8304,
    category: 'Railway',
    alias: ['bandra station', 'bandra', 'station'],
  },
  {
    id: 'central-airport',
    name: 'Mumbai Central Airport',
    lat: 19.0896,
    lng: 72.8656,
    category: 'Airport',
    alias: ['airport', 'mumbai airport', 'sahar'],
  },

  // Universities
  {
    id: 'iit-bombay',
    name: 'IIT Bombay',
    lat: 19.1263,
    lng: 72.9167,
    category: 'Education',
    alias: ['iit', 'bombay', 'iit bombay', 'university'],
  },
  {
    id: 'iim-mumbai',
    name: 'IIM Mumbai',
    lat: 19.0176,
    lng: 72.8479,
    category: 'Education',
    alias: ['iim', 'institute', 'management'],
  },

  // Shopping Malls
  {
    id: 'infiniti-mall',
    name: 'Infiniti Mall',
    lat: 19.0573,
    lng: 72.8304,
    category: 'Shopping',
    alias: ['infiniti', 'mall', 'bandra mall'],
  },
  {
    id: 'high-street-phoenix',
    name: 'High Street Phoenix',
    lat: 19.0115,
    lng: 72.8263,
    category: 'Shopping',
    alias: ['high street', 'phoenix', 'mall'],
  },

  // Additional Areas
  {
    id: 'colaba',
    name: 'Colaba',
    lat: 18.9632,
    lng: 72.8247,
    category: 'Area',
    alias: ['colaba', 'bhulabhai', 'fort'],
  },
  {
    id: 'mumbra',
    name: 'Mumbra',
    lat: 19.1666,
    lng: 72.9833,
    category: 'Area',
    alias: ['mumbra', 'thane'],
  },
  {
    id: 'dombivli',
    name: 'Dombivli',
    lat: 19.2183,
    lng: 73.0833,
    category: 'Area',
    alias: ['dombivli', 'thane', 'dombivli east'],
  },
];

/**
 * Search for places by name with fuzzy matching
 * Searches across all Mumbai + Pune + Amravati + Global locations
 * Returns up to 'limit' results sorted by relevance and proximity
 */
export function searchPlaces(query: string, userLocation?: { lat: number; lng: number }, limit: number = 60): Place[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();
  
  // Combine all places from all databases
  const allPlaces = [...MUMBAI_PLACES, ...PUNE_PLACES, ...AMRAVATI_PLACES, ...INDIA_PLACES, ...GLOBAL_PLACES];
  
  // Direct name match
  const directMatches = allPlaces.filter(p =>
    p.name.toLowerCase().includes(q)
  ).slice(0, limit);

  if (directMatches.length >= limit) return directMatches;

  // Alias match
  const aliasMatches = allPlaces.filter(p =>
    p.alias?.some(a => a.includes(q)) && !directMatches.find(d => d.id === p.id)
  ).slice(0, limit - directMatches.length);

  // City match
  const cityMatches = allPlaces.filter(p =>
    p.city?.toLowerCase().includes(q) && !directMatches.find(d => d.id === p.id) && !aliasMatches.find(d => d.id === p.id)
  ).slice(0, limit - directMatches.length - aliasMatches.length);

  const results = [...directMatches, ...aliasMatches, ...cityMatches].filter(p => 
    p && typeof p.lat === 'number' && typeof p.lng === 'number' && 
    p.lat >= -90 && p.lat <= 90 && p.lng >= -180 && p.lng <= 180
  );
  
  // Sort by proximity if user location is provided
  if (userLocation && typeof userLocation.lat === 'number' && typeof userLocation.lng === 'number') {
    results.sort((a, b) => {
      if (!a || !b || typeof a.lat !== 'number' || typeof a.lng !== 'number' || typeof b.lat !== 'number' || typeof b.lng !== 'number') {
        return 0;
      }
      const distA = Math.sqrt((a.lat - userLocation.lat) ** 2 + (a.lng - userLocation.lng) ** 2);
      const distB = Math.sqrt((b.lat - userLocation.lat) ** 2 + (b.lng - userLocation.lng) ** 2);
      return distA - distB;
    });
  }

  return results;
}

/**
 * Get a place by ID
 */
export function getPlaceById(id: string): Place | undefined {
  return [...MUMBAI_PLACES, ...PUNE_PLACES, ...AMRAVATI_PLACES, ...INDIA_PLACES, ...GLOBAL_PLACES].find(p => p.id === id);
}

/**
 * Get closest places to coordinates
 */
export function getClosestPlaces(lat: number, lng: number, limit: number = 5): Place[] {
  const allPlaces = [...MUMBAI_PLACES, ...PUNE_PLACES, ...AMRAVATI_PLACES, ...INDIA_PLACES, ...GLOBAL_PLACES];
  const distances = allPlaces.map(p => ({
    place: p,
    distance: Math.sqrt((p.lat - lat) ** 2 + (p.lng - lng) ** 2),
  }));
  
  return distances.sort((a, b) => a.distance - b.distance).slice(0, limit).map(d => d.place);
}

/**
 * Reverse geocode: get place suggestion from coordinates
 */
export function reverseGeocode(lat: number, lng: number, limit: number = 3): Place[] {
  const allPlaces = [...MUMBAI_PLACES, ...PUNE_PLACES, ...AMRAVATI_PLACES, ...INDIA_PLACES, ...GLOBAL_PLACES];
  const MAX_DISTANCE = 0.5; // ~50km radius
  
  const nearby = allPlaces
    .map(p => ({
      place: p,
      distance: Math.sqrt((p.lat - lat) ** 2 + (p.lng - lng) ** 2),
    }))
    .filter(item => item.distance <= MAX_DISTANCE)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(d => d.place);
  
  return nearby;
}

/**
 * Detect user's location from browser
 */
export async function detectUserLocation(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        resolve(null);
      },
      { timeout: 10000 }
    );
  });
}

/**
 * Validate coordinates format
 */
export function validateCoordinates(input: string): { lat: number; lng: number } | null {
  const patterns = [
    /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/, // x,y
    /^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/, // x y
  ];

  for (const pattern of patterns) {
    const match = input.trim().match(pattern);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);

      // Validate ranges
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
  }

  return null;
}

/**
 * Calculate location accuracy score
 * Higher score = more accurate/verified location
 */
export function getLocationAccuracy(place: Place): {
  score: number;
  level: string;
  description: string;
} {
  const accuracy = place.accuracy || 85;

  if (accuracy >= 98) {
    return {
      score: accuracy,
      level: 'GPS',
      description: 'GPS-verified location (±2m)',
    };
  } else if (accuracy >= 95) {
    return {
      score: accuracy,
      level: 'Exact Address',
      description: 'Precise street-level location (±5m)',
    };
  } else if (accuracy >= 90) {
    return {
      score: accuracy,
      level: 'Street Level',
      description: 'Building/street location (±10m)',
    };
  } else if (accuracy >= 85) {
    return {
      score: accuracy,
      level: 'Landmark',
      description: 'Well-known landmark (±50m)',
    };
  } else if (accuracy >= 75) {
    return {
      score: accuracy,
      level: 'Area',
      description: 'Neighborhood or district (±500m)',
    };
  } else if (accuracy >= 50) {
    return {
      score: accuracy,
      level: 'City',
      description: 'City-level accuracy (±5km)',
    };
  } else {
    return {
      score: accuracy,
      level: 'Approximate',
      description: 'Approximate location (±50km)',
    };
  }
}

/**
 * Comprehensive India Places Database - Organized by State > District > Town
 * Covers all major states and union territories with key cities and district headquarters
 */
export const INDIA_PLACES: Place[] = [
  // ========== MAHARASHTRA ==========
  // Mumbai (covered in MUMBAI_PLACES) - Adding state center
  {
    id: 'maharashtra-state',
    name: 'Maharashtra',
    lat: 19.7515,
    lng: 75.7139,
    category: 'State',
    city: 'Maharashtra',
    country: 'India',
    accuracy: 85,
    population: 112374333,
    importance: 95,
    alias: ['maharashtra', 'mh', 'state'],
  },
  // Nagpur District
  {
    id: 'nagpur-city',
    name: 'Nagpur',
    lat: 21.1456,
    lng: 79.0882,
    category: 'City',
    city: 'Nagpur',
    country: 'India',
    accuracy: 95,
    population: 2405421,
    importance: 85,
    alias: ['nagpur', 'orange city'],
  },
  {
    id: 'wardha-town',
    name: 'Wardha',
    lat: 20.7499,
    lng: 78.5914,
    category: 'Town',
    city: 'Wardha',
    country: 'India',
    accuracy: 90,
    population: 185000,
    importance: 65,
    alias: ['wardha', 'sevagram'],
  },
  // Aurangabad District
  {
    id: 'aurangabad-city',
    name: 'Aurangabad',
    lat: 19.8762,
    lng: 75.3433,
    category: 'City',
    city: 'Aurangabad',
    country: 'India',
    accuracy: 95,
    population: 1175000,
    importance: 80,
    alias: ['aurangabad', 'ajanta caves'],
  },
  {
    id: 'paithan-town',
    name: 'Paithan',
    lat: 19.8833,
    lng: 75.2167,
    category: 'Town',
    city: 'Paithan',
    country: 'India',
    accuracy: 85,
    importance: 60,
    alias: ['paithan'],
  },
  // Nashik District
  {
    id: 'nashik-city',
    name: 'Nashik',
    lat: 19.9975,
    lng: 73.7898,
    category: 'City',
    city: 'Nashik',
    country: 'India',
    accuracy: 95,
    population: 1560570,
    importance: 80,
    alias: ['nashik', 'wine city'],
  },
  {
    id: 'malegaon-town',
    name: 'Malegaon',
    lat: 20.5514,
    lng: 74.5202,
    category: 'Town',
    city: 'Malegaon',
    country: 'India',
    accuracy: 90,
    population: 480000,
    importance: 65,
    alias: ['malegaon'],
  },

  // ========== KARNATAKA ==========
  {
    id: 'karnataka-state',
    name: 'Karnataka',
    lat: 15.3173,
    lng: 75.7139,
    category: 'State',
    city: 'Karnataka',
    country: 'India',
    accuracy: 85,
    population: 61130242,
    importance: 90,
    alias: ['karnataka', 'ka'],
  },
  // Bangalore
  {
    id: 'bangalore-city',
    name: 'Bangalore',
    lat: 12.9716,
    lng: 77.5946,
    category: 'City',
    city: 'Bangalore',
    country: 'India',
    accuracy: 95,
    population: 8436675,
    importance: 95,
    alias: ['bangalore', 'silicon valley of india', 'bengaluru'],
  },
  // Mysore District
  {
    id: 'mysore-city',
    name: 'Mysore',
    lat: 12.2958,
    lng: 76.6394,
    category: 'City',
    city: 'Mysore',
    country: 'India',
    accuracy: 95,
    population: 887500,
    importance: 80,
    alias: ['mysore', 'palace city'],
  },
  {
    id: 'nanjangud-town',
    name: 'Nanjangud',
    lat: 12.3333,
    lng: 76.5000,
    category: 'Town',
    city: 'Nanjangud',
    country: 'India',
    accuracy: 85,
    importance: 60,
    alias: ['nanjangud', 'taluk'],
  },
  // Mangalore District
  {
    id: 'mangalore-city',
    name: 'Mangalore',
    lat: 12.8628,
    lng: 74.8430,
    category: 'City',
    city: 'Mangalore',
    country: 'India',
    accuracy: 95,
    population: 625000,
    importance: 75,
    alias: ['mangalore', 'coastal city'],
  },
  // Hubli District
  {
    id: 'hubli-city',
    name: 'Hubli',
    lat: 15.3647,
    lng: 75.1240,
    category: 'City',
    city: 'Hubli',
    country: 'India',
    accuracy: 95,
    population: 943857,
    importance: 75,
    alias: ['hubli', 'dharwad'],
  },

  // ========== TAMIL NADU ==========
  {
    id: 'tamil-nadu-state',
    name: 'Tamil Nadu',
    lat: 11.1271,
    lng: 79.2804,
    category: 'State',
    city: 'Tamil Nadu',
    country: 'India',
    accuracy: 85,
    population: 72147030,
    importance: 92,
    alias: ['tamil nadu', 'tn'],
  },
  // Chennai
  {
    id: 'chennai-city',
    name: 'Chennai',
    lat: 13.0827,
    lng: 80.2707,
    category: 'City',
    city: 'Chennai',
    country: 'India',
    accuracy: 95,
    population: 4646732,
    importance: 92,
    alias: ['chennai', 'madras', 'gateway to south'],
  },
  // Coimbatore District
  {
    id: 'coimbatore-city',
    name: 'Coimbatore',
    lat: 11.0066,
    lng: 76.9655,
    category: 'City',
    city: 'Coimbatore',
    country: 'India',
    accuracy: 95,
    population: 1444275,
    importance: 80,
    alias: ['coimbatore', 'manchester of south india'],
  },
  {
    id: 'nilgiri-town',
    name: 'Nilgiris (Ooty)',
    lat: 11.4102,
    lng: 76.6955,
    category: 'Town',
    city: 'Nilgiris',
    country: 'India',
    accuracy: 90,
    population: 100000,
    importance: 75,
    alias: ['ooty', 'nilgiris', 'hill station'],
  },
  // Madurai District
  {
    id: 'madurai-city',
    name: 'Madurai',
    lat: 9.9252,
    lng: 78.1198,
    category: 'City',
    city: 'Madurai',
    country: 'India',
    accuracy: 95,
    population: 1465496,
    importance: 80,
    alias: ['madurai', 'temple city'],
  },
  // Salem District
  {
    id: 'salem-city',
    name: 'Salem',
    lat: 11.6643,
    lng: 78.1460,
    category: 'City',
    city: 'Salem',
    country: 'India',
    accuracy: 95,
    population: 873500,
    importance: 70,
    alias: ['salem', 'steel city'],
  },
  // Tiruppur District
  {
    id: 'tiruppur-city',
    name: 'Tiruppur',
    lat: 11.1081,
    lng: 77.3410,
    category: 'City',
    city: 'Tiruppur',
    country: 'India',
    accuracy: 95,
    population: 1073327,
    importance: 75,
    alias: ['tiruppur', 'textile hub'],
  },

  // ========== TELANGANA & ANDHRA PRADESH ==========
  {
    id: 'telangana-state',
    name: 'Telangana',
    lat: 15.3173,
    lng: 78.6569,
    category: 'State',
    city: 'Telangana',
    country: 'India',
    accuracy: 85,
    population: 35193978,
    importance: 88,
    alias: ['telangana', 'tg'],
  },
  // Hyderabad
  {
    id: 'hyderabad-city',
    name: 'Hyderabad',
    lat: 17.3850,
    lng: 78.4867,
    category: 'City',
    city: 'Hyderabad',
    country: 'India',
    accuracy: 95,
    population: 6809970,
    importance: 92,
    alias: ['hyderabad', 'city of pearls', 'it city'],
  },
  {
    id: 'warangal-town',
    name: 'Warangal',
    lat: 17.9689,
    lng: 79.5941,
    category: 'Town',
    city: 'Warangal',
    country: 'India',
    accuracy: 90,
    population: 600000,
    importance: 70,
    alias: ['warangal', 'textile city'],
  },
  // Andhra Pradesh
  {
    id: 'andhra-pradesh-state',
    name: 'Andhra Pradesh',
    lat: 15.9129,
    lng: 79.7400,
    category: 'State',
    city: 'Andhra Pradesh',
    country: 'India',
    accuracy: 85,
    population: 49388799,
    importance: 88,
    alias: ['andhra pradesh', 'ap'],
  },
  // Visakhapatnam District
  {
    id: 'visakhapatnam-city',
    name: 'Visakhapatnam',
    lat: 17.6869,
    lng: 83.2185,
    category: 'City',
    city: 'Visakhapatnam',
    country: 'India',
    accuracy: 95,
    population: 1732807,
    importance: 80,
    alias: ['visakhapatnam', 'vizag', 'port city'],
  },
  // Vijayawada District
  {
    id: 'vijayawada-city',
    name: 'Vijayawada',
    lat: 16.5062,
    lng: 80.6480,
    category: 'City',
    city: 'Vijayawada',
    country: 'India',
    accuracy: 95,
    population: 1520343,
    importance: 80,
    alias: ['vijayawada', 'city of victory'],
  },
  // Tirupati District
  {
    id: 'tirupati-city',
    name: 'Tirupati',
    lat: 13.1939,
    lng: 79.8941,
    category: 'City',
    city: 'Tirupati',
    country: 'India',
    accuracy: 95,
    population: 432062,
    importance: 75,
    alias: ['tirupati', 'temple city', 'pilgrimage'],
  },

  // ========== UTTAR PRADESH ==========
  {
    id: 'uttar-pradesh-state',
    name: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    category: 'State',
    city: 'Uttar Pradesh',
    country: 'India',
    accuracy: 85,
    population: 199812341,
    importance: 95,
    alias: ['uttar pradesh', 'up'],
  },
  // Lucknow District
  {
    id: 'lucknow-city',
    name: 'Lucknow',
    lat: 26.8467,
    lng: 80.9462,
    category: 'City',
    city: 'Lucknow',
    country: 'India',
    accuracy: 95,
    population: 2815601,
    importance: 85,
    alias: ['lucknow', 'city of nawabs'],
  },
  // Kanpur District
  {
    id: 'kanpur-city',
    name: 'Kanpur',
    lat: 26.4499,
    lng: 80.3319,
    category: 'City',
    city: 'Kanpur',
    country: 'India',
    accuracy: 95,
    population: 2766348,
    importance: 80,
    alias: ['kanpur', 'manchester of east'],
  },
  // Varanasi District
  {
    id: 'varanasi-city',
    name: 'Varanasi',
    lat: 25.3176,
    lng: 82.9739,
    category: 'City',
    city: 'Varanasi',
    country: 'India',
    accuracy: 95,
    population: 1198491,
    importance: 85,
    alias: ['varanasi', 'holy city', 'kashi', 'benares'],
  },
  // Agra District
  {
    id: 'agra-city',
    name: 'Agra',
    lat: 27.1767,
    lng: 78.0081,
    category: 'City',
    city: 'Agra',
    country: 'India',
    accuracy: 95,
    population: 1585704,
    importance: 85,
    alias: ['agra', 'taj mahal city'],
  },
  {
    id: 'firozabad-town',
    name: 'Firozabad',
    lat: 27.1600,
    lng: 78.3700,
    category: 'Town',
    city: 'Firozabad',
    country: 'India',
    accuracy: 90,
    population: 330000,
    importance: 65,
    alias: ['firozabad'],
  },
  // Meerut District
  {
    id: 'meerut-city',
    name: 'Meerut',
    lat: 28.9845,
    lng: 77.7064,
    category: 'City',
    city: 'Meerut',
    country: 'India',
    accuracy: 95,
    population: 1423575,
    importance: 75,
    alias: ['meerut', 'sports city'],
  },
  // Allahabad District
  {
    id: 'allahabad-city',
    name: 'Allahabad (Prayagraj)',
    lat: 25.4358,
    lng: 81.8463,
    category: 'City',
    city: 'Allahabad',
    country: 'India',
    accuracy: 95,
    population: 1100510,
    importance: 80,
    alias: ['allahabad', 'prayagraj', 'kumbh city'],
  },

  // ========== DELHI ==========
  {
    id: 'delhi-state',
    name: 'Delhi',
    lat: 28.7041,
    lng: 77.1025,
    category: 'Union Territory',
    city: 'Delhi',
    country: 'India',
    accuracy: 95,
    population: 16787941,
    importance: 95,
    alias: ['delhi', 'new delhi', 'capital'],
  },
  {
    id: 'new-delhi-city',
    name: 'New Delhi',
    lat: 28.6139,
    lng: 77.2090,
    category: 'City',
    city: 'New Delhi',
    country: 'India',
    accuracy: 95,
    population: 11000000,
    importance: 95,
    alias: ['new delhi', 'delhi', 'capital'],
  },

  // ========== RAJASTHAN ==========
  {
    id: 'rajasthan-state',
    name: 'Rajasthan',
    lat: 27.0238,
    lng: 74.2179,
    category: 'State',
    city: 'Rajasthan',
    country: 'India',
    accuracy: 85,
    population: 68548437,
    importance: 88,
    alias: ['rajasthan', 'rj', 'land of kings'],
  },
  // Jaipur District
  {
    id: 'jaipur-city',
    name: 'Jaipur',
    lat: 26.9124,
    lng: 75.7873,
    category: 'City',
    city: 'Jaipur',
    country: 'India',
    accuracy: 95,
    population: 3046163,
    importance: 88,
    alias: ['jaipur', 'pink city'],
  },
  {
    id: 'dausa-town',
    name: 'Dausa',
    lat: 26.8544,
    lng: 76.3989,
    category: 'Town',
    city: 'Dausa',
    country: 'India',
    accuracy: 85,
    importance: 60,
    alias: ['dausa'],
  },
  // Jodhpur District
  {
    id: 'jodhpur-city',
    name: 'Jodhpur',
    lat: 26.2389,
    lng: 73.0243,
    category: 'City',
    city: 'Jodhpur',
    country: 'India',
    accuracy: 95,
    population: 1137815,
    importance: 80,
    alias: ['jodhpur', 'blue city'],
  },
  // Udaipur District
  {
    id: 'udaipur-city',
    name: 'Udaipur',
    lat: 24.5854,
    lng: 73.7125,
    category: 'City',
    city: 'Udaipur',
    country: 'India',
    accuracy: 95,
    population: 451100,
    importance: 80,
    alias: ['udaipur', 'city of lakes'],
  },
  // Kota District
  {
    id: 'kota-city',
    name: 'Kota',
    lat: 25.2138,
    lng: 75.8648,
    category: 'City',
    city: 'Kota',
    country: 'India',
    accuracy: 95,
    population: 1001365,
    importance: 75,
    alias: ['kota', 'coaching hub'],
  },

  // ========== WEST BENGAL ==========
  {
    id: 'west-bengal-state',
    name: 'West Bengal',
    lat: 24.8355,
    lng: 88.2381,
    category: 'State',
    city: 'West Bengal',
    country: 'India',
    accuracy: 85,
    population: 91276115,
    importance: 90,
    alias: ['west bengal', 'wb'],
  },
  // Kolkata District
  {
    id: 'kolkata-city',
    name: 'Kolkata',
    lat: 22.5726,
    lng: 88.3639,
    category: 'City',
    city: 'Kolkata',
    country: 'India',
    accuracy: 95,
    population: 4486008,
    importance: 90,
    alias: ['kolkata', 'calcutta', 'city of joy'],
  },
  // Darjeeling District
  {
    id: 'darjeeling-town',
    name: 'Darjeeling',
    lat: 27.0360,
    lng: 88.2663,
    category: 'Town',
    city: 'Darjeeling',
    country: 'India',
    accuracy: 90,
    population: 128500,
    importance: 75,
    alias: ['darjeeling', 'queen of hills', 'tea country'],
  },
  // Durgapur District
  {
    id: 'durgapur-city',
    name: 'Durgapur',
    lat: 23.8103,
    lng: 87.3118,
    category: 'City',
    city: 'Durgapur',
    country: 'India',
    accuracy: 95,
    population: 599150,
    importance: 70,
    alias: ['durgapur', 'steel city'],
  },
  // Siliguri District
  {
    id: 'siliguri-city',
    name: 'Siliguri',
    lat: 26.5124,
    lng: 88.4262,
    category: 'City',
    city: 'Siliguri',
    country: 'India',
    accuracy: 95,
    population: 719591,
    importance: 75,
    alias: ['siliguri', 'gateway to northeast'],
  },

  // ========== BIHAR ==========
  {
    id: 'bihar-state',
    name: 'Bihar',
    lat: 25.5941,
    lng: 85.1376,
    category: 'State',
    city: 'Bihar',
    country: 'India',
    accuracy: 85,
    population: 103804637,
    importance: 85,
    alias: ['bihar', 'br'],
  },
  // Patna District
  {
    id: 'patna-city',
    name: 'Patna',
    lat: 25.5941,
    lng: 85.1376,
    category: 'City',
    city: 'Patna',
    country: 'India',
    accuracy: 95,
    population: 1629999,
    importance: 85,
    alias: ['patna', 'city of educational institutions'],
  },
  // Gaya District
  {
    id: 'gaya-city',
    name: 'Gaya',
    lat: 24.7955,
    lng: 84.9994,
    category: 'City',
    city: 'Gaya',
    country: 'India',
    accuracy: 95,
    population: 429970,
    importance: 75,
    alias: ['gaya', 'pilgrimage city'],
  },
  // Bhagalpur District
  {
    id: 'bhagalpur-city',
    name: 'Bhagalpur',
    lat: 25.2819,
    lng: 86.4728,
    category: 'City',
    city: 'Bhagalpur',
    country: 'India',
    accuracy: 95,
    population: 484426,
    importance: 70,
    alias: ['bhagalpur', 'silk city'],
  },

  // ========== GUJARAT ==========
  {
    id: 'gujarat-state',
    name: 'Gujarat',
    lat: 22.2587,
    lng: 71.1924,
    category: 'State',
    city: 'Gujarat',
    country: 'India',
    accuracy: 85,
    population: 60439692,
    importance: 90,
    alias: ['gujarat', 'gj'],
  },
  // Ahmedabad District
  {
    id: 'ahmedabad-city',
    name: 'Ahmedabad',
    lat: 23.0225,
    lng: 72.5714,
    category: 'City',
    city: 'Ahmedabad',
    country: 'India',
    accuracy: 95,
    population: 5577940,
    importance: 88,
    alias: ['ahmedabad', 'manchester of india'],
  },
  // Surat District
  {
    id: 'surat-city',
    name: 'Surat',
    lat: 21.1706,
    lng: 72.8311,
    category: 'City',
    city: 'Surat',
    country: 'India',
    accuracy: 95,
    population: 4467797,
    importance: 85,
    alias: ['surat', 'diamond city', 'textile hub'],
  },
  // Vadodara District
  {
    id: 'vadodara-city',
    name: 'Vadodara',
    lat: 22.3072,
    lng: 73.1812,
    category: 'City',
    city: 'Vadodara',
    country: 'India',
    accuracy: 95,
    population: 1714681,
    importance: 80,
    alias: ['vadodara', 'baroda'],
  },
  {
    id: 'rajkot-city',
    name: 'Rajkot',
    lat: 22.3039,
    lng: 70.8022,
    category: 'City',
    city: 'Rajkot',
    country: 'India',
    accuracy: 95,
    population: 1286087,
    importance: 75,
    alias: ['rajkot', 'watch city'],
  },
  // Gandhinagar District
  {
    id: 'gandhinagar-city',
    name: 'Gandhinagar',
    lat: 23.1815,
    lng: 72.6298,
    category: 'City',
    city: 'Gandhinagar',
    country: 'India',
    accuracy: 95,
    population: 195779,
    importance: 70,
    alias: ['gandhinagar', 'capital', 'state capital'],
  },

  // ========== MADHYA PRADESH ==========
  {
    id: 'madhya-pradesh-state',
    name: 'Madhya Pradesh',
    lat: 22.9068,
    lng: 78.4563,
    category: 'State',
    city: 'Madhya Pradesh',
    country: 'India',
    accuracy: 85,
    population: 72626458,
    importance: 88,
    alias: ['madhya pradesh', 'mp', 'heart of india'],
  },
  // Indore District
  {
    id: 'indore-city',
    name: 'Indore',
    lat: 22.7196,
    lng: 75.8577,
    category: 'City',
    city: 'Indore',
    country: 'India',
    accuracy: 95,
    population: 1994408,
    importance: 85,
    alias: ['indore', 'cleanest city'],
  },
  // Bhopal District
  {
    id: 'bhopal-city',
    name: 'Bhopal',
    lat: 23.1815,
    lng: 77.4063,
    category: 'City',
    city: 'Bhopal',
    country: 'India',
    accuracy: 95,
    population: 1401000,
    importance: 80,
    alias: ['bhopal', 'city of lakes', 'capital'],
  },
  // Gwalior District
  {
    id: 'gwalior-city',
    name: 'Gwalior',
    lat: 26.2183,
    lng: 78.1667,
    category: 'City',
    city: 'Gwalior',
    country: 'India',
    accuracy: 95,
    population: 1010863,
    importance: 75,
    alias: ['gwalior', 'fortress city'],
  },
  // Jabalpur District
  {
    id: 'jabalpur-city',
    name: 'Jabalpur',
    lat: 23.1815,
    lng: 79.9864,
    category: 'City',
    city: 'Jabalpur',
    country: 'India',
    accuracy: 95,
    population: 1100748,
    importance: 75,
    alias: ['jabalpur', 'diamond city of india'],
  },

  // ========== HARYANA ==========
  {
    id: 'haryana-state',
    name: 'Haryana',
    lat: 29.0588,
    lng: 77.0745,
    category: 'State',
    city: 'Haryana',
    country: 'India',
    accuracy: 85,
    population: 25351462,
    importance: 88,
    alias: ['haryana', 'hr'],
  },
  // Faridabad District
  {
    id: 'faridabad-city',
    name: 'Faridabad',
    lat: 28.4089,
    lng: 77.3178,
    category: 'City',
    city: 'Faridabad',
    country: 'India',
    accuracy: 95,
    population: 1425770,
    importance: 80,
    alias: ['faridabad', 'industrial city'],
  },
  // Gurgaon District
  {
    id: 'gurgaon-city',
    name: 'Gurgaon (Gurugram)',
    lat: 28.4595,
    lng: 77.0266,
    category: 'City',
    city: 'Gurgaon',
    country: 'India',
    accuracy: 95,
    population: 1622066,
    importance: 85,
    alias: ['gurgaon', 'gurugram', 'millennium city'],
  },
  // Hisar District
  {
    id: 'hisar-city',
    name: 'Hisar',
    lat: 29.1536,
    lng: 75.7379,
    category: 'City',
    city: 'Hisar',
    country: 'India',
    accuracy: 95,
    population: 697728,
    importance: 70,
    alias: ['hisar', 'agriculture city'],
  },

  // ========== PUNJAB ==========
  {
    id: 'punjab-state',
    name: 'Punjab',
    lat: 31.5204,
    lng: 74.3587,
    category: 'State',
    city: 'Punjab',
    country: 'India',
    accuracy: 85,
    population: 27743338,
    importance: 85,
    alias: ['punjab', 'pb'],
  },
  // Chandigarh Union Territory
  {
    id: 'chandigarh-city',
    name: 'Chandigarh',
    lat: 30.7333,
    lng: 76.7794,
    category: 'Union Territory',
    city: 'Chandigarh',
    country: 'India',
    accuracy: 95,
    population: 960681,
    importance: 85,
    alias: ['chandigarh', 'planned city'],
  },
  // Amritsar District
  {
    id: 'amritsar-city',
    name: 'Amritsar',
    lat: 31.6340,
    lng: 74.8723,
    category: 'City',
    city: 'Amritsar',
    country: 'India',
    accuracy: 95,
    population: 1132143,
    importance: 80,
    alias: ['amritsar', 'golden temple', 'city of devotion'],
  },
  // Ludhiana District
  {
    id: 'ludhiana-city',
    name: 'Ludhiana',
    lat: 30.9010,
    lng: 75.8573,
    category: 'City',
    city: 'Ludhiana',
    country: 'India',
    accuracy: 95,
    population: 1666789,
    importance: 80,
    alias: ['ludhiana', 'manchester of punjab'],
  },
  // Jalandhar District
  {
    id: 'jalandhar-city',
    name: 'Jalandhar',
    lat: 31.7264,
    lng: 75.5761,
    category: 'City',
    city: 'Jalandhar',
    country: 'India',
    accuracy: 95,
    population: 821515,
    importance: 75,
    alias: ['jalandhar', 'sports hub'],
  },

  // ========== HIMACHAL PRADESH ==========
  {
    id: 'himachal-pradesh-state',
    name: 'Himachal Pradesh',
    lat: 31.7433,
    lng: 77.1205,
    category: 'State',
    city: 'Himachal Pradesh',
    country: 'India',
    accuracy: 85,
    population: 6856509,
    importance: 82,
    alias: ['himachal pradesh', 'hp'],
  },
  // Shimla District
  {
    id: 'shimla-city',
    name: 'Shimla',
    lat: 31.7725,
    lng: 77.1597,
    category: 'City',
    city: 'Shimla',
    country: 'India',
    accuracy: 95,
    population: 169578,
    importance: 78,
    alias: ['shimla', 'hill station', 'capital'],
  },
  // Mandi District
  {
    id: 'mandi-town',
    name: 'Mandi',
    lat: 32.2397,
    lng: 76.9189,
    category: 'Town',
    city: 'Mandi',
    country: 'India',
    accuracy: 90,
    population: 156000,
    importance: 70,
    alias: ['mandi', 'temple town'],
  },
  // Kangra District
  {
    id: 'kangra-town',
    name: 'Kangra',
    lat: 32.2166,
    lng: 76.2600,
    category: 'Town',
    city: 'Kangra',
    country: 'India',
    accuracy: 85,
    population: 200000,
    importance: 70,
    alias: ['kangra'],
  },

  // ========== JHARKHAND ==========
  {
    id: 'jharkhand-state',
    name: 'Jharkhand',
    lat: 23.6102,
    lng: 85.2799,
    category: 'State',
    city: 'Jharkhand',
    country: 'India',
    accuracy: 85,
    population: 32988134,
    importance: 85,
    alias: ['jharkhand', 'jh'],
  },
  // Ranchi District
  {
    id: 'ranchi-city',
    name: 'Ranchi',
    lat: 23.3441,
    lng: 85.3096,
    category: 'City',
    city: 'Ranchi',
    country: 'India',
    accuracy: 95,
    population: 1127331,
    importance: 80,
    alias: ['ranchi', 'capital', 'waterfall city'],
  },
  // Jamshedpur District
  {
    id: 'jamshedpur-city',
    name: 'Jamshedpur',
    lat: 22.8046,
    lng: 86.1826,
    category: 'City',
    city: 'Jamshedpur',
    country: 'India',
    accuracy: 95,
    population: 813396,
    importance: 80,
    alias: ['jamshedpur', 'steel city', 'tata city'],
  },
  // Dhanbad District
  {
    id: 'dhanbad-city',
    name: 'Dhanbad',
    lat: 23.7957,
    lng: 86.4304,
    category: 'City',
    city: 'Dhanbad',
    country: 'India',
    accuracy: 95,
    population: 1186267,
    importance: 75,
    alias: ['dhanbad', 'coal capital'],
  },

  // ========== ASSAM ==========
  {
    id: 'assam-state',
    name: 'Assam',
    lat: 26.1445,
    lng: 92.3656,
    category: 'State',
    city: 'Assam',
    country: 'India',
    accuracy: 85,
    population: 31205576,
    importance: 85,
    alias: ['assam', 'as'],
  },
  // Guwahati District
  {
    id: 'guwahati-city',
    name: 'Guwahati',
    lat: 26.1445,
    lng: 91.7362,
    category: 'City',
    city: 'Guwahati',
    country: 'India',
    accuracy: 95,
    population: 969352,
    importance: 80,
    alias: ['guwahati', 'gateway to northeast'],
  },
  // Nagaland - Kohima
  {
    id: 'nagaland-state',
    name: 'Nagaland',
    lat: 25.6751,
    lng: 94.0827,
    category: 'State',
    city: 'Nagaland',
    country: 'India',
    accuracy: 85,
    population: 1978502,
    importance: 75,
    alias: ['nagaland', 'ng'],
  },
  {
    id: 'kohima-city',
    name: 'Kohima',
    lat: 25.6114,
    lng: 94.1086,
    category: 'City',
    city: 'Kohima',
    country: 'India',
    accuracy: 90,
    population: 130000,
    importance: 75,
    alias: ['kohima', 'capital'],
  },

  // ========== KERALA ==========
  {
    id: 'kerala-state',
    name: 'Kerala',
    lat: 10.8505,
    lng: 76.2711,
    category: 'State',
    city: 'Kerala',
    country: 'India',
    accuracy: 85,
    population: 33387677,
    importance: 88,
    alias: ['kerala', 'kl', 'gods own country'],
  },
  // Kochi District
  {
    id: 'kochi-city',
    name: 'Kochi',
    lat: 9.9312,
    lng: 76.2673,
    category: 'City',
    city: 'Kochi',
    country: 'India',
    accuracy: 95,
    population: 670940,
    importance: 85,
    alias: ['kochi', 'cochin', 'queen of arabian sea'],
  },
  // Trivandrum District
  {
    id: 'thiruvananthapuram-city',
    name: 'Thiruvananthapuram',
    lat: 8.5241,
    lng: 76.9366,
    category: 'City',
    city: 'Thiruvananthapuram',
    country: 'India',
    accuracy: 95,
    population: 957246,
    importance: 85,
    alias: ['trivandrum', 'thiruvananthapuram', 'capital'],
  },
  // Calicut District
  {
    id: 'calicut-city',
    name: 'Calicut (Kozhikode)',
    lat: 11.2588,
    lng: 75.7804,
    category: 'City',
    city: 'Calicut',
    country: 'India',
    accuracy: 95,
    population: 436266,
    importance: 75,
    alias: ['calicut', 'kozhikode', 'city of spices'],
  },

  // ========== UTTARAKHAND ==========
  {
    id: 'uttarakhand-state',
    name: 'Uttarakhand',
    lat: 30.0668,
    lng: 79.0193,
    category: 'State',
    city: 'Uttarakhand',
    country: 'India',
    accuracy: 85,
    population: 10086292,
    importance: 82,
    alias: ['uttarakhand', 'ua'],
  },
  // Dehradun District
  {
    id: 'dehradun-city',
    name: 'Dehradun',
    lat: 30.1988,
    lng: 78.1450,
    category: 'City',
    city: 'Dehradun',
    country: 'India',
    accuracy: 95,
    population: 743332,
    importance: 80,
    alias: ['dehradun', 'forest city', 'capital'],
  },
  // Haridwar District
  {
    id: 'haridwar-city',
    name: 'Haridwar',
    lat: 29.9457,
    lng: 78.1642,
    category: 'City',
    city: 'Haridwar',
    country: 'India',
    accuracy: 95,
    population: 346000,
    importance: 80,
    alias: ['haridwar', 'gateway of gods'],
  },
  // Nainital District
  {
    id: 'nainital-town',
    name: 'Nainital',
    lat: 29.3919,
    lng: 79.4504,
    category: 'Town',
    city: 'Nainital',
    country: 'India',
    accuracy: 90,
    population: 45000,
    importance: 75,
    alias: ['nainital', 'lake city', 'hill station'],
  },

  // ========== JAMMU & KASHMIR ==========
  {
    id: 'jammu-kashmir-state',
    name: 'Jammu & Kashmir',
    lat: 33.7782,
    lng: 76.5769,
    category: 'Union Territory',
    city: 'Jammu & Kashmir',
    country: 'India',
    accuracy: 85,
    population: 12267013,
    importance: 85,
    alias: ['jammu kashmir', 'jk', 'kashmir'],
  },
  // Srinagar District
  {
    id: 'srinagar-city',
    name: 'Srinagar',
    lat: 34.0836,
    lng: 74.7973,
    category: 'City',
    city: 'Srinagar',
    country: 'India',
    accuracy: 95,
    population: 890000,
    importance: 80,
    alias: ['srinagar', 'kashmir', 'city of lakes'],
  },
  // Jammu District
  {
    id: 'jammu-city',
    name: 'Jammu',
    lat: 32.7266,
    lng: 74.8570,
    category: 'City',
    city: 'Jammu',
    country: 'India',
    accuracy: 95,
    population: 600000,
    importance: 75,
    alias: ['jammu', 'city of temples'],
  },
  // Leh District
  {
    id: 'leh-town',
    name: 'Leh',
    lat: 34.1526,
    lng: 77.5770,
    category: 'Town',
    city: 'Leh',
    country: 'India',
    accuracy: 90,
    population: 30000,
    importance: 75,
    alias: ['leh', 'ladakh'],
  },

  // ========== GOA ==========
  {
    id: 'goa-state',
    name: 'Goa',
    lat: 15.2993,
    lng: 73.8243,
    category: 'State',
    city: 'Goa',
    country: 'India',
    accuracy: 85,
    population: 1457723,
    importance: 80,
    alias: ['goa', 'ga'],
  },
  // Panaji District
  {
    id: 'panaji-city',
    name: 'Panaji',
    lat: 15.4938,
    lng: 73.8278,
    category: 'City',
    city: 'Panaji',
    country: 'India',
    accuracy: 95,
    population: 100000,
    importance: 75,
    alias: ['panaji', 'capital'],
  },
  // Margao District
  {
    id: 'margao-city',
    name: 'Margao',
    lat: 15.2808,
    lng: 73.9544,
    category: 'City',
    city: 'Margao',
    country: 'India',
    accuracy: 95,
    population: 94403,
    importance: 70,
    alias: ['margao'],
  },

  // ========== ODISHA ==========
  {
    id: 'odisha-state',
    name: 'Odisha',
    lat: 20.9517,
    lng: 85.0985,
    category: 'State',
    city: 'Odisha',
    country: 'India',
    accuracy: 85,
    population: 41974218,
    importance: 85,
    alias: ['odisha', 'orissa', 'od'],
  },
  // Bhubaneswar District
  {
    id: 'bhubaneswar-city',
    name: 'Bhubaneswar',
    lat: 20.2961,
    lng: 85.8245,
    category: 'City',
    city: 'Bhubaneswar',
    country: 'India',
    accuracy: 95,
    population: 837737,
    importance: 80,
    alias: ['bhubaneswar', 'temple city', 'capital'],
  },
  // Cuttack District
  {
    id: 'cuttack-city',
    name: 'Cuttack',
    lat: 20.4625,
    lng: 85.8830,
    category: 'City',
    city: 'Cuttack',
    country: 'India',
    accuracy: 95,
    population: 606007,
    importance: 75,
    alias: ['cuttack', 'silver city'],
  },

  // ========== CHHATTISGARH ==========
  {
    id: 'chhattisgarh-state',
    name: 'Chhattisgarh',
    lat: 21.2787,
    lng: 81.8661,
    category: 'State',
    city: 'Chhattisgarh',
    country: 'India',
    accuracy: 85,
    population: 25676915,
    importance: 82,
    alias: ['chhattisgarh', 'cg'],
  },
  // Raipur District
  {
    id: 'raipur-city',
    name: 'Raipur',
    lat: 21.2514,
    lng: 81.6296,
    category: 'City',
    city: 'Raipur',
    country: 'India',
    accuracy: 95,
    population: 1098052,
    importance: 80,
    alias: ['raipur', 'rice city', 'capital'],
  },
  // Bilaspur District
  {
    id: 'bilaspur-city',
    name: 'Bilaspur',
    lat: 22.0796,
    lng: 82.1487,
    category: 'City',
    city: 'Bilaspur',
    country: 'India',
    accuracy: 95,
    population: 381796,
    importance: 70,
    alias: ['bilaspur'],
  },

  // ========== TELANGANA (Additional cities) ==========
  {
    id: 'nizamabad-town',
    name: 'Nizamabad',
    lat: 18.6725,
    lng: 78.1348,
    category: 'Town',
    city: 'Nizamabad',
    country: 'India',
    accuracy: 90,
    population: 400000,
    importance: 70,
    alias: ['nizamabad'],
  },

  // ========== HARYANA (Additional cities) ==========
  {
    id: 'ambala-city',
    name: 'Ambala',
    lat: 29.3696,
    lng: 76.7856,
    category: 'City',
    city: 'Ambala',
    country: 'India',
    accuracy: 95,
    population: 401570,
    importance: 70,
    alias: ['ambala', 'cantonment city'],
  },
  {
    id: 'rohtak-city',
    name: 'Rohtak',
    lat: 28.8955,
    lng: 76.5558,
    category: 'City',
    city: 'Rohtak',
    country: 'India',
    accuracy: 95,
    population: 529600,
    importance: 70,
    alias: ['rohtak'],
  },
];

/**
 * Get world cities for global routing
 */
export const GLOBAL_PLACES: Place[] = [
  // USA
  {
    id: 'nyc',
    name: 'New York City',
    lat: 40.7128,
    lng: -74.006,
    city: 'New York',
    country: 'USA',
    accuracy: 95,
    alias: ['ny', 'new york', 'manhattan', 'brooklyn'],
    category: 'City',
    population: 8336817,
    importance: 95,
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    lat: 34.0522,
    lng: -118.2437,
    city: 'Los Angeles',
    country: 'USA',
    accuracy: 95,
    alias: ['la', 'los angeles', 'hollywood'],
    category: 'City',
    population: 3979576,
    importance: 80,
  },
  {
    id: 'chicago',
    name: 'Chicago',
    lat: 41.8781,
    lng: -87.6298,
    city: 'Chicago',
    country: 'USA',
    accuracy: 95,
    alias: ['chicago', 'windy city'],
    category: 'City',
    population: 2693976,
    importance: 75,
  },
  {
    id: 'sf',
    name: 'San Francisco',
    lat: 37.7749,
    lng: -122.4194,
    city: 'San Francisco',
    country: 'USA',
    accuracy: 95,
    alias: ['sf', 'san francisco', 'bay area'],
    category: 'City',
    population: 873965,
    importance: 75,
  },

  // Europe
  {
    id: 'london',
    name: 'London',
    lat: 51.5074,
    lng: -0.1278,
    city: 'London',
    country: 'UK',
    accuracy: 95,
    alias: ['london', 'uk capital'],
    category: 'City',
    population: 9002488,
    importance: 90,
  },
  {
    id: 'paris',
    name: 'Paris',
    lat: 48.8566,
    lng: 2.3522,
    city: 'Paris',
    country: 'France',
    accuracy: 95,
    alias: ['paris', 'eiffel tower', 'city of light'],
    category: 'City',
    population: 2161000,
    importance: 82,
  },
  {
    id: 'berlin',
    name: 'Berlin',
    lat: 52.52,
    lng: 13.405,
    city: 'Berlin',
    country: 'Germany',
    accuracy: 95,
    alias: ['berlin', 'germany'],
    category: 'City',
    population: 3645000,
    importance: 78,
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    lat: 52.3676,
    lng: 4.9041,
    city: 'Amsterdam',
    country: 'Netherlands',
    accuracy: 95,
    alias: ['amsterdam', 'netherlands', 'canals'],
    category: 'City',
    population: 873000,
    importance: 72,
  },
  {
    id: 'rome',
    name: 'Rome',
    lat: 41.9028,
    lng: 12.4964,
    city: 'Rome',
    country: 'Italy',
    accuracy: 95,
    alias: ['rome', 'italy', 'vatican'],
    category: 'City',
    population: 2873494,
    importance: 78,
  },
  {
    id: 'madrid',
    name: 'Madrid',
    lat: 40.4168,
    lng: -3.7038,
    city: 'Madrid',
    country: 'Spain',
    accuracy: 95,
    alias: ['madrid', 'spain'],
    category: 'City',
    population: 3280782,
    importance: 78,
  },

  // Asia
  {
    id: 'tokyo',
    name: 'Tokyo',
    lat: 35.6762,
    lng: 139.6503,
    city: 'Tokyo',
    country: 'Japan',
    accuracy: 95,
    alias: ['tokyo', 'japan'],
    category: 'City',
    population: 37400068,
    importance: 95,
  },
  {
    id: 'delhi',
    name: 'Delhi',
    lat: 28.7041,
    lng: 77.1025,
    city: 'Delhi',
    country: 'India',
    accuracy: 95,
    alias: ['delhi', 'new delhi', 'india capital'],
    category: 'City',
    population: 23010000,
    importance: 85,
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    lat: 13.7563,
    lng: 100.5018,
    city: 'Bangkok',
    country: 'Thailand',
    accuracy: 95,
    alias: ['bangkok', 'thailand'],
    category: 'City',
    population: 8305256,
    importance: 85,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    city: 'Singapore',
    country: 'Singapore',
    accuracy: 95,
    alias: ['singapore', 'lion city'],
    category: 'City',
    population: 5703600,
    importance: 88,
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    lat: 22.3193,
    lng: 114.1694,
    city: 'Hong Kong',
    country: 'Hong Kong',
    accuracy: 95,
    alias: ['hong kong', 'hk'],
    category: 'City',
    population: 7496981,
    importance: 88,
  },
  {
    id: 'shanghai',
    name: 'Shanghai',
    lat: 31.2304,
    lng: 121.4737,
    city: 'Shanghai',
    country: 'China',
    accuracy: 95,
    alias: ['shanghai', 'china'],
    category: 'City',
    population: 24256800,
    importance: 90,
  },
  {
    id: 'seoul',
    name: 'Seoul',
    lat: 37.5665,
    lng: 126.978,
    city: 'Seoul',
    country: 'South Korea',
    accuracy: 95,
    alias: ['seoul', 'korea'],
    category: 'City',
    population: 9704396,
    importance: 85,
  },

  // Middle East & Africa
  {
    id: 'dubai',
    name: 'Dubai',
    lat: 25.2048,
    lng: 55.2708,
    city: 'Dubai',
    country: 'UAE',
    accuracy: 95,
    alias: ['dubai', 'emirates'],
    category: 'City',
    population: 3612000,
    importance: 82,
  },
  {
    id: 'cairo',
    name: 'Cairo',
    lat: 30.0444,
    lng: 31.2357,
    city: 'Cairo',
    country: 'Egypt',
    accuracy: 95,
    alias: ['cairo', 'egypt', 'pyramids'],
    category: 'City',
    population: 20076000,
    importance: 85,
  },
  {
    id: 'johannesburg',
    name: 'Johannesburg',
    lat: -26.2023,
    lng: 28.0436,
    city: 'Johannesburg',
    country: 'South Africa',
    accuracy: 95,
    alias: ['johannesburg', 'south africa', 'joburg'],
    category: 'City',
    population: 4434827,
    importance: 75,
  },

  // Australia & Oceania
  {
    id: 'sydney',
    name: 'Sydney',
    lat: -33.8688,
    lng: 151.2093,
    city: 'Sydney',
    country: 'Australia',
    accuracy: 95,
    alias: ['sydney', 'australia', 'opera house'],
    category: 'City',
    population: 5312163,
    importance: 80,
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    lat: -37.8136,
    lng: 144.9631,
    city: 'Melbourne',
    country: 'Australia',
    accuracy: 95,
    alias: ['melbourne', 'australia'],
    category: 'City',
    population: 4945000,
    importance: 80,
  },
  {
    id: 'auckland',
    name: 'Auckland',
    lat: -37.0882,
    lng: 174.8065,
    city: 'Auckland',
    country: 'New Zealand',
    accuracy: 95,
    alias: ['auckland', 'new zealand'],
    category: 'City',
    population: 1614000,
    importance: 72,
  },

  // South America
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    lat: -23.5505,
    lng: -46.6333,
    city: 'São Paulo',
    country: 'Brazil',
    accuracy: 95,
    alias: ['são paulo', 'sao paulo', 'brazil'],
    category: 'City',
    population: 11895893,
    importance: 85,
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    lat: -34.6037,
    lng: -58.3816,
    city: 'Buenos Aires',
    country: 'Argentina',
    accuracy: 95,
    alias: ['buenos aires', 'argentina', 'paris of south america'],
    category: 'City',
    population: 3050728,
    importance: 78,
  },
  {
    id: 'lima',
    name: 'Lima',
    lat: -12.0464,
    lng: -77.0428,
    city: 'Lima',
    country: 'Peru',
    accuracy: 95,
    alias: ['lima', 'peru'],
    category: 'City',
    population: 9704400,
    importance: 80,
  },

  // Canada
  {
    id: 'toronto',
    name: 'Toronto',
    lat: 43.6532,
    lng: -79.3832,
    city: 'Toronto',
    country: 'Canada',
    accuracy: 95,
    alias: ['toronto', 'canada', 'cn tower'],
    category: 'City',
    population: 2930000,
    importance: 78,
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    lat: 49.283,
    lng: -123.1207,
    city: 'Vancouver',
    country: 'Canada',
    accuracy: 95,
    alias: ['vancouver', 'canada', 'west coast'],
    category: 'City',
    population: 675000,
    importance: 70,
  },

  // Mexico
  {
    id: 'mexico-city',
    name: 'Mexico City',
    lat: 19.4326,
    lng: -99.1332,
    city: 'Mexico City',
    country: 'Mexico',
    accuracy: 95,
    alias: ['mexico city', 'mexico', 'cdmx'],
    category: 'City',
    population: 21576000,
    importance: 90,
  },
];

/**
 * Pune Places Database
 */
export const PUNE_PLACES: Place[] = [
  // Main City & Landmarks
  {
    id: 'pune-city',
    name: 'Pune City Center',
    lat: 18.5204,
    lng: 73.8567,
    category: 'City',
    city: 'Pune',
    country: 'India',
    accuracy: 90,
    population: 5250000,
    importance: 85,
    alias: ['pune', 'city center', 'pune center'],
  },

  // Historical Landmarks
  {
    id: 'shaniwar-wada',
    name: 'Shaniwar Wada',
    lat: 18.5205,
    lng: 73.8544,
    category: 'Landmark',
    city: 'Pune',
    accuracy: 95,
    importance: 90,
    alias: ['shaniwar wada', 'wada', 'fort', 'peshawe fort'],
  },
  {
    id: 'aga-khan-palace',
    name: 'Aga Khan Palace',
    lat: 18.5628,
    lng: 73.8974,
    category: 'Landmark',
    city: 'Pune',
    accuracy: 95,
    importance: 85,
    alias: ['aga khan palace', 'aga khan', 'palace'],
  },
  {
    id: 'lal-mahal',
    name: 'Lal Mahal',
    lat: 18.5265,
    lng: 73.8489,
    category: 'Landmark',
    city: 'Pune',
    accuracy: 95,
    importance: 80,
    alias: ['lal mahal', 'red palace', 'shivaji palace'],
  },

  // Religious Sites
  {
    id: 'dagduseth-halwai',
    name: 'Dagduseth Halwai Temple',
    lat: 18.5304,
    lng: 73.8510,
    category: 'Religious',
    city: 'Pune',
    accuracy: 95,
    importance: 85,
    alias: ['dagduseth', 'temple', 'halwai', 'ganapati'],
  },
  {
    id: 'parvati-temple',
    name: 'Parvati Temple',
    lat: 18.5257,
    lng: 73.8372,
    category: 'Religious',
    city: 'Pune',
    accuracy: 95,
    importance: 80,
    alias: ['parvati temple', 'parvati', 'temple'],
  },
  {
    id: 'osho-ashram',
    name: 'Osho Ashram',
    lat: 18.5371,
    lng: 73.8934,
    category: 'Religious',
    city: 'Pune',
    accuracy: 95,
    importance: 75,
    alias: ['osho ashram', 'osho', 'ashram', 'rajneesh'],
  },
  {
    id: 'khadakvasla-temple',
    name: 'Khadakvasla Cave Temple',
    lat: 18.4395,
    lng: 73.8266,
    category: 'Religious',
    city: 'Pune',
    accuracy: 90,
    importance: 75,
    alias: ['khadakvasla', 'cave', 'temple'],
  },

  // Shopping & Entertainment
  {
    id: 'mg-road-pune',
    name: 'MG Road',
    lat: 18.5340,
    lng: 73.8536,
    category: 'Shopping',
    city: 'Pune',
    accuracy: 90,
    importance: 75,
    alias: ['mg road', 'mahatma gandhi road', 'shopping'],
  },
  {
    id: 'camp-pune',
    name: 'Camp Area',
    lat: 18.5250,
    lng: 73.8450,
    category: 'Area',
    city: 'Pune',
    accuracy: 90,
    importance: 70,
    alias: ['camp', 'cantonment', 'pune camp'],
  },
  {
    id: 'koregaon-park',
    name: 'Koregaon Park',
    lat: 18.5345,
    lng: 73.8934,
    category: 'Area',
    city: 'Pune',
    accuracy: 90,
    importance: 75,
    alias: ['koregaon park', 'koregaon', 'nightlife'],
  },
  {
    id: 'viman-nagar',
    name: 'Viman Nagar',
    lat: 18.5653,
    lng: 73.9131,
    category: 'Residential',
    city: 'Pune',
    accuracy: 85,
    importance: 70,
    alias: ['viman nagar', 'viman', 'airport road'],
  },
  {
    id: 'hinjewadi',
    name: 'Hinjewadi IT Park',
    lat: 18.5898,
    lng: 73.7456,
    category: 'Business',
    city: 'Pune',
    accuracy: 90,
    importance: 80,
    alias: ['hinjewadi', 'it park', 'tech hub', 'phase'],
  },

  // Shopping Malls
  {
    id: 'phoenix-market-city',
    name: 'Phoenix Market City',
    lat: 18.5330,
    lng: 73.8652,
    category: 'Shopping',
    city: 'Pune',
    accuracy: 95,
    importance: 75,
    alias: ['phoenix market city', 'phoenix mall', 'mall'],
  },
  {
    id: 'orion-mall',
    name: 'Orion Mall',
    lat: 18.5390,
    lng: 73.9015,
    category: 'Shopping',
    city: 'Pune',
    accuracy: 95,
    importance: 70,
    alias: ['orion mall', 'orion', 'mall', 'koregaon'],
  },
  {
    id: 'westend-mall',
    name: 'Westend Mall',
    lat: 18.5263,
    lng: 73.8578,
    category: 'Shopping',
    city: 'Pune',
    accuracy: 95,
    importance: 70,
    alias: ['westend mall', 'westend', 'mall'],
  },

  // Parks & Gardens
  {
    id: 'saras-baug',
    name: 'Saras Baug',
    lat: 18.5232,
    lng: 73.8413,
    category: 'Park',
    city: 'Pune',
    accuracy: 90,
    importance: 65,
    alias: ['saras baug', 'baug', 'garden'],
  },
  {
    id: 'rajiv-gandhi-udyan',
    name: 'Rajiv Gandhi Udyan',
    lat: 18.5487,
    lng: 73.8267,
    category: 'Park',
    city: 'Pune',
    accuracy: 90,
    importance: 65,
    alias: ['rajiv gandhi', 'udyan', 'park'],
  },
  {
    id: 'khadakvasla-lake',
    name: 'Khadakvasla Lake',
    lat: 18.4395,
    lng: 73.8266,
    category: 'Lake',
    city: 'Pune',
    accuracy: 90,
    importance: 70,
    alias: ['khadakvasla lake', 'lake', 'water reservoir'],
  },

  // Universities & Education
  {
    id: 'savitribai-phule-university',
    name: 'Savitribai Phule University',
    lat: 18.5436,
    lng: 73.8198,
    category: 'Education',
    city: 'Pune',
    accuracy: 90,
    importance: 75,
    alias: ['sppu', 'savitribai phule', 'university', 'pune university'],
  },
  {
    id: 'fergusson-college',
    name: 'Fergusson College',
    lat: 18.5326,
    lng: 73.8486,
    category: 'Education',
    city: 'Pune',
    accuracy: 95,
    importance: 75,
    alias: ['fergusson college', 'fergusson', 'college'],
  },
  {
    id: 'symbiosis-deemed-university',
    name: 'Symbiosis Deemed University',
    lat: 18.5988,
    lng: 73.8132,
    category: 'Education',
    city: 'Pune',
    accuracy: 90,
    importance: 70,
    alias: ['symbiosis', 'deemed university', 'sus'],
  },

  // Hospitals
  {
    id: 'jehangir-hospital',
    name: 'Jehangir Hospital',
    lat: 18.5379,
    lng: 73.8511,
    category: 'Hospital',
    city: 'Pune',
    accuracy: 95,
    importance: 70,
    alias: ['jehangir hospital', 'hospital', 'pune hospital'],
  },
  {
    id: 'ruby-hall-clinic',
    name: 'Ruby Hall Clinic',
    lat: 18.5399,
    lng: 73.8742,
    category: 'Hospital',
    city: 'Pune',
    accuracy: 95,
    importance: 70,
    alias: ['ruby hall', 'clinic', 'hospital'],
  },

  // Transportation Hubs
  {
    id: 'pune-railway-station',
    name: 'Pune Railway Station',
    lat: 18.5265,
    lng: 73.8360,
    category: 'Railway',
    city: 'Pune',
    accuracy: 95,
    importance: 75,
    alias: ['pune railway station', 'station', 'railway', 'prt'],
  },
  {
    id: 'pune-airport',
    name: 'Pune Airport',
    lat: 18.5794,
    lng: 73.9199,
    category: 'Airport',
    city: 'Pune',
    accuracy: 95,
    importance: 80,
    alias: ['pune airport', 'airport', 'ajmera'],
  },

  // Other Areas
  {
    id: 'baner-pune',
    name: 'Baner',
    lat: 18.5707,
    lng: 73.7909,
    category: 'Residential',
    city: 'Pune',
    accuracy: 85,
    importance: 65,
    alias: ['baner', 'baner road'],
  },
  {
    id: 'wakad-pune',
    name: 'Wakad',
    lat: 18.5880,
    lng: 73.7895,
    category: 'Residential',
    city: 'Pune',
    accuracy: 85,
    importance: 65,
    alias: ['wakad', 'wakad area'],
  },
  {
    id: 'aundh-pune',
    name: 'Aundh',
    lat: 18.5620,
    lng: 73.8097,
    category: 'Residential',
    city: 'Pune',
    accuracy: 85,
    importance: 65,
    alias: ['aundh', 'aundh road'],
  },
];

/**
 * Amravati Places Database
 */
export const AMRAVATI_PLACES: Place[] = [
  // Main City & Center
  {
    id: 'amravati-city',
    name: 'Amravati City Center',
    lat: 20.8530,
    lng: 77.7740,
    category: 'City',
    city: 'Amravati',
    country: 'India',
    accuracy: 90,
    population: 650000,
    importance: 75,
    alias: ['amravati', 'city center', 'amravati center'],
  },

  // Religious & Historical Sites
  {
    id: 'ambazari-temple',
    name: 'Ambazari Temple',
    lat: 20.8445,
    lng: 77.7629,
    category: 'Religious',
    city: 'Amravati',
    accuracy: 95,
    importance: 90,
    alias: ['ambazari temple', 'ambazari', 'devi temple'],
  },
  {
    id: 'chintamani-temple',
    name: 'Chintamani Temple',
    lat: 20.8550,
    lng: 77.7720,
    category: 'Religious',
    city: 'Amravati',
    accuracy: 95,
    importance: 85,
    alias: ['chintamani temple', 'chintamani', 'temple'],
  },
  {
    id: 'jai-vihar-temple',
    name: 'Jai Vihar Temple',
    lat: 20.8602,
    lng: 77.7789,
    category: 'Religious',
    city: 'Amravati',
    accuracy: 95,
    importance: 80,
    alias: ['jai vihar', 'vihar', 'temple'],
  },
  {
    id: 'gajanan-maharaj-temple',
    name: 'Gajanan Maharaj Temple',
    lat: 20.8530,
    lng: 77.7850,
    category: 'Religious',
    city: 'Amravati',
    accuracy: 95,
    importance: 85,
    alias: ['gajanan maharaj', 'gajanan', 'temple'],
  },
  {
    id: 'mukundwadi-temple',
    name: 'Mukundwadi Temple',
    lat: 20.8480,
    lng: 77.7680,
    category: 'Religious',
    city: 'Amravati',
    accuracy: 90,
    importance: 75,
    alias: ['mukundwadi', 'mukundwadi temple', 'temple'],
  },

  // Shopping & Commercial Areas
  {
    id: 'court-area-amravati',
    name: 'Court Area',
    lat: 20.8510,
    lng: 77.7680,
    category: 'Shopping',
    city: 'Amravati',
    accuracy: 90,
    importance: 75,
    alias: ['court area', 'court', 'shopping'],
  },
  {
    id: 'nandanvan-amravati',
    name: 'Nandanvan',
    lat: 20.8620,
    lng: 77.7580,
    category: 'Area',
    city: 'Amravati',
    accuracy: 85,
    importance: 65,
    alias: ['nandanvan', 'nandanvan area'],
  },
  {
    id: 'badnera-amravati',
    name: 'Badnera',
    lat: 20.8780,
    lng: 77.7920,
    category: 'Area',
    city: 'Amravati',
    accuracy: 85,
    importance: 70,
    alias: ['badnera', 'badnera area', 'industrial'],
  },
  {
    id: 'satpur-amravati',
    name: 'Satpur',
    lat: 20.8650,
    lng: 77.7610,
    category: 'Residential',
    city: 'Amravati',
    accuracy: 85,
    importance: 65,
    alias: ['satpur', 'satpur area'],
  },

  // Parks & Green Spaces
  {
    id: 'ambazari-lake',
    name: 'Ambazari Lake',
    lat: 20.8445,
    lng: 77.7629,
    category: 'Lake',
    city: 'Amravati',
    accuracy: 90,
    importance: 70,
    alias: ['ambazari lake', 'lake', 'water body'],
  },
  {
    id: 'coronation-park',
    name: 'Coronation Park',
    lat: 20.8560,
    lng: 77.7750,
    category: 'Park',
    city: 'Amravati',
    accuracy: 90,
    importance: 65,
    alias: ['coronation park', 'park', 'garden'],
  },

  // Educational Institutions
  {
    id: 'sant-gadge-baba-university',
    name: 'Sant Gadge Baba University',
    lat: 20.9080,
    lng: 77.7640,
    category: 'Education',
    city: 'Amravati',
    accuracy: 90,
    importance: 75,
    alias: ['sgbu', 'sant gadge baba', 'university', 'amravati university'],
  },
  {
    id: 'lIT-amravati',
    name: 'Laxminarayan Institute of Technology',
    lat: 20.8680,
    lng: 77.7520,
    category: 'Education',
    city: 'Amravati',
    accuracy: 90,
    importance: 70,
    alias: ['lit', 'laxminarayan', 'institute', 'technology'],
  },

  // Healthcare
  {
    id: 'amravati-civil-hospital',
    name: 'Amravati Civil Hospital',
    lat: 20.8530,
    lng: 77.7850,
    category: 'Hospital',
    city: 'Amravati',
    accuracy: 95,
    importance: 70,
    alias: ['civil hospital', 'hospital', 'govt hospital'],
  },
  {
    id: 'govt-medical-college',
    name: 'Government Medical College',
    lat: 20.8950,
    lng: 77.7680,
    category: 'Hospital',
    city: 'Amravati',
    accuracy: 90,
    importance: 75,
    alias: ['gmc', 'medical college', 'hospital', 'gmc amravati'],
  },

  // Transportation
  {
    id: 'amravati-railway-station',
    name: 'Amravati Railway Station',
    lat: 20.8482,
    lng: 77.7562,
    category: 'Railway',
    city: 'Amravati',
    accuracy: 95,
    importance: 75,
    alias: ['amravati railway station', 'station', 'railway', 'ars'],
  },
  {
    id: 'amravati-bus-stand',
    name: 'Amravati Bus Stand',
    lat: 20.8510,
    lng: 77.7680,
    category: 'Bus Station',
    city: 'Amravati',
    accuracy: 90,
    importance: 70,
    alias: ['bus stand', 'bus station', 'central bus stand'],
  },

  // Commercial & Business
  {
    id: 'amravati-cotton-market',
    name: 'Cotton Market',
    lat: 20.8520,
    lng: 77.7720,
    category: 'Market',
    city: 'Amravati',
    accuracy: 85,
    importance: 70,
    alias: ['cotton market', 'market', 'textile market'],
  },
  {
    id: 'gajanan-nagar',
    name: 'Gajanan Nagar',
    lat: 20.8590,
    lng: 77.7810,
    category: 'Residential',
    city: 'Amravati',
    accuracy: 85,
    importance: 65,
    alias: ['gajanan nagar', 'nagar', 'residential'],
  },
  {
    id: 'rajendra-nagar',
    name: 'Rajendra Nagar',
    lat: 20.8480,
    lng: 77.7780,
    category: 'Residential',
    city: 'Amravati',
    accuracy: 85,
    importance: 65,
    alias: ['rajendra nagar', 'rajendra', 'nagar'],
  },

  // Other Notable Locations
  {
    id: 'vidyanagar-amravati',
    name: 'Vidyanagar',
    lat: 20.8700,
    lng: 77.7650,
    category: 'Residential',
    city: 'Amravati',
    accuracy: 85,
    importance: 65,
    alias: ['vidyanagar', 'vidya', 'educational area'],
  },
  {
    id: 'kasturba-nagar',
    name: 'Kasturba Nagar',
    lat: 20.8420,
    lng: 77.7890,
    category: 'Residential',
    city: 'Amravati',
    accuracy: 85,
    importance: 65,
    alias: ['kasturba nagar', 'kasturba', 'nagar'],
  },
];
