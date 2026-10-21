# Security and local startup

Run npm ci and npm start. Open http://localhost:4000. npm run dev uses the same guarded server. The server binds only to 127.0.0.1 by default.

Only when local network access is explicitly requested, set LAN=1 before starting the server. This binds to IPv4 interfaces and permits Host headers for localhost and this computer's current private IPv4 addresses. Other hostnames and private files remain blocked. Scope the inbound firewall allowance to the selected TCP port and the local subnet. This mode does not configure router forwarding or public hosting.

Run npm run security:test and npm audit before a release. After editing inline scripts, run npm run security:headers and restart; this updates the script hashes and Vercel routing/security headers.

The server publishes only known pages and public assets. Repository metadata, environment files, internal scripts, documentation, package files and directory listings are private. Use this entry point instead of an unrestricted static server pointed at the repository root.

**The Git credential previously embedded in this project's remote URL must be revoked or rotated by its owner.** It was removed locally; this does not revoke it in GitHub. Historical audit output is kept outside this portable project.

Verify HTTPS, response headers and private-file blocking on the actual production host before launch. The Vercel configuration contains matching restrictions; other hosts need equivalent settings. Keep Node/dependencies patched and configure hosting-level abuse monitoring.

There is currently no contact submission backend. If one is added, validate on the server, use spam/rate controls, keep mail/API secrets off the browser, and deliberately update form-action/connect-src for the selected endpoint.
