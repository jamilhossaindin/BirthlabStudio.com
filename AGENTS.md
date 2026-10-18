# AGENTS.md — Agent Operating Contract & Repository Guidelines

Welcome to the **BirthLab Studio** repository. This document defines the operating contract, workflow rules, dev server instructions, and coding standards for all AI coding agents working in this codebase.

---

## 1. Primary Directives & Dev Server Guardrails

### ⚠️ Never Run Production Builds During Interactive Sessions
- **Run the local dev server using:**
  ```bash
  npm run dev
  # OR
  npm start
  ```
- **Port:** Listens on `http://localhost:3000`.
- **Do NOT run destructive build commands** during interactive pairing sessions. Maintain the live static server.

---

## 2. Dependency & Package Management

- **Package Manager:** `npm` (Node.js >= 20).
- **Core Dependencies:**
  - `serve`: Static file server with clean routing and custom port support.
- **Overrides:**
  - `compression`: Explicitly pinned to `^1.8.2` to eliminate known GHSA Denial-of-Service vulnerabilities.
- **Rule:** If modifying `package.json`, always run `npm install` and verify `npm audit` produces zero vulnerabilities.

---

## 3. Project Architecture & Code Structure

- **Origin / Source:** Official repository and digital experience for BirthLab Studio (originally designed and published via Framer with React 18, Framer Motion, and Lenis Smooth Scroll runtime).
- **Directory Layout:**
  - `index.html`: Home page entrypoint.
  - `about/index.html`, `work/index.html`, `contact/index.html`, `404/index.html`: Primary narrative routes.
  - `case-studies/`: Centralized folder containing all 17 discrete client case studies (`121g/`, `beyondtellerrand/`, `bigeye/`, `epic-travel/`, `getty-images/`, `justphil/`, `kapilandholly/`, `linkboard/`, `lumaandleaf/`, `birthlab-beer/`, `mixd/`, `plug-digital/`, `slashwork/`, `snapsound/`, `thebodyshop/`, `tvs/`, `x/`).
  - `assets/`: Segment-wise organized directory containing categorized assets (`hero/`, `work-highlights/`, `case-studies/`, `about/`, `404/`, `fonts/`, `runtime-scripts/`, `audio/`, `shared/`) with human-readable naming.
  - `docs/`: Centralized project documentation, architecture analysis, and audit reports.
  - `scripts/`: Developer CLI utilities (e.g. `find-asset.mjs`).
  - `package.json`: Scripts and pinned server runtime.

---

## 4. Coding & Modification Standards

1. **Static Route Integrity:** Every route folder must contain an `index.html` to maintain clean subpath URLs (e.g. `/work` resolving to `work/index.html`).
2. **Asset Pathing:** All asset references must use relative paths (`./assets/...` or `../assets/...`) to support arbitrary local hosting ports or static file hosts.
3. **Accessibility Baseline:** All user-facing modifications must target WCAG 2.2 Level AA conformance as defined in [ACCESSIBILITY.md](file:///h:/Projects/BirthlabStudio.com/ACCESSIBILITY.md).
4. **Security Hardening:** Do not introduce unvetted external scripts, third-party analytics trackers, or unauthenticated iframe embeds.

---

## 5. Verification Checklist

Before completing any change:
1. Verify the server is active on `http://localhost:3000`.
2. Test affected route status codes (`200 OK`).
3. Confirm keyboard focus rings remain visible and accessible.
4. Run `npm audit` to verify zero vulnerabilities.
