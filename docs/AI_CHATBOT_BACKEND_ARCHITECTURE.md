# Real AI Chatbot Backend & Knowledge Base Architecture
**Project:** Aurelle Spaces — Premium Architecture & Interior Design Studio  
**Production Domain:** `https://aurelle.dsecops88.online`  
**Implemented In:** Prompt 12 of 20  
**Status:** Complete Real Backend Implementation (Edge D1 & LLM Provider Compatible)

---

## 1. Executive Architecture Overview

The **Aurelle Spaces AI Chatbot Backend** provides an edge-native, secure, multi-provider conversational intelligence engine running on Cloudflare Workers and Cloudflare D1.

### Core Architectural Principles:
1. **Zero Fake Responses:** The backend strictly communicates with real configured AI providers (Google Gemini, OpenAI-compatible endpoints) or explicitly reports service unavailability. It never returns canned or fabricated responses pretending to be AI.
2. **Provider Agnostic Architecture:** Configurable provider abstraction allows instant switching between Google Gemini (`gemini-2.5-flash`) and OpenAI-compatible models (`gpt-4o-mini`, Cloudflare AI Gateway) via environment bindings without code modifications.
3. **Grounded Business Knowledge Base:** All conversational answers are grounded in an approved studio knowledge base (`src/lib/chat/knowledge-base.ts`), eliminating hallucinated addresses, telephone numbers, fixed rate cards, or unverified claims.
4. **Multi-Layered Security & Prompt Defense:** Pre-inference prompt sanitization detects and neutralizes prompt injection vectors (`<visitor_query>` encapsulation). Post-inference sanitization strips dangerous HTML, iframes, and cross-site scripting payloads.
5. **Session Ownership & Data Privacy:** Conversations are tied to unguessable anonymous session tokens (`ses_chat_<hex>`) via HTTP-only cookies, preventing cross-visitor conversation snooping or hijacking.
6. **Edge & Worker Native:** Implemented using standard Web APIs (`fetch`, `crypto.subtle`, `AbortSignal.timeout`) with zero heavy Node.js-only SDKs.

---

## 2. API Contract: `POST /api/chat/message`

### Endpoint Specification
* **Path:** `/api/chat/message`
* **Method:** `POST`
* **Content-Type:** `application/json`
* **Maximum Payload Size:** 32 KB

### Request Format (`ChatMessageRequest`)
```typescript
interface ChatMessageRequest {
  conversationId?: string; // Optional client/D1 conversation identifier
  message: string;        // Visitor text (1 - 1,000 characters, required)
  safeContext?: {
    pageUrl?: string;     // Current public route (e.g. "/services")
    discipline?: string;  // Selected design discipline if navigating
  };
}
```

### Response Formats

#### 1. Success (HTTP 200 OK)
```json
{
  "success": true,
  "conversationId": "cnv_3f9a2b1c8e7d4a5b",
  "messageId": "msg_8d7c6b5a4e3f2a1b",
  "message": "At Aurelle Spaces, we approach residential interiors through deep listening and climate-appropriate materiality. We design custom teak millwork, atmospheric lighting, and spatial zoning for private residences across India. Would you like to explore our residential scope or review our design process?",
  "timestamp": "2026-11-21T04:30:00.000Z"
}
```

#### 2. Provider Unavailable / Unconfigured (HTTP 503 Service Unavailable)
Returned when `AI_API_KEY` is missing or when the upstream provider is unreachable:
```json
{
  "success": false,
  "conversationId": "conv_ses_chat_17321234",
  "messageId": "msg_1732123456",
  "error": "Live chat is currently unavailable. You can still explore our services or use the contact page.",
  "timestamp": "2026-11-21T04:30:00.000Z"
}
```

#### 3. Rate Limit Exceeded (HTTP 429 Too Many Requests)
```json
{
  "success": false,
  "error": "You have sent several messages in a short time. Please wait a minute or continue your project discussion on our contact page."
}
```

#### 4. Invalid Message or Prompt Injection (HTTP 400 Bad Request)
```json
{
  "success": false,
  "error": "Message contains unsupported formatting or override directives."
}
```

---

## 3. LLM Provider Abstraction (`src/lib/chat/providers/`)

```
src/lib/chat/providers/
├── types.ts              # Common interfaces (LLMChatProvider, LLMMessage, ProviderError)
├── gemini-provider.ts    # Google Gemini HTTP API adapter (generateContent)
├── openai-provider.ts    # OpenAI-compatible HTTP adapter (chat/completions)
└── index.ts              # Provider factory (getActiveAIProvider)
```

### Supported Providers:
1. **Google Gemini (`GeminiProvider`):**
   - Direct HTTP call to `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}`.
   - Separate `system_instruction` object and `contents` array with user/model turns.
   - Default model: `gemini-2.5-flash`.
2. **OpenAI Compatible (`OpenAIProvider`):**
   - Standard HTTP call to `{baseUrl}/chat/completions`.
   - Supports official OpenAI, Cloudflare AI Gateway, and local proxies.
   - Default model: `gpt-4o-mini`.

---

## 4. Environment Configuration (`src/lib/chat/config.ts`)

Server-side settings are resolved safely from Cloudflare Worker bindings (`env`) or fallback `process.env`:

| Key | Description | Default / Example | Secret? |
|---|---|---|:---:|
| `AI_PROVIDER` | Active provider type (`google-gemini` \| `openai` \| `openai-compatible`) | `google-gemini` | No |
| `AI_API_KEY` / `GEMINI_API_KEY` | API authentication key | Provisioned via `wrangler secret put` | **YES** |
| `AI_MODEL` / `AI_MODEL_NAME` | Model identifier | `gemini-2.5-flash` / `gpt-4o-mini` | No |
| `AI_API_BASE_URL` | Base URL for OpenAI proxies | `https://api.openai.com/v1` | No |
| `AI_REQUEST_TIMEOUT` | Upstream network timeout in ms (5,000–30,000) | `15000` | No |
| `AI_MAX_OUTPUT_TOKENS` | Maximum tokens per response (100–1,500) | `600` | No |
| `AI_TEMPERATURE` | Sampling temperature (0.0–1.0) | `0.4` | No |

---

## 5. Approved Business Knowledge Base (`knowledge-base.ts` & `retrieval.ts`)

The knowledge base is structured into five categorized domains:
1. **Studio Overview:** Aurelle Spaces identity, philosophy (*"Thoughtful spaces. Considered details."*), demonstration context (DRK Information Software Solutions), and four design values.
2. **Four Core Disciplines:** Residential Interiors, Commercial Interiors, Architecture & Space Planning, Renovation & Refurbishment. Scope boundaries and pricing policy (custom-scoped architectural fees; no fixed rate cards).
3. **Six-Stage Process:** Initial Conversation, Site Understanding, Conceptual Direction, Design Development, Technical Detailing & Sourcing, On-Site Realization.
4. **Demonstration Case Studies:** Courtyard Residence (Hyderabad), The Quiet House (Bengaluru), Atelier Workspace (Pune), Coastal Villa (Alibaug), Penthouse (Mumbai), Heritage Restoration (Kolkata).
5. **Consultation & Navigation:** Guidance to submit spatial briefs on `/contact` for architectural review.

### Retrieval Engine (`retrieveRelevantKnowledge`)
Deterministic keyword & intent matching extracts the top 2-3 matching categories (~800–1,200 tokens) to minimize prompt overhead and token expenditure while preventing context hallucination.

---

## 6. Prompt Injection & Safe Output Defense

### Input Guard (`src/lib/security/prompt-guard.ts`):
- Enforces character length between 1 and 1,000 characters.
- Detects regex override signatures (*"ignore previous instructions"*, *"system prompt"*, *"DAN mode"*, *"jailbreak"*).
- Wraps sanitized user queries in explicit XML tags:
  ```xml
  <visitor_query>
  Tell me about your residential interior design process
  </visitor_query>
  ```

### Output Guard (`src/lib/chat/output-guard.ts`):
- Strips all `<script>`, `<iframe>`, `<style>`, and `<object>` HTML elements.
- Neutralizes dangerous pseudo-protocols (`javascript:`, `data:`) in markdown links.
- Strips internal system prompt leaks and raw XML tags.

---

## 7. Conversation Memory & Cloudflare D1 Persistence

- **Session Ownership:** Anonymous visitors are issued a cryptographically random session token (`ses_chat_<hex>`) via `Set-Cookie: aurelle_chat_session=...; HttpOnly; SameSite=Lax`.
- **Database Tables:**
  - `chat_conversations`: Holds `id`, `session_id`, `conversation_status`, and timestamps.
  - `chat_messages`: Holds `id`, `conversation_id`, `sender_role` (`user` \| `assistant`), `message_content`, and `created_at`.
- **Context Window:** The last 6 conversational turns are retrieved from D1 to provide natural dialogue continuity while capping token consumption.

---

## 8. Rate Limiting & Cost Control (`chat-rate-limit.ts`)

- **Session Rate Limit:** Maximum **10 user messages per 10-minute sliding window** per session.
- **IP Rate Limit:** Maximum **15 messages per 10-minute window** across the network.
- **Timeout Protection:** Strict 15-second `AbortSignal.timeout` prevents hanging worker instances.
- **Max Tokens Cap:** Enforces 600 max output tokens to prevent runaway generation bills.

---

## 9. Administrative Chat Monitoring (`/admin/chat`)

- Access restricted to authenticated administrators (`super_admin`, `editor`).
- Displays total sessions, active conversations, qualified lead indicators, and message counts.
- Shows recent anonymized session tokens, last activity dates, and brief inquiry excerpts.
- Protects visitor privacy by avoiding surveillance-style telemetry.

---

## 10. Production Cloudflare Deployment Checklist

Before enabling live AI chat in production:
1. Provision AI API Key via Wrangler:
   ```bash
   wrangler secret put GEMINI_API_KEY
   # or
   wrangler secret put AI_API_KEY
   ```
2. Verify D1 Database tables exist:
   ```bash
   wrangler d1 execute aurelle-db --command="SELECT COUNT(*) FROM chat_conversations;"
   ```
3. Test edge connectivity:
   - Without key: API returns HTTP 503 with friendly unavailable guidance.
   - With key: API returns HTTP 200 with grounded architectural guidance.

