/**
 * Logger utility for development and production environments
 * Logs are only output in development mode
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
  group: (label: string) => {
    if (isDev) console.group(label);
  },
  groupEnd: () => {
    if (isDev) console.groupEnd();
  },
  table: (data: unknown) => {
    if (isDev) console.table(data);
  },
};

/**
 * Performance monitoring utility
 */
export const perf = {
  mark: (label: string) => {
    if (isDev) performance.mark(label);
  },
  measure: (name: string, startMark: string, endMark: string) => {
    if (isDev) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        if (measure) {
          logger.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
        }
      } catch (error) {
        logger.error(`Failed to measure performance: ${name}`, error);
      }
    }
  },
};
