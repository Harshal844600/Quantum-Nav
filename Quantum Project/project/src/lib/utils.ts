/**
 * Utility functions for QuantumNav application
 */

// Road factor adjustments for straight-line to actual road distance
const ROAD_FACTORS: Record<string, number> = {
  urban: 1.35,      // Urban routes are 35% longer due to street layout
  highway: 1.05,    // Highway routes follow more direct paths
  mixed: 1.15,      // Mixed routes average out
  default: 1.20,    // Default safety factor
};

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  region: string = 'urban'
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  
  // Pure straight-line distance
  const straightDistance = 2 * R * Math.asin(Math.sqrt(a));
  
  // Apply road factor for realistic routing (urban routes take longer)
  const roadFactor = ROAD_FACTORS[region] || ROAD_FACTORS.default;
  return straightDistance * roadFactor;
}

export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): string {
  const latA = (lat1 * Math.PI) / 180;
  const latB = (lat2 * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(latB);
  const x =
    Math.cos(latA) * Math.sin(latB) -
    Math.sin(latA) * Math.cos(latB) * Math.cos(dLng);
  const bearing = Math.atan2(y, x) * (180 / Math.PI);
  const normalized = (bearing + 360) % 360;

  if (normalized < 22.5 || normalized >= 337.5) return 'North';
  if (normalized < 67.5) return 'Northeast';
  if (normalized < 112.5) return 'East';
  if (normalized < 157.5) return 'Southeast';
  if (normalized < 202.5) return 'South';
  if (normalized < 247.5) return 'Southwest';
  if (normalized < 292.5) return 'West';
  return 'Northwest';
}

export function estimateTime(distance: number, region: string = 'urban'): number {
  // More accurate speed estimation based on region
  // Urban: 15-23 km/h, Highway: 60-80 km/h, Mixed: 30-45 km/h
  let avgSpeed: number;
  
  switch (region.toLowerCase()) {
    case 'highway':
      avgSpeed = 70;
      break;
    case 'rural':
      avgSpeed = 50;
      break;
    case 'mixed':
      avgSpeed = 40;
      break;
    case 'urban':
    default:
      avgSpeed = 20; // Better for Mumbai urban average
  }
  
  // Add slight traffic variation for realism
  const trafficFactor = 0.9 + Math.random() * 0.2;
  const effectiveSpeed = avgSpeed * trafficFactor;
  
  return Math.round((distance / effectiveSpeed) * 60); // Return minutes
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${(km * 1000).toFixed(0)}m`;
  }
  return `${km.toFixed(1)}km`;
}

export function formatHour(hour: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
}

export function calculateCO2Savings(distance: number, vehicleType: string = 'petrol_car'): number {
  // CO2 emissions vary by vehicle type (in kg CO2 per km)
  const emissions: Record<string, number> = {
    petrol_car: 0.210,      // 210 grams per km
    diesel_car: 0.170,      // 170 grams per km
    cng_car: 0.130,         // 130 grams per km
    electric_car: 0.050,    // 50 grams per km (accounting for grid)
    hybrid_car: 0.110,      // 110 grams per km
    auto_rickshaw: 0.090,   // 90 grams per km
    bike: 0.035,            // 35 grams per km
  };
  
  const emissionRate = emissions[vehicleType] || 0.210;
  // Quantum optimization saves ~25-35% on distance (being more conservative)
  return distance * emissionRate * 0.30;
}

export function isPeakHour(hour: number): boolean {
  return hour === 8 || hour === 9 || hour === 17 || hour === 18;
}

export async function simulateDelay(ms: number = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class StorageManager {
  private static readonly PREFIX = 'quantum-nav-';

  static set(key: string, value: unknown): void {
    try {
      localStorage.setItem(
        `${StorageManager.PREFIX}${key}`,
        JSON.stringify(value)
      );
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }

  static get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = localStorage.getItem(`${StorageManager.PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to retrieve ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(`${StorageManager.PREFIX}${key}`);
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage:`, error);
    }
  }

  static clear(): void {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(StorageManager.PREFIX))
        .forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}
