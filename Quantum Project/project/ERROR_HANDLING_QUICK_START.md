# Error Handling Quick Reference

## Problem from Recent Debugging

The `RouteGraphVisualization` component crashed with:
```
Cannot read properties of undefined (reading 'lng')
```

This happened because waypoint arrays could contain `undefined` or `null` elements.

## Solution

Three new utility modules provide structured error handling:

### 1. **Validation Module** (`src/lib/validation.ts`)
Prevents errors by validating data before use:

```typescript
import { filterValidWaypoints, isValidWaypoint, isValidCoordinate } from '../lib/validation';

// Filter out invalid waypoints automatically
const valid = filterValidWaypoints(waypoints);
valid.map(wp => wp.lat); // ✅ Safe - TypeScript knows all are valid

// Check individual coordinates
if (isValidCoordinate(userLat, userLng)) {
  map.flyTo([userLat, userLng]);
}

// Type-safe waypoint checking
if (isValidWaypoint(someData)) {
  renderWaypoint(someData); // Type: Waypoint
}
```

### 2. **Error Handling Module** (`src/lib/errorHandling.ts`)
Handles errors gracefully with recovery:

```typescript
import { logError, safeAsync, withErrorRecovery } from '../lib/errorHandling';

// Safe async operations with fallback
const result = await safeAsync(
  () => fetchWaypoints(),
  [], // Fallback value
  { component: 'WaypointLoader' }
);

// Try-catch with automatic logging
const [data, error] = await tryAsync(() => solveRoute());

// Error recovery with alternatives
const distance = withErrorRecovery(
  () => calculateExactDistance(wp1, wp2),
  () => approximateDistance(wp1, wp2), // Fallback function
  { operation: 'distance-calc' }
);

// Structured error logging
logError(error, 'warn', {
  component: 'PlannerPage',
  operation: 'optimize',
  data: { waypointCount: 5 }
});
```

### 3. **Documentation** (`ERROR_HANDLING.md`)
Comprehensive guide covering patterns, best practices, and examples.

## Key Patterns

### Pattern 1: Safe Array Processing
```typescript
import { filterValidWaypoints } from '../lib/validation';

// At component entry point
const validWaypoints = filterValidWaypoints(props.waypoints);

// Use validated data throughout
const distance = calculateDistance(validWaypoints); // Type-safe
```

### Pattern 2: Coordinate Operations
```typescript
import { isValidCoordinate, extractCoordinates } from '../lib/validation';

const coords = extractCoordinates(userInput);
if (coords) {
  map.addMarker([coords.lat, coords.lng]);
}
```

### Pattern 3: Safe Algorithm Input
```typescript
// In quantumSolver.ts - Now uses validation internally
export function solveQuantum(waypoints: Waypoint[]) {
  const validWaypoints = filterValidWaypoints(waypoints); // ✅ Already done
  // All subsequent operations guaranteed safe
}
```

## Error Logging

**Development**: Full output including stack traces
```
[ERROR] solveQuantum received no valid waypoints
{
  component: 'quantumSolver',
  operation: 'solveQuantum',
  data: { count: 0 }
}
```

**Production**: Minimal output, no stack traces
```
[error] solveQuantum received no valid waypoints
```

## Integration Status

✅ **quantumSolver.ts** - Input validation added  
✅ **RouteGraphVisualization.tsx** - Type-safe filtering in place  
✅ **WaypointInput.tsx** - Validation utilities available  
✅ **PlannerPage.tsx** - Partial validation in place  

## Where to Apply

Look for patterns like:
```typescript
// ❌ Pattern: Unsafe array access
waypoints.map(wp => wp.lat)

// ✅ Fix: Use validation
filterValidWaypoints(waypoints).map(wp => wp.lat)
```

## Testing

The error handling handles these cases:
- ✅ Undefined/null waypoints
- ✅ Out-of-bounds coordinates  
- ✅ Invalid data types
- ✅ Missing required fields
- ✅ API response validation
- ✅ Async operation failures

## Best Practice

Always filter/validate at component boundaries:
```typescript
// Component receives mixed data
function MyComponent({ data }) {
  // Validate immediately
  const valid = filterValidWaypoints(data);
  
  // Use validated data throughout
  return <div>{valid.map(...)}</div>;
}
```

This catches errors early and prevents undefined propagation downstream.
