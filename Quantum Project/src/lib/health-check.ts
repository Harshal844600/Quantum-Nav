/**
 * Application initialization and health check utilities
 */

import { getInitStatus, verifyServices } from '../lib/init';
import { getAppConfig } from '../lib/config';

/**
 * Check if app is properly initialized
 */
export async function checkAppHealth(): Promise<{
  healthy: boolean;
  issues: string[];
  status: Record<string, unknown>;
}> {
  const issues: string[] = [];

  // Check initialization status
  const initStatus = getInitStatus();
  if (!initStatus.initialized) {
    issues.push('Application not fully initialized');
  }

  // Check services
  const serviceStatus = await verifyServices();
  if (!serviceStatus.all_healthy) {
    Object.entries(serviceStatus.services).forEach(([service, healthy]) => {
      if (!healthy) {
        issues.push(`Service unavailable: ${service}`);
      }
    });
  }

  // Check configuration
  const config = getAppConfig();
  if (!config.api.groqEnabled) {
    issues.push('Groq API not configured - AI features limited');
  }

  return {
    healthy: issues.length === 0,
    issues,
    status: {
      initialized: initStatus.initialized,
      services: serviceStatus.services,
      api: {
        groq: config.api.groqEnabled,
        timeout: config.api.defaultTimeout,
      },
    },
  };
}

/**
 * Get app initialization report
 */
export function getInitReport() {
  const config = getAppConfig();
  return {
    timestamp: new Date().toISOString(),
    app: `${config.appName} v${config.version}`,
    environment: config.environment,
  };
}

/**
 * Log app diagnostic info
 */
export async function logAppDiagnostics() {
  const health = await checkAppHealth();
  const report = getInitReport();
  const config = getAppConfig();

  if (import.meta.env.DEV) {
    console.group('🔍 QuantumNav Diagnostics');
    console.table(report);
    console.log('Service Status:', health.status);
    console.log('Features:', config.features);
    console.log('Routes:', config.routes);
    if (health.issues.length > 0) {
      console.warn('⚠️ Issues:', health.issues);
    } else {
      console.log('✅ All systems operational');
    }
    console.groupEnd();
  }

  return { health, report, config };
}

/**
 * Get detailed app status
 */
export async function getAppStatus() {
  const health = await checkAppHealth();
  const initStatus = getInitStatus();
  const config = getAppConfig();

  return {
    healthy: health.healthy,
    initialized: initStatus.initialized,
    issues: health.issues,
    app: {
      name: config.appName,
      version: config.version,
      environment: config.environment,
    },
    services: health.status.services,
  };
}
