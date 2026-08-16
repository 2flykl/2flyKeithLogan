# FLYZONE — EXPERIMENTAL SUNO BRIDGE INTEGRATION MANUAL

**Document Version:** 1.0.0  
**Date:** August 16, 2026  
**Status:** Operational / Development & Lab Integration  

---

## Overview

This document describes the technical architecture, security protocols, configuration instructions, and operational procedures for the **Suno Experimental Bridge** (`SunoPersonalProvider`) within FlyZone.

FlyZone supports multiple music-generation engines:
- **`GoogleLyriaProvider`**: Production Google / Lyria generation pipeline.
- **`SunoPersonalProvider`**: Experimental reverse-engineered Suno personal account bridge (`SunoBridgeAdapter`).
- **`SunoOfficialProvider`**: Reserved for future official Suno developer API access.

---

## 1. Selected Bridge Architecture

* **Candidate Architecture:** Node.js TypeScript REST Bridge Proxy (`gcui-art/suno-api` model)
* **License:** `LGPL-3.0` (Lesser GNU General Public License v3.0)
* **Runtime Requirements:** Node.js v18+ / Express or Next.js server proxy.
* **Internal Provider Key:** `SunoPersonalProvider`
* **Development UI Label:** **`SUNO — EXPERIMENTAL`**

---

## 2. Security & Credential Isolation

> [!CAUTION]
> **NEVER HARDCODE OR COMMIT SUNO CREDENTIALS**
> Suno session cookies (`COOKIE`), JWT tokens, and login credentials MUST NEVER be embedded in browser JavaScript, committed to Git repositories, or exposed in static GitHub Pages builds.

### Credential Flow Architecture
```text
┌──────────────────────────────┐
│  FlyZone Frontend (Client)   │  (No secrets, static HTML/JS)
└──────────────┬───────────────┘
               │  REST API Calls (/api/suno/*)
┌──────────────▼───────────────┐
│ FlyZone Backend / Proxy      │  (Holds SUNO_COOKIE in .env.local)
└──────────────┬───────────────┘
               │  Authenticated HTTP + Clerk JWT
┌──────────────▼───────────────┐
│ Suno Internal Engine         │  (studio-api.suno.ai)
└──────────────────────────────┘
```

---

## 3. Environment Variables Configuration

Create a local `.env.local` file (listed in `.gitignore`):

```env
# FlyZone Engine Configuration
FLYZONE_DEFAULT_ENGINE=GOOGLE

# Suno Experimental Bridge Credentials (SERVER-SIDE ONLY)
SUNO_COOKIE=your_suno_session_cookie_here
SUNO_BRIDGE_PORT=3002
SUNO_POLL_INTERVAL_MS=3000
SUNO_MAX_POLL_ATTEMPTS=60
```

---

## 4. Operational Capability Matrix

FlyZone detects supported Suno features dynamically via the capability vector:

| Capability | Status | Description |
| :--- | :---: | :--- |
| `generate` | **Supported** | Standard prompt-driven audio generation |
| `custom_generate` | **Supported** | Custom lyrics, title, and genre tags |
| `instrumental` | **Supported** | Toggle instrumental-only generation |
| `extend` | **Supported** | Extend existing track by clip ID |
| `quota` | **Supported** | Retrieve remaining account credits |
| `stems` | *Unsupported* | Separate vocal/instrumental stems |
| `upload` | *Unsupported* | Audio file upload for style reference |

---

## 5. Credit & Quota Governance

To protect personal account credits:
1. **Manual Triggering Only:** Generations can ONLY be initiated by an explicit user click on **`GENERATE`**.
2. **No Background Retries:** Background retries or automated retries on failure are strictly disabled.
3. **`AUTO` Engine Behavior:** The `AUTO` engine selector defaults to `GOOGLE` so that automated requests do not inadvertently consume personal Suno credits.

---

## 6. Session Expiration & Health Protocol

Before initiating a Suno generation request, `SunoPersonalProvider` conducts a session health check:

* **State `READY`**: Credit quota visible, bridge responds cleanly (`200 OK`).
* **State `AUTH_EXPIRED`**: Suno cookie or Clerk token has expired. UI displays **"SUNO SESSION EXPIRED — Reconnect Suno to continue"**.
* **State `UNAVAILABLE`**: Local bridge server is offline. FlyZone automatically routes or offers fallback to **`GOOGLE`**.

---

## 7. Reconnect & Maintenance Procedures

### How to Reconnect an Expired Suno Session:
1. Log into [suno.com](https://suno.com) in your browser.
2. Open Browser DevTools -> Network Tab.
3. Locate any request to `studio-api.suno.ai` or `clerk.suno.com`.
4. Copy the value of the `Cookie` request header.
5. Update `SUNO_COOKIE` in your server's `.env.local` file.
6. Restart the local FlyZone bridge server (`npm run start:suno-bridge`).

### How to Completely Remove / Disable the Suno Bridge:
1. Set `FLYZONE_ENABLE_SUNO=false` in `.env`.
2. FlyZone will gracefully hide the `SUNO` option and operate exclusively on `GOOGLE`.
