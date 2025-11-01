type IdleCallbackHandle = number;

type IdleCallbackDeadline = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

export function runWhenIdle(callback: (deadline: IdleCallbackDeadline) => void, timeout = 3000): IdleCallbackHandle {
  if (typeof (window as any).requestIdleCallback === 'function') {
    return (window as any).requestIdleCallback(callback, { timeout }) as IdleCallbackHandle;
  }
  const start = Date.now();
  return window.setTimeout(() => {
    callback({
      didTimeout: Date.now() - start >= timeout,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
    });
  }, 1) as unknown as IdleCallbackHandle;
}

export function cancelWhenIdle(handle: IdleCallbackHandle): void {
  if (typeof (window as any).cancelIdleCallback === 'function') {
    (window as any).cancelIdleCallback(handle);
    return;
  }
  clearTimeout(handle);
}
