# Error Handling & Validation Guide

This document outlines the error handling and validation patterns used in the QuantumNav project to ensure robust, type-safe operation across the codebase.

## Overview

The project uses a multi-layered approach to error handling:

1. **Validation Layer** (`src/lib/validation.ts`) - Type guards and validators
2. **Error Handling Layer** (`src/lib/errorHandling.ts`) - Logging and recovery
3. **Component Layer** - Error boundaries and graceful degradation
4. **API Layer** - Request validation and response handling

## Common Issues & Solutions

### Issue: Undefined Waypoints

**Problem**: Waypoint arrays frequently contain `undefined` or `null` elements, causing runtime errors when accessing `.lat` or `.lng`.

**Solution**: Always filter waypoints before use.

```typescript
// ❌ WRONG - Will crash if waypoint is undefined
waypoints.map(wp => wp.lat)

// ✅ RIGHT - Use validation utility
import { filterValidWaypoints } from '../lib/validation';
const valid = filterValidWaypoints(waypoints);
valid.map(wp => wp.lat) // Safe - TypeScript knows wp is valid
```

### Issue: Invalid Coordinates

**Problem**: Coordinates outside geographic bounds (-90 to 90 for lat, -180 to 180 for lng).

**Solution**: Always validate coordinates.

```typescript
// ❌ WRONG
const { lat, lng } = userInput;
calculateDistance(lat, lng);

// ✅ RIGHT
import { isValidCoordinate } from '../lib/validation';
if (isValidCoordinate(lat, lng)) {
  calculateDistance(lat, lng);
}
```

### Issue: Array Index Out of Bounds

**Problem**: Accessing waypoint by index without bounds checking.

**Solution**: Use safe accessor.

```typescript
// ❌ WRONG
const wp = waypoints[i];
const lat = wp.lat; // Crashes if index out of bounds

// ✅ RIGHT
import { getSafeWaypoint } from '../lib/validation';
const wp = getSafeWaypoint(waypoints, i);
if (wp) {
  const lat = wp.lat;
}
```

## Validation Module (`src/lib/validation.ts`)

### Type Guards

```typescript
// Check if value is a valid Waypoint
import { isValidWaypoint } from '../lib/validation';
if (isValidWaypoint(value)) {
  // value is guaranteed to be Waypoint type
  console.log(value.lat, value.lng);
}

// Check if object has valid coordinates
import { hasValidCoordinates } from '../lib/validation';
if (hasValidCoordinates(someObject)) {
  Draw.point(someObject.lat, someObject.lng);
}
```

### Array Filtering

```typescript
import { filterValidWaypoints } from '../lib/validation';

// Automatically removes undefined/null/invalid waypoints
const validWaypoints = filterValidWaypoints(rawWaypoints);
// Type: Waypoint[] (guaranteed all valid)
```

### Coordinate Validation

```typescript
import { isValidCoordinate } from '../lib/validation';

const isValid = isValidCoordinate(19.0760, 72.8777); // true
const invalid = isValidCoordinate(91, 181); // false (out of bounds)
```

### Safe Extraction

```typescript
import { extractCoordinates } from '../lib/validation';

const coords = extractCoordinates(userInput);
if (coords) {
  // coords: { lat: number, lng: number }
  map.flyTo([coords.lat, coords.lng]);
} else {
  // Input was invalid, use default
  map.flyTo([19.0760, 72.8777]);
}
```

### Batch Validation with Reporting

```typescript
import { validateWaypoints } from '../lib/validation';

const { valid, invalid, errors } = validateWaypoints(sourceData);

if (invalid > 0) {
  console.warn(`Invalid waypoints: ${invalid}`);
  console.error(errors);
}

// Use valid waypoints
solveQuantum(valid);
```

## Error Handling Module (`src/lib/errorHandling.ts`)

### Safe Async Operations

```typescript
import { safeAsync, tryAsync } from '../lib/errorHandling';

// Auto-recovery pattern
const result = await safeAsync(
  () => fetchData(),
  { default: 'No data' }, // Fallback value
  { component: 'DataLoader', operation: 'fetch' }
);

// Try-catch pattern (more control)
const [data, error] = await tryAsync(
  () => fetchData(),
  'Failed to fetch data',
  'warn'
);
if (error) {
  // Handle error
}
```

### Safe Sync Operations

```typescript
import { safeSync } from '../lib/errorHandling';

const value = safeSync(
  () => dangerousOperation(),
  0, // Fallback
  { component: 'Calculator' }
);
```

### Safe Property Access

```typescript
import { safeGet } from '../lib/errorHandling';

// Deep access without errors
const lat = safeGet(userData, 'location.coords.lat', 0);
const lng = safeGet(userData, 'location.coords.lng', 0);
```

### Required Fields

```typescript
import { ensureExists, ensureNonEmptyArray } from '../lib/errorHandling';

// Throws if null/undefined
const config = ensureExists(getConfig(), 'config');
const waypoints = ensureNonEmptyArray(getWaypoints(), 'waypoints');
```

### Error Recovery

```typescript
import { withErrorRecovery } from '../lib/errorHandling';

const distance = withErrorRecovery(
  () => calculateDistance(wp1, wp2),
  0, // Return 0 on error
  { operation: 'distance-calc' }
);

// Or with function recovery
const distance = withErrorRecovery(
  () => calculateDistance(wp1, wp2),
  () => estimateApproximateDistance(wp1, wp2), // Alternative calculation
  { operation: 'distance-calc' }
);
```

## Component Error Handling

### Error Boundaries

Use the `ErrorBoundary` component to wrap sections that might throw:

```typescript
import ErrorBoundary from '../components/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <PlannerPage />
    </ErrorBoundary>
  );
}
```

### Conditional Rendering

```typescript
import { filterValidWaypoints } from '../lib/validation';

function WaypointList({ waypoints }: Props) {
  const valid = filterValidWaypoints(waypoints);

  if (valid.length === 0) {
    return <div>No valid waypoints</div>;
  }

  return valid.map(wp => <WaypointCard key={wp.id} waypoint={wp} />);
}
```

## Logging Patterns

### Development vs Production

```typescript
import { logError } from '../lib/errorHandling';

// Detailed logs in dev only
if (import.meta.env.DEV) {
  console.log('Processing waypoints:', waypoints);
}

// Errors always logged (but details hidden in prod)
logError(error, 'error', {
  component: 'RouteOptimizer',
  operation: 'solve',
  data: { waypointCount: waypoints.length }
});
```

### Severity Levels

```typescript
logError(new Error('Info'), 'debug'); // Dev only
logError(new Error('Info'), 'info');  // Informational
logError(new Error('Warning'), 'warn'); // Potential issue
logError(new Error('Critical'), 'error'); // Error occurred
logError(new Error('Down'), 'critical'); // Service down
```

## Common Patterns

### Pattern 1: Array Processing with Error Tolerance

```typescript
import { filterValidWaypoints, validateWaypoints } from '../lib/validation';

function processWaypoints(data: unknown[]) {
  const { valid, invalid, errors } = validateWaypoints(data, 'user-input');

  if (invalid > 0) {
    logWarning(`Filtered ${invalid} invalid waypoints. Errors: ${errors.join(', ')}`);
  }

  return valid; // Safe to use
}
```

### Pattern 2: API Response Validation

```typescript
import { isValidSolverResult } from '../lib/validation';
import { logError } from '../lib/errorHandling';

async function getSolverResult() {
  const data = await fetch('/api/solve').then(r => r.json());

  if (!isValidSolverResult(data)) {
    logError(
      'Invalid solver response',
      'error',
      { operation: 'getSolverResult' }
    );
    return null; // Use default/retry
  }

  return data; // Type-safe: SolverResult
}
```

### Pattern 3: Coordinate Operations

```typescript
import { isValidCoordinate, hasValidCoordinates } from '../lib/validation';

function drawRoute(waypoints: unknown[]) {
  waypoints.forEach((wp) => {
    if (hasValidCoordinates(wp)) {
      map.addMarker([wp.lat, wp.lng]);
    } else {
      logWarning(`Skipping invalid waypoint: ${JSON.stringify(wp)}`);
    }
  });
}
```

## Best Practices

### ✅ DO

- Filter waypoints at component entry points
- Validate coordinates immediately after user input
- Use type guards for runtime validation
- Log errors with context for debugging
- Provide fallback values
- Check array bounds before access
- Validate API responses

### ❌ DON'T

- Access waypoint properties without null checks
- Assume coordinates are valid
- Mix validated and unvalidated data
- Throw errors in rendering code
- Log sensitive user data
- Use bare `try-catch` without recovery
- Trust external data without validation

## Testing Error Cases

```typescript
import { describe, it, expect } from 'vitest';
import { filterValidWaypoints, isValidCoordinate } from '../lib/validation';

describe('validation', () => {
  it('should filter invalid waypoints', () => {
    const mixed = [
      { lat: 19, lng: 72, label: 'A', id: '1' },
      null,
      { lat: 91, lng: 181, label: 'B', id: '2' }, // Invalid
      undefined,
    ];

    const result = filterValidWaypoints(mixed);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('A');
  });

  it('should validate coordinates', () => {
    expect(isValidCoordinate(0, 0)).toBe(true);
    expect(isValidCoordinate(90, 180)).toBe(true);
    expect(isValidCoordinate(91, 0)).toBe(false);
    expect(isValidCoordinate('19', '72')).toBe(false);
  });
});
```

## Integration with Existing Code

### RouteGraphVisualization Example (Updated)

```typescript
import { filterValidWaypoints } from '../lib/validation';

export default function RouteGraphVisualization({ waypoints }: Props) {
  // Filter at component entry
  const validWaypoints = useMemo(() => 
    filterValidWaypoints(waypoints),
    [waypoints]
  );

  // Work with valid data
  const initialDistance = useMemo(() =>
    calculateInitialDistance(validWaypoints),
    [validWaypoints]
  );

  // Safe to access - type guaranteed
  return (
    <svg>
      {validWaypoints.map((wp, i) => (
        <circle key={wp.id} cx={wp.lat} cy={wp.lng} />
      ))}
    </svg>
  );
}
```

## Summary

The error handling strategy provides:

1. **Type Safety**: Type guards ensure compile-time safety
2. **Runtime Validation**: Validators catch issues at runtime
3. **Graceful Degradation**: Fallbacks prevent crashes
4. **Debugging Support**: Structured logging aids troubleshooting
5. **Consistency**: Standardized patterns across codebase

Use these utilities liberally - defensive programming prevents production issues!
