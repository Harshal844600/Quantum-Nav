# QuantumNav Initialization System

## Overview

The QuantumNav application has a comprehensive initialization system that handles:

- **App startup and configuration**
- **Environment validation**
- **Service health checking**
- **Default data initialization**
- **State persistence management**
- **Diagnostics and logging**

## Architecture

### Core Modules

#### `lib/init.ts`
- **Primary initialization module**
- Handles app startup and configuration loading
- Validates environment variables
- Manages storage and persistence
- Exports: `initializeApp()`, `verifyServices()`, `getInitStatus()`, `resetAppState()`

#### `lib/config.ts`
- **Centralized configuration management**
- Defines app-wide settings and feature flags
- Manages environment-based configuration
- Exports: `getAppConfig()`, `updateAppConfig()`, `createDefaultConfig()`

#### `lib/health-check.ts`
- **Application health and diagnostics**
- Verifies all systems are operational
- Generates diagnostic reports
- Exports: `checkAppHealth()`, `logAppDiagnostics()`, `getAppStatus()`

#### `hooks/useAppInit.ts`
- **React hook for initialization**
- Runs on app mount (once per session)
- Calls initialization sequence
- Logs diagnostics information

### App Integration

The initialization is integrated into `App.tsx`:

```tsx
function AppContent() {
  // Initialize app on startup
  useAppInit();
  // ... rest of app
}
```

## Initialization Flow

1. **App Mounts** → `useAppInit()` hook runs
2. **Check Status** → `getInitStatus()` verifies if already initialized
3. **Verify Services** → `verifyServices()` checks DOM, localStorage, sessionStorage
4. **Initialize** → `initializeApp()` sets up app state and config
5. **Validate Environment** → Checks for required env variables
6. **Log Diagnostics** → `logAppDiagnostics()` outputs full status
7. **Ready** → App is fully initialized and operational

## Default Configuration

The app initializes with sensible defaults:

```typescript
{
  appName: 'QuantumNav',
  version: '1.0.0',
  environment: 'development' | 'production',
  
  features: {
    aiAnalysis: true,
    trafficPrediction: true,
    persistenceEnabled: true,
    analyticsEnabled: false,
  },
  
  api: {
    groqEnabled: !!VITE_GROQ_API_KEY,
    defaultTimeout: 30000,
    retryAttempts: 3,
  },
  
  optimization: {
    maxWaypoints: 10,
    defaultMode: 'quantum',
    quantumSteps: 8000,
  }
}
```

## Environment Variables

The app checks for:

- **VITE_GROQ_API_KEY** - Groq AI API key for enhanced features
  - Optional (graceful fallback if missing)
  - Warning issued if not configured

## Service Verification

The app verifies these services on startup:

- **DOM** - Document Object Model availability
- **localStorage** - Browser local storage for persistence
- **sessionStorage** - Session storage for temporary state

## Usage Examples

### Get Current Configuration

```typescript
import { getAppConfig } from './lib/config';

const config = getAppConfig();
console.log(config.appName); // 'QuantumNav'
console.log(config.features.aiAnalysis); // true
```

### Check App Health

```typescript
import { checkAppHealth } from './lib/health-check';

const health = await checkAppHealth();
console.log(health.healthy); // boolean
console.log(health.issues); // string[]
```

### Initialize App Manually

```typescript
import { initializeApp } from './lib/init';

await initializeApp({
  resetOnLoad: false,
  loadDefaultWaypoints: true,
  enableLocalStorage: true,
});
```

### Log Diagnostics

```typescript
import { logAppDiagnostics } from './lib/health-check';

await logAppDiagnostics();
// Outputs comprehensive diagnostics to console
```

## Storage Management

### SessionStorage
- `app_init_timestamp` - When app was initialized
- Cleared on browser/tab close
- Stores temporary session data

### LocalStorage
- `app_config_version` - Current config version
- Persists across sessions
- Managed by Zustand store for app state

## Default Waypoints

If no waypoints are saved, the app uses default Mumbai locations:

1. **Gateway of India** - 18.922°N, 72.8347°E
2. **Sea Link** - 19.033°N, 72.8197°E
3. **CST Station** - 18.9398°N, 72.8354°E
4. **Juhu Beach** - 19.0988°N, 72.8264°E
5. **Powai Lake** - 19.1073°N, 72.9087°E

## Troubleshooting

### App Not Initializing

Check the console logs in browser DevTools:

```
[Init] QuantumNav application initialized
[Init Hook] App initialization complete
🔍 QuantumNav Diagnostics
```

### Missing API Key Warning

```
[Init] Environment warnings: ["VITE_GROQ_API_KEY not configured - AI features may be limited"]
```

**Solution:** Add to `.env` file:
```
VITE_GROQ_API_KEY=your_key_here
```

### Storage Unavailable

```
[Init] Could not write to storage
```

**Cause:** localStorage/sessionStorage not available
**Solution:** Check browser privacy settings or incognito mode restrictions

### Service Health Issues

```
⚠️ Issues: ["Service unavailable: localStorage"]
```

Check available services via:
```typescript
const health = await checkAppHealth();
console.log(health.status.services);
```

## Performance Notes

- Initialization takes ~10-50ms typically
- All initialization is async-safe
- No blocking operations during init
- HMR (hot module reload) compatible
- Prevents multiple initialization attempts

## Browser Compatibility

Requires:
- ES2020+ (for standard APIs used)
- localStorage/sessionStorage support
- sessionStorage support
- Promise/async-await support

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Future Enhancements

Potential additions:
- Data migration utilities
- Configuration versioning
- Telemetry and analytics
- Advanced error recovery
- Service worker integration
