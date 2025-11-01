export function reportVitals(): void {
  if (import.meta.env.DEV) return;
  // Load only in production to avoid skewing dev perf
  // No network reporting to keep it lightweight
  import('web-vitals').then(({ onLCP, onINP, onCLS }) => {
    try {
      onLCP((v) => console.log('[Vitals] LCP', Math.round(v.value)));
      onINP((v) => console.log('[Vitals] INP', Math.round(v.value)));
      onCLS((v) => console.log('[Vitals] CLS', Number(v.value.toFixed(3))));
    } catch {
      // no-op
    }
  }).catch(() => {
    // no-op if web-vitals not available
  });
}
