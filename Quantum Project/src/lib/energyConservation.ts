/**
 * Real-time energy conservation and emission tracking
 * Calculates accurate CO2, fuel, and energy metrics based on actual optimization results
 */

export interface VehicleProfile {
  name: string;
  type: 'car' | 'truck' | 'bus' | 'motorcycle' | 'scooter';
  fuelType: 'petrol' | 'diesel' | 'cng' | 'electric' | 'hybrid';
  fuelConsumption: number; // L/km or kWh/km
  co2EmissionFactor: number; // kg CO2 per liter/kWh
  avgSpeed: number; // km/h
}

// Standard vehicle profiles for Mumbai
export const VEHICLE_PROFILES: Record<string, VehicleProfile> = {
  petrol_car: {
    name: 'Petrol Car',
    type: 'car',
    fuelType: 'petrol',
    fuelConsumption: 0.075, // 13.3 km/liter (improved estimate)
    co2EmissionFactor: 2.31, // kg CO2 per liter
    avgSpeed: 25,
  },
  diesel_car: {
    name: 'Diesel Car',
    type: 'car',
    fuelType: 'diesel',
    fuelConsumption: 0.063, // 15.8 km/liter (improved estimate)
    co2EmissionFactor: 2.68, // kg CO2 per liter
    avgSpeed: 26,
  },
  cng_car: {
    name: 'CNG Car',
    type: 'car',
    fuelType: 'cng',
    fuelConsumption: 0.048, // 20.8 km per kg (improved)
    co2EmissionFactor: 2.75, // kg CO2 per kg CNG
    avgSpeed: 25,
  },
  electric_car: {
    name: 'Electric Car',
    type: 'car',
    fuelType: 'electric',
    fuelConsumption: 0.14, // kWh per km (improved estimate)
    co2EmissionFactor: 0.62, // kg CO2 per kWh (better grid average)
    avgSpeed: 32,
  },
  hybrid_car: {
    name: 'Hybrid Car',
    type: 'car',
    fuelType: 'hybrid',
    fuelConsumption: 0.037, // 27 km/liter equivalent (improved)
    co2EmissionFactor: 1.4, // kg CO2 per liter equivalent
    avgSpeed: 30,
  },
  auto_rickshaw: {
    name: 'Auto Rickshaw',
    type: 'car',
    fuelType: 'cng',
    fuelConsumption: 0.038, // 26 km per kg (more realistic)
    co2EmissionFactor: 2.5, // kg CO2 per kg CNG
    avgSpeed: 22,
  },
  bike: {
    name: 'Motorcycle',
    type: 'motorcycle',
    fuelType: 'petrol',
    fuelConsumption: 0.03, // 33 km/liter (improved)
    co2EmissionFactor: 2.31, // kg CO2 per liter
    avgSpeed: 38,
  },
};

export interface EnergyMetrics {
  distance: number; // km
  duration: number; // minutes
  fuelConsumed: number; // liters or equivalent
  co2Emitted: number; // kg
  energyUsed: number; // kWh (for electric or working equivalent)
  cost: number; // in rupees
  tree_offset: number; // equivalent trees to offset CO2
}

export interface ConservationResult {
  initialRoute: EnergyMetrics;
  optimizedRoute: EnergyMetrics;
  savings: {
    distance: number; // km saved
    duration: number; // minutes saved
    fuel: number; // liters/kg saved
    co2: number; // kg CO2 saved
    energy: number; // kWh saved
    cost: number; // rupees saved
    trees: number; // trees equivalent
  };
  improvementPercent: {
    distance: number; // %
    duration: number; // %
    fuel: number; // %
    co2: number; // %
    cost: number; // %
  };
}

export function getVehicleProfile(type: string = 'cng_car'): VehicleProfile {
  return VEHICLE_PROFILES[type] || VEHICLE_PROFILES.cng_car;
}

/**
 * Calculate metrics for a single route
 */
export function calculateRouteMetrics(
  distanceKm: number,
  durationMinutes: number,
  vehicleProfile: VehicleProfile = VEHICLE_PROFILES.cng_car
): EnergyMetrics {
  const fuelConsumed = distanceKm * vehicleProfile.fuelConsumption;
  const co2Emitted = fuelConsumed * vehicleProfile.co2EmissionFactor;
  
  // Energy calculation (kWh equivalent)
  let energyUsed: number;
  if (vehicleProfile.fuelType === 'electric') {
    energyUsed = fuelConsumed; // Already in kWh
  } else {
    // Convert fuel to energy: 1L petrol ≈ 8.5 kWh, 1L diesel ≈ 9.0 kWh, 1kg CNG ≈ 12.5 kWh
    const energyFactors: Record<string, number> = {
      petrol: 8.5,
      diesel: 9.0,
      cng: 12.5,
      hybrid: 6.0,
      electric: 1.0,
    };
    energyUsed = fuelConsumed * (energyFactors[vehicleProfile.fuelType] || 8.5);
  }

  // Cost calculation (updated for Mumbai 2026)
  const costs: Record<string, number> = {
    petrol: 108, // per liter (updated)
    diesel: 95,  // per liter (updated)
    cng: 78,     // per kg (updated)
    electric: 2.5, // per kWh (updated)
    hybrid: 108, // per liter
  };
  const cost = fuelConsumed * (costs[vehicleProfile.fuelType] || 78);

  // Tree offset: 1 mature tree absorbs ~20 kg CO2 per year, ~0.055 kg per day
  const treeOffset = co2Emitted / 20;

  return {
    distance: distanceKm,
    duration: durationMinutes,
    fuelConsumed,
    co2Emitted,
    energyUsed,
    cost,
    tree_offset: treeOffset,
  };
}

/**
 * Compare initial and optimized routes to calculate conservation
 */
export function calculateConservation(
  initialDistanceKm: number,
  optimizedDistanceKm: number,
  vehicleType: string = 'cng_car'
): ConservationResult {
  const vehicle = getVehicleProfile(vehicleType);

  // Estimate duration: average Mumbai speed ~25 km/h
  const avgSpeed = vehicle.avgSpeed;
  const initialDuration = (initialDistanceKm / avgSpeed) * 60;
  const optimizedDuration = (optimizedDistanceKm / avgSpeed) * 60;

  const initialRoute = calculateRouteMetrics(initialDistanceKm, initialDuration, vehicle);
  const optimizedRoute = calculateRouteMetrics(optimizedDistanceKm, optimizedDuration, vehicle);

  const savings = {
    distance: initialRoute.distance - optimizedRoute.distance,
    duration: initialRoute.duration - optimizedRoute.duration,
    fuel: initialRoute.fuelConsumed - optimizedRoute.fuelConsumed,
    co2: initialRoute.co2Emitted - optimizedRoute.co2Emitted,
    energy: initialRoute.energyUsed - optimizedRoute.energyUsed,
    cost: initialRoute.cost - optimizedRoute.cost,
    trees: initialRoute.tree_offset - optimizedRoute.tree_offset,
  };

  const improvementPercent = {
    distance: (savings.distance / initialRoute.distance) * 100,
    duration: (savings.duration / initialRoute.duration) * 100,
    fuel: (savings.fuel / initialRoute.fuelConsumed) * 100,
    co2: (savings.co2 / initialRoute.co2Emitted) * 100,
    cost: (savings.cost / initialRoute.cost) * 100,
  };

  return {
    initialRoute,
    optimizedRoute,
    savings,
    improvementPercent,
  };
}

/**
 * Real-time conservation calculation during optimization
 */
export function calculateRealTimeConservation(
  currentDistanceKm: number,
  totalInitialDistanceKm: number,
  vehicleType: string = 'cng_car'
): Partial<ConservationResult> {
  const vehicle = getVehicleProfile(vehicleType);
  const improvement = totalInitialDistanceKm - currentDistanceKm;
  const improvementPercent = (improvement / totalInitialDistanceKm) * 100;

  const fuelSaved = improvement * vehicle.fuelConsumption;
  const co2Saved = fuelSaved * vehicle.co2EmissionFactor;
  const energySaved = improvement * vehicle.fuelConsumption * 8.5; // Avg energy factor
  const costSaved = fuelSaved * 75; // Avg cost per unit

  return {
    savings: {
      distance: improvement,
      duration: (improvement / vehicle.avgSpeed) * 60,
      fuel: fuelSaved,
      co2: co2Saved,
      energy: energySaved,
      cost: costSaved,
      trees: co2Saved / 20,
    },
    improvementPercent: {
      distance: improvementPercent,
      duration: improvementPercent,
      fuel: improvementPercent,
      co2: improvementPercent,
      cost: improvementPercent,
    },
  };
}

/**
 * Format metrics for display
 */
export function formatMetrics(metrics: EnergyMetrics): Record<string, string> {
  return {
    distance: `${metrics.distance.toFixed(2)} km`,
    duration: `${metrics.duration.toFixed(0)} min`,
    fuel: `${metrics.fuelConsumed.toFixed(2)} L/kg`,
    co2: `${metrics.co2Emitted.toFixed(2)} kg`,
    energy: `${metrics.energyUsed.toFixed(2)} kWh`,
    cost: `₹${metrics.cost.toFixed(0)}`,
    trees: `${metrics.tree_offset.toFixed(2)}`,
  };
}

/**
 * Get environmental impact summary
 */
export function getImpactSummary(co2Kg: number): string {
  if (co2Kg < 0.1) return 'Negligible impact';
  if (co2Kg < 1) return 'Very light footprint';
  if (co2Kg < 5) return 'Light footprint';
  if (co2Kg < 10) return 'Moderate footprint';
  if (co2Kg < 20) return 'Significant footprint';
  return 'Heavy footprint';
}

/**
 * Calculate equivalent environmental impacts
 */
export function getEquivalentImpacts(co2Kg: number) {
  return {
    car_miles: (co2Kg / 0.41).toFixed(1), // ~0.41 kg CO2 per km of car
    tree_months: (co2Kg / (20 / 12)).toFixed(2), // Tree offsets 20kg per year
    flights_km: (co2Kg / 0.255).toFixed(0), // ~0.255 kg per km flight
    smartphones: (co2Kg / 0.061).toFixed(0), // Smartphone production ~61kg CO2
  };
}
