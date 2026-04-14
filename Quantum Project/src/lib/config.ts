/**
 * Application Configuration
 * Centralized config for app settings
 */

export interface AppConfig {
  // App meta
  appName: string;
  version: string;
  environment: 'development' | 'production';

  // Feature flags
  features: {
    aiAnalysis: boolean;
    trafficPrediction: boolean;
    persistenceEnabled: boolean;
    analyticsEnabled: boolean;
  };

  // API Configuration
  api: {
    groqEnabled: boolean;
    defaultTimeout: number; // ms
    retryAttempts: number;
  };

  // UI Configuration
  ui: {
    theme: 'dark' | 'light';
    animationsEnabled: boolean;
    defaultMapCenter: { lat: number; lng: number };
    defaultMapZoom: number;
  };

  // Routes
  routes: {
    landing: string;
    planner: string;
    visualizer: string;
    traffic: string;
  };

  // Optimization
  optimization: {
    maxWaypoints: number;
    defaultMode: 'classic' | 'quantum';
    quantumSteps: number;
  };
}

/**
 * Create default app configuration
 */
export function createDefaultConfig(): AppConfig {
  return {
    appName: 'QuantumNav',
    version: '1.0.0',
    environment: import.meta.env.MODE as 'development' | 'production',

    features: {
      aiAnalysis: true,
      trafficPrediction: true,
      persistenceEnabled: true,
      analyticsEnabled: false,
    },

    api: {
      groqEnabled: !!import.meta.env.VITE_GROQ_API_KEY,
      defaultTimeout: 30000,
      retryAttempts: 3,
    },

    ui: {
      theme: 'dark',
      animationsEnabled: true,
      defaultMapCenter: { lat: 19.0760, lng: 72.8777 }, // Mumbai center
      defaultMapZoom: 12,
    },

    routes: {
      landing: '/',
      planner: '/planner',
      visualizer: '/visualizer',
      traffic: '/traffic',
    },

    optimization: {
      maxWaypoints: 10,
      defaultMode: 'quantum',
      quantumSteps: 8000,
    },
  };
}

/**
 * Get current app configuration
 */
let appConfig: AppConfig | null = null;

export function getAppConfig(): AppConfig {
  if (!appConfig) {
    appConfig = createDefaultConfig();
  }
  return appConfig;
}

/**
 * Update app configuration
 */
export function updateAppConfig(updates: Partial<AppConfig>): AppConfig {
  appConfig = { ...getAppConfig(), ...updates };
  return appConfig;
}

/**
 * Reset configuration to defaults
 */
export function resetAppConfig(): AppConfig {
  appConfig = createDefaultConfig();
  return appConfig;
}

/**
 * Log configuration info
 */
export function logAppConfig() {
  const config = getAppConfig();
  if (import.meta.env.DEV) {
    console.group('⚙️ QuantumNav Configuration');
    console.log(`App: ${config.appName} v${config.version}`);
    console.log(`Environment: ${config.environment}`);
    console.log('Features:', config.features);
    console.log('API:', config.api);
    console.log('Routes:', config.routes);
    console.log('Optimization:', config.optimization);
    console.groupEnd();
  }
}
