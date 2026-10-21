# BirthLab Studio project instructions

## Run locally when requested

When the user gives this folder location and asks to run the website on localhost, do the setup and start the server for them. Do not stop at giving terminal commands or asking the user to run npm manually.

1. Work from this directory. Read package.json and use the existing guarded server; do not replace it with a generic static server.
2. Use the port explicitly requested by the user. If no port is specified, use 4000. The existing server supports TCP ports 1-65535 through the PORT environment variable.
3. Check that Node.js and npm are available. If Node.js is missing, handle installation using a supported local method where permitted; report any unavoidable operating-system approval or prerequisite.
4. If dependencies are missing, run `npm ci` yourself in this directory. The portable ZIP intentionally excludes node_modules.
5. Set PORT for the server process and run `npm start`, keeping the process running. For example, in PowerShell: `$env:PORT='2000'; npm start`. On a POSIX shell: `PORT=2000 npm start`. Do not change the application's source files just to select a port.
6. Keep the binding at 127.0.0.1. Do not expose the site to the network or deploy it publicly unless explicitly requested.
7. Verify HTTP 200 at `http://localhost:<requested-port>/` and report the clickable URL. Do not claim it is live before verification.
8. If the port is occupied by this project's running server, verify and reuse it. Do not kill an unrelated process or silently choose a different port.

Starting the website does not authorize changes to its content, design, animation, routes or configuration.

## Preserve the handover

- Save requested edits directly in this main project folder.
- Keep backups, duplicate projects, screenshots, temporary scripts and audit output outside this folder.
- Preserve the existing design, CSS identifiers, responsive behavior, animations, interactions and security boundary.
- Update static HTML and corresponding compiled browser modules together when editing shared content. Refresh security headers after changing inline scripts.
- Retain required third-party notices and accurate provenance. See THIRD_PARTY_NOTICES.md.
