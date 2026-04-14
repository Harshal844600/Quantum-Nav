/**
 * Application Initialization Module
 * Handles startup setup, default data, and app state initialization
 */

import type { Waypoint } from './quantumSolver';
import { getAppConfig, logAppConfig } from './config';

export interface InitConfig {
  resetOnLoad?: boolean;
  loadDefaultWaypoints?: boolean;
  enableLocalStorage?: boolean;
}

/**
 * Default waypoints for Mumbai (used if no saved waypoints exist)
 */
export const DEFAULT_WAYPOINTS: Waypoint[] = [
  {
    id: '1',
    lat: 18.922,
    lng: 72.8347,
    label: 'Gateway of India',
  },
  {
    id: '2',
    lat: 19.033,
    lng: 72.8197,
    label: 'Sea Link',
  },
  {
    id: '3',
    lat: 18.9398,
    lng: 72.8354,
    label: 'CST Station',
  },
  {
    id: '4',
    lat: 19.0988,
    lng: 72.8264,
    label: 'Juhu Beach',
  },
  {
    id: '5',
    lat: 19.1073,
    lng: 72.9087,
    label: 'Powai Lake',
  },
];

/**
 * Validate the application environment
 */
export function validateEnvironment(): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Check for required environment variables
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    warnings.push('VITE_GROQ_API_KEY not configured - AI features may be limited');
  }

  // Check for localStorage availability
  if (typeof window !== 'undefined') {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
    } catch {
      warnings.push('localStorage not available - persistence may not work');
    }
  }

  return {
    valid: warnings.length < 2,
    warnings,
  };
}

/**
 * Initialize application on startup
 */
export async function initializeApp(config: InitConfig = {}): Promise<void> {
  const {
    resetOnLoad = false,
    loadDefaultWaypoints = true,
    enableLocalStorage = true,
  } = config;

  const startTime = performance.now();

  // Validate environment
  const envCheck = validateEnvironment();
  if (envCheck.warnings.length > 0 && import.meta.env.DEV) {
    console.warn('[Init] Environment warnings:', envCheck.warnings);
  }

  // Get app configuration
  const appConfig = getAppConfig();
  logAppConfig();

  // Set up localStorage if available
  if (enableLocalStorage && typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('app_init_timestamp', Date.now().toString());
      localStorage.setItem('app_config_version', appConfig.version);
    } catch {
      if (import.meta.env.DEV) {
        console.warn('[Init] Could not write to storage');
      }
    }
  }

  // Reset state if requested
  if (resetOnLoad) {
    resetAppState();
  }

  const duration = performance.now() - startTime;

  // Log initialization
  if (import.meta.env.DEV) {
    console.log('[Init] QuantumNav application initialized', {
      timestamp: new Date().toISOString(),
      duration: `${duration.toFixed(2)}ms`,
      config: {
        resetOnLoad,
        loadDefaultWaypoints,
        enableLocalStorage,
      },
      environment: {
        valid: envCheck.valid,
        warnings: envCheck.warnings,
      },
    });
  }
}

/**
 * Verify all required services are accessible
 */
export async function verifyServices(): Promise<{
  all_healthy: boolean;
  services: Record<string, boolean>;
}> {
  const services: Record<string, boolean> = {
    dom: typeof document !== 'undefined',
    localStorage: canAccessLocalStorage(),
    sessionStorage: canAccessSessionStorage(),
  };

  return {
    all_healthy: Object.values(services).every((v) => v),
    services,
  };
}

function canAccessLocalStorage(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function canAccessSessionStorage(): boolean {
  try {
    const test = '__test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get initialization status
 */
export function getInitStatus(): {
  initialized: boolean;
  timestamp: string | null;
} {
  if (typeof window === 'undefined') {
    return { initialized: false, timestamp: null };
  }

  try {
    const timestamp = sessionStorage.getItem('app_init_timestamp');
    return {
      initialized: timestamp !== null,
      timestamp,
    };
  } catch {
    return { initialized: false, timestamp: null };
  }
}

/**
 * Reset application state
 */
export function resetAppState(): void {
  if (typeof window === 'undefined') return;

  try {
    // Clear session-based data
    sessionStorage.clear();
    if (import.meta.env.DEV) {
      console.log('[Init] Application state reset');
    }
  } catch {
    if (import.meta.env.DEV) {
      console.warn('[Init] Could not clear session storage');
    }
  }
}
