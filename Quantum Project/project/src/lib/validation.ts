/**
 * Validation Utilities
 * Provides type guards and validators for safe data handling
 */

import type { Waypoint, SolverResult } from './quantumSolver';

/**
 * Type guard to check if a value is a valid Waypoint
 */
export function isValidWaypoint(value: unknown): value is Waypoint {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as any).lat === 'number' &&
    typeof (value as any).lng === 'number' &&
    typeof (value as any).label === 'string' &&
    typeof (value as any).id === 'string' &&
    isValidCoordinate((value as any).lat, (value as any).lng)
  );
}

/**
 * Type guard to safely check if a waypoint has valid coordinates
 */
export function hasValidCoordinates(
  value: unknown
): value is { lat: number; lng: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as any).lat === 'number' &&
    typeof (value as any).lng === 'number' &&
    isValidCoordinate((value as any).lat, (value as any).lng)
  );
}

/**
 * Check if coordinates are within valid geographic bounds
 */
export function isValidCoordinate(lat: unknown, lng: unknown): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Filter waypoints array to only include valid waypoints
 */
export function filterValidWaypoints(waypoints: unknown[]): Waypoint[] {
  if (!Array.isArray(waypoints)) {
    return [];
  }
  return waypoints.filter((w): w is Waypoint => isValidWaypoint(w));
}

/**
 * Safely get waypoint at index, returns null if invalid
 */
export function getSafeWaypoint(
  waypoints: Waypoint[] | unknown[],
  index: number
): Waypoint | null {
  if (!Array.isArray(waypoints) || index < 0 || index >= waypoints.length) {
    return null;
  }
  const wp = waypoints[index];
  return isValidWaypoint(wp) ? wp : null;
}

/**
 * Validate waypoint array and return filtered valid waypoints with error reporting
 */
export function validateWaypoints(
  waypoints: unknown[],
  context: string = 'waypoints'
): { valid: Waypoint[]; invalid: number; errors: string[] } {
  const errors: string[] = [];
  const valid: Waypoint[] = [];
  let invalid = 0;

  if (!Array.isArray(waypoints)) {
    errors.push(`${context}: Expected array, got ${typeof waypoints}`);
    return { valid: [], invalid: 1, errors };
  }

  waypoints.forEach((wp, index) => {
    if (!isValidWaypoint(wp)) {
      invalid++;
      if (wp === null || wp === undefined) {
        errors.push(`${context}[${index}]: null or undefined`);
      } else if (typeof wp !== 'object') {
        errors.push(`${context}[${index}]: Expected object, got ${typeof wp}`);
      } else {
        const wp_: any = wp;
        if (typeof wp_.lat !== 'number') {
          errors.push(`${context}[${index}]: lat must be number, got ${typeof wp_.lat}`);
        }
        if (typeof wp_.lng !== 'number') {
          errors.push(`${context}[${index}]: lng must be number, got ${typeof wp_.lng}`);
        }
        if (!isValidCoordinate(wp_.lat, wp_.lng)) {
          errors.push(
            `${context}[${index}]: coordinates out of bounds (lat: ${wp_.lat}, lng: ${wp_.lng})`
          );
        }
      }
    } else {
      valid.push(wp);
    }
  });

  return { valid, invalid, errors };
}

/**
 * Type guard for SolverResult
 */
export function isValidSolverResult(value: unknown): value is SolverResult {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const result = value as any;
  return (
    Array.isArray(result.tour) &&
    Array.isArray(result.tourWaypoints) &&
    typeof result.totalDistance === 'number' &&
    typeof result.qubitsSimulated === 'number' &&
    Array.isArray(result.energyHistory) &&
    typeof result.actualOptimizationPercent === 'number'
  );
}

/**
 * Safe coordinate pair type
 */
export interface CoordinatePair {
  lat: number;
  lng: number;
}

/**
 * Extract coordinates from any object safely
 */
export function extractCoordinates(
  value: unknown
): CoordinatePair | null {
  if (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as any).lat === 'number' &&
    typeof (value as any).lng === 'number'
  ) {
    const { lat, lng } = value as any;
    if (isValidCoordinate(lat, lng)) {
      return { lat, lng };
    }
  }
  return null;
}
