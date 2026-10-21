# BirthLab Studio

To run with Codex, give it the extracted folder location and your preferred port, for example:

    Run this project on localhost:2000.

AGENTS.md instructs Codex to handle dependency installation, start the existing server on the requested port, and verify the URL. No manual npm commands are needed from the user. If no port is requested, the default is http://localhost:4000.

The server binds to 127.0.0.1 by default and publishes only website routes and public assets. npm run dev uses the same guarded entry point.

For access from other devices on the same local network, explicitly enable LAN mode. In PowerShell, run `$env:LAN='1'; $env:PORT='3000'; npm start`. The server also prints this computer's local network URLs. Allow inbound TCP on the selected port from the local subnet in Windows Firewall. Remove the LAN environment variable to return to localhost-only serving.

Before a release, run npm run security:test and npm audit. Run npm run security:headers after editing inline scripts, then restart.

Read SECURITY.md for local serving and production checks, and THIRD_PARTY_NOTICES.md for third-party provenance and licensing records.

Project names, primary routes and concept descriptions are maintained in scripts/portfolio-projects.json. Previous public URLs are retained only in scripts/route-aliases.json for compatibility. Update both HTML and browser modules when changing content; the supplied text and asset tools synchronize these files.

Keep backups, screenshots and audit output outside this project. The ZIP excludes node_modules; Codex installs the locked dependencies on the destination computer as part of startup.

## Project enquiries

The existing Start a Project links open the shared React enquiry dialog without leaving the page. Its styles and behavior live in assets/runtime-scripts/component-enquiry.css and component-enquiry.mjs. The service menu floats 8px above its selector and keeps the desktop card 840px wide, growing from 680px to fit delivery status text. Field validation appears inside the controls in place of placeholders, with entered values preserved and no messages below the fields. Shorter desktop viewports use compact spacing to keep the form visible. Its 176px panel contains a separately scrolling 160px viewport with four 40px options visible at a time. Keyboard navigation scrolls only that list; fields and the submit button stay in place. The native modal dialog makes the background inert and supports focus management and scroll restoration.

Enquiry delivery is not connected. The form validates Name, Email and Service, keeps Phone optional, and clearly reports that delivery is unavailable instead of claiming success. To enable delivery, replace the null export in assets/runtime-scripts/enquiry-integration.mjs with an async adapter to the actual business integration. The adapter receives name, email, phone and service, must return { ok: true } only after confirmed delivery, and must throw or return { ok: false } on failure. Pending, success and error states and duplicate-submission prevention are already handled. Keep secrets on the server and update the CSP in scripts/security-policy.mjs for the selected integration, then refresh security headers and restart the local server. No endpoint has been invented or added to this static handover.

## Responsive startup

The initial header in every public HTML page uses scripts/navigation-fallback.html, captured from the canonical Home navigation at each breakpoint. Run npm run sync:startup after changing that snapshot. sync:studio-pages retains it automatically. site-startup.js keeps this header visible until the live navigation finishes entering; the application mounts once because the exported desktop HTML does not contain matching phone markup.
