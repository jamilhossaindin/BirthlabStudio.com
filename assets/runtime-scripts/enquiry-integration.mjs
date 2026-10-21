/**
 * Delivery is deliberately unconfigured: this handover has no enquiry backend.
 * Replace null with an async function (details) that sends to your real form
 * integration. Resolve with { ok: true } only after confirmed delivery, and
 * throw (or return { ok: false }) on failure. Do not put private keys here.
 * details contains name, email, phone (optional), and service.
 * Keep the server's CSP restricted to the integration you actually configure.
 */
export const submitEnquiry = null;
