# MCP Connection Plan

## Connect FIRST

### GitHub
Install from:
Antigravity Settings -> Customizations -> Installed MCP Servers -> Add MCP -> GitHub

Authenticate to the GitHub account that owns/has access to the 2flyKeithLogan repository.

Initial use:
- repository context
- branches/commits
- source-control awareness

Keep production-changing operations approval-gated at first.

### Chrome DevTools
Install from the same MCP Store.

Also allow Antigravity's browser tooling when prompted.

Initial use:
- localhost/site testing
- console inspection
- network inspection
- responsive testing
- screenshots/browser recordings

## Connect AFTER the first audit

### Google Drive
Google's official Drive remote MCP is a Developer Preview service.
It requires a Google Cloud project, Drive API, Drive MCP API, OAuth consent, and an OAuth web client.

Endpoint:
https://drivemcp.googleapis.com/mcp/v1

Do not put OAuth client secrets in this repository.

### Google Docs
Google's official Docs remote MCP is also Developer Preview.

Endpoint:
https://docsmcp.googleapis.com/mcp/v1

Do not put OAuth client secrets in this repository.

## Connect LATER

### Unreal Engine
Use a separate game-production Antigravity workspace.
UE 5.8 supports Unreal MCP. Enable Unreal MCP + All Toolsets in Unreal before connecting.

### Adobe / Photoshop
Use official Adobe APIs/UXP or a reviewed MCP bridge.
Do not install an unknown third-party MCP and hand it Adobe credentials.

### Suno and other subscriptions
Treat browser automation as a later, service-specific workflow.
Do not make these part of the core website stabilization pipeline.
