# FLYZONE — SUNO GITHUB WRAPPER AUDIT REPORT

**Document Version:** 1.0.0  
**Date:** August 16, 2026  
**Auditor:** AntiGravity Agent / FlyZone Architecture Team  

---

## Executive Summary

Before installing any third-party Suno integration into the **FlyZone** production environment, we conducted a technical, security, and licensing audit of the leading open-source GitHub repositories providing Suno wrappers. 

Because Suno Inc. does not currently offer an official public self-serve developer API, all available GitHub solutions operate as **unofficial wrappers around internal/web services** (`studio-api.suno.ai`, `studio-api.prod.suno.com`, or Clerk auth endpoints).

This report evaluates candidate repositories, inspects authentication and credential handling, assesses licensing, and defines the isolated backend bridge architecture (`SunoPersonalProvider`) for FlyZone.

---

## Candidate Audits

### Candidate A — `gcui-art/suno-api`

* **Repository:** [https://github.com/gcui-art/suno-api](https://github.com/gcui-art/suno-api)
* **Stack / Architecture:** TypeScript / Node.js / Next.js API Routes (Vercel-ready REST server).
* **Recent Activity & Community:** Highly active, frequently updated to align with Suno web UI changes.
* **Authentication Method:** Session Cookie + Clerk JWT Exchange (`clerk.suno.com` -> `studio-api.suno.ai`). Requires passing `COOKIE` token via environment variables or headers.
* **Exposed Endpoints & Capabilities:**
  * `POST /api/generate` (Standard & Custom prompt generation)
  * `POST /api/custom_generate` (Custom lyrics, title, tags)
  * `GET /api/get_limit` (Credit/quota tracking)
  * `GET /api/get` (Polling task status and clip audio URLs)
  * `POST /api/extend_audio` (Track continuation)
  * `POST /api/generate_lyrics` (AI lyrics drafting)
* **Security Inspection:**
  * **Secrets Storage:** Requires user session cookie.
  * **Data Transmission:** Transmits directly to official Suno/Clerk endpoints (`clerk.suno.com`, `studio-api.suno.ai`). No third-party telemetry or credential logging detected in core source.
  * **Client Risk:** Must NEVER be exposed to client-side JS or static GitHub Pages bundles. Must run strictly behind a private/local backend proxy.
* **License:** `LGPL-3.0` (GNU Lesser General Public License v3.0).
  * **Commercial Use:** Permitted for private execution and server backend usage. Modifications to the wrapper code itself must remain open under LGPL-3.0 if distributed, but linking via API endpoints does not infect host application code.
* **Current Viability:** **HIGH** (Best structured TypeScript adapter for Node-based FlyZone backend integration).

---

### Candidate B — `SunoAI-API/Suno-API`

* **Repository:** [https://github.com/SunoAI-API/Suno-API](https://github.com/SunoAI-API/Suno-API)
* **Stack / Architecture:** Python / FastAPI / Uvicorn server.
* **Recent Activity & Community:** Moderate activity, maintained by open-source community members.
* **Authentication Method:** Extracts session cookies from browser DevTools, passes headers directly to `studio-api.prod.suno.com`.
* **Exposed Endpoints & Capabilities:**
  * `/generate` (Basic audio generation)
  * `/feed` (Task status polling & MP3 URL retrieval)
  * `/credits` (Quota retrieval)
* **Security Inspection:**
  * **Secrets Storage:** Environment variable / `.env` file configuration.
  * **Data Transmission:** Direct communication with Suno backend servers.
  * **Client Risk:** Python process must run isolated on local/private server.
* **License:** `MIT License`.
  * **Commercial Use:** Fully permissive open-source license.
* **Current Viability:** **MEDIUM** (Functional, but requires Python environment alongside Node.js frontend stack).

---

## Security & Compliance Rules

1. **Strict Credential Isolation:**
   * Suno session cookies, JWTs, and refresh tokens MUST NEVER be committed to Git, hardcoded in JavaScript files, or bundled into static GitHub Pages builds.
   * All authentication credentials reside in server-side environment variables (`.env.local` or environment secrets).
2. **No Automatic Credit Spending:**
   * Generations MUST ONLY trigger on deliberate user interaction (pressing **GENERATE**).
   * Background polling, retry loops, or page reloads must NEVER initiate new generation requests.
3. **Session Expiration & Health Checking:**
   * Before allowing Suno generation, FlyZone checks session health. If credentials expire, FlyZone displays `SUNO SESSION EXPIRED` / `Reconnect Suno to continue` without crashing or blocking the Google engine.

---

## Recommended Suno Bridge for FlyZone

### **RECOMMENDED CHOICE: `SunoBridgeAdapter` using Node.js TypeScript REST pattern (Candidate A architecture)**

### **Key Reasons:**
1. **Architectural Consistency:** Matches the Node.js/JavaScript stack of 2flyKeithLogan.com and FlyZone.
2. **Clean Provider Abstraction:** Allows building a light backend bridge controller (`SunoBridgeAdapter`) that translates FlyZone requests into Suno internal calls while keeping secrets 100% server-side.
3. **Internal Classification:** 
   * Classify internally as `SunoPersonalProvider`.
   * User-facing label: **`SUNO — EXPERIMENTAL`**.
   * Reserve `SunoOfficialProvider` for future official Suno API partner access.

---

## Fallback & Production Strategy

* **GitHub Pages / Live Site:** GitHub Pages is static and cannot host private Suno session cookies safely. Therefore, in public production deployment on GitHub Pages, **GOOGLE** (`GoogleLyriaProvider`) operates as the active live engine, while **SUNO** (`SunoPersonalProvider`) operates in **LAB / DEV MODE** (active when local backend server is connected).
* **Graceful Degradation:** If Suno credentials expire or local bridge is offline, FlyZone gracefully falls back to Google engine with zero runtime errors.
