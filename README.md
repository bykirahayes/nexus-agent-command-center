# Nexus Agent Command Center

Build a polished full-stack web app called "Nexus AI" — a personal multi-AI command centre for one user to connect multiple AI providers (including free-tier accounts where technically and contractually supported), assign work, collaborate across agents, and let authorised agents operate websites.

PRODUCT VISION
A premium, modern, dark command-centre UI. Think Linear meets a high-end AI operations console. Use near-black/charcoal surfaces, subtle emerald green accents, restrained glow, crisp typography, excellent responsive layout. Avoid clutter and gimmicky gradients.

CORE APP SHELL
- Persistent left sidebar: Overview, AI Agents, Workflows, Browser Sessions, Projects, Activity, Integrations, Settings.
- Top bar with global task composer, workspace selector, notifications, user profile.
- Overview dashboard with active agents, connected providers, running tasks, recent activity, usage/cost summary, and a prominent "New task" action.
- Use realistic seeded demo data, but clearly label simulated/demo statuses and never imply real provider connections exist until configured.

AI PROVIDER CONNECTIONS
- Integrations directory/cards for OpenAI, Anthropic Claude, Google Gemini, Microsoft Copilot, xAI Grok, Perplexity, DeepSeek, Mistral, and a generic custom OpenAI-compatible endpoint.
- Each integration has connection method/status, capability tags, model list placeholder, and Connect/Configure action.
- Prefer official API keys or OAuth where available; store secrets only server-side using secure secret storage, never expose them to the browser, never log them, and provide disconnect/revoke controls.
- Explain in UI that consumer/free chat subscriptions do not automatically include API access. Where an official API is unavailable, show a clearly marked "Browser session / limited support" path only if permitted by the provider's terms. Never ask users to paste account passwords or session cookies into the app.
- Build a provider adapter abstraction so providers can be added without rewriting orchestration. Do not claim that every listed provider is connected or working by default.

TASKS & COLLABORATION
- New task composer: task title/instructions, optional target website URL, choose one or multiple agents, select collaboration mode (parallel research, sequential hand-off, debate/review, lead + reviewers), and risk level.
- Task detail view with shared task brief, agent messages, outputs, hand-offs, status timeline, attachments placeholder, and final synthesis panel.
- Agents can critique one another, cite evidence/URLs, identify disagreements, and a coordinator synthesises the final result.
- Add approval gates before external side effects: submitting forms, publishing, sending messages, purchasing, deleting, changing account settings, or deploying. Read-only browsing can run without approval once a session is authorised.
- Task statuses: Draft, Queued, Running, Needs approval, Completed, Failed.

WEBSITE / BROWSER AGENT
- Browser Sessions page to connect an authorised browser session, list active sessions and domains, show read-only vs action permissions, and revoke access.
- Design for a separate local browser extension/desktop companion that uses the user's already-authenticated browser session. Do not implement credential scraping, cookie export, stealth automation, CAPTCHA bypass, or access-control circumvention.
- Show an honest "Browser companion required" setup state until a real companion is implemented/connected. Do not fake browser control.
- Provide scoped per-domain permissions and an audit trail of every browser action. Require explicit approval for consequential actions.

WORKFLOWS
- Visual workflow builder UI with trigger, agent steps, review gates, and output nodes. Include a few demo templates: Research a website, Compare AI answers, Audit a landing page, Draft and review website changes.
- Workflows should be saved as drafts unless backend execution is genuinely implemented.

DATA & ENGINEERING
- Use Lovable's supported full-stack TypeScript stack and database if available. Create sensible schema for providers (without plaintext secrets), agents, tasks, task_messages, workflows, browser_sessions, permissions, approvals, and audit_events.
- Add row-level security and ensure all user data is private to the authenticated owner. Include sign-in/auth flow and protected routes. If auth/database setup cannot be completed, clearly mark the remaining setup rather than faking it.
- Implement working UI interactions for navigation, filters, task creation, agent selection, workflow editing, approval queue, and settings using persistent storage where possible.
- Build provider integration interfaces and server-side adapter stubs with clear "not configured" states. Do not hardcode API keys or pretend live model calls work without credentials.
- Include loading, empty, error, and disconnected states.
- Add a clear security/settings page for connected accounts, scopes, data retention, and audit history.

DELIVERABLE
Create the complete first-pass app, not just a landing page. Prioritise a usable dashboard and coherent navigation, with realistic demo content and honest capability boundaries.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6a2a6a9a-635d-4e65-8302-3e0c7f78a096).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
