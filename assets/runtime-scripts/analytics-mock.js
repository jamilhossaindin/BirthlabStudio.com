'use strict';
// Compatibility hooks only. No analytics collection or network requests.
(() => {
  const queue = [];
  queue.push = () => 0;
  window.__framer_events = queue;
  window.__send_framer_event = () => {};
})();
