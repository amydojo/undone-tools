/* Lightweight event adapter. No provider or network destination is configured by default. */
(function initUndoneAnalytics(root) {
  'use strict';

  const subscribers = new Set();

  function register(subscriber) {
    if (typeof subscriber !== 'function') return function noop() {};
    subscribers.add(subscriber);
    return function unregister() {
      subscribers.delete(subscriber);
    };
  }

  function track(eventName, payload) {
    const event = Object.freeze({
      event: eventName,
      occurredAt: new Date().toISOString(),
      ...(payload || {}),
    });

    subscribers.forEach((subscriber) => {
      try {
        subscriber(event);
      } catch (error) {
        if (root.UNDONE_ANALYTICS_DEBUG === true) {
          console.warn('[Undone analytics adapter]', error);
        }
      }
    });

    root.dispatchEvent(new CustomEvent('undone:analytics', { detail: event }));

    if (root.UNDONE_ANALYTICS_DEBUG === true) {
      console.info('[Undone analytics event]', event);
    }

    return event;
  }

  root.UndoneAnalytics = Object.freeze({ register, track });
})(window);
