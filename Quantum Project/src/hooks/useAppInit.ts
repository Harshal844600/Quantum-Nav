/**
 * useAppInit Hook
 * Initializes the application on startup
 */

import { useEffect, useRef } from 'react';
import { initializeApp, verifyServices, getInitStatus } from '../lib/init';
import { logAppDiagnostics } from '../lib/health-check';

export function useAppInit() {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Check if already initialized
    const status = getInitStatus();
    if (status.initialized) {
      if (import.meta.env.DEV) {
        console.log('[Init Hook] App already initialized at:', status.timestamp);
      }
      return;
    }

    // Initialize app
    (async () => {
      try {
        // Verify all services are available
        const serviceStatus = await verifyServices();
        if (!serviceStatus.all_healthy && import.meta.env.DEV) {
          console.warn('[Init Hook] Some services unavailable:', serviceStatus.services);
        }

        // Initialize app
        await initializeApp({
          resetOnLoad: false,
          loadDefaultWaypoints: true,
          enableLocalStorage: true,
        });

        // Log diagnostics
        await logAppDiagnostics();

        if (import.meta.env.DEV) {
          console.log('[Init Hook] App initialization complete');
        }
      } catch (error) {
        console.error('[Init Hook] Initialization failed:', error);
      }
    })();
  }, []);
}
