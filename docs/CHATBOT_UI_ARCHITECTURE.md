# Conversational AI Studio Assistant UI Architecture
**Project:** Aurelle Spaces — Premium Architecture & Interior Design Studio  
**Production Domain:** `https://aurelle.dsecops88.online`  
**Implemented In:** Prompt 11 of 20  
**Status:** Complete UI & Client Architecture (Backend Integration in Prompt 12)

---

## 1. Architectural Overview

The **Aurelle Spaces Studio Assistant** provides an understated, luxury conversational interface designed to assist prospective clients in exploring spatial disciplines, architectural methodologies, and consultation requirements.

The interface adheres strictly to the studio's tactile design system:
- **Brand Palette:** Warm Ivory (`#F7F4EF`), Deep Charcoal (`#242522`), Muted Bronze (`#A17C55`), Soft Stone (`#DCD5CB`), Pure White (`#FFFFFF`).
- **Typography:** Serif headlines (`Cormorant Garamond`), crisp sans-serif body (`Geist Sans`), and precise uppercase monospace details (`Geist Mono`).
- **No Neon AI Aesthetics:** Avoids garish gradients, robotic avatars, and aggressive marketing popups. Operates as a discreet, dignified studio concierge.
- **Truthful Backend Integration:** Does not fabricate LLM responses or claim human availability. When disconnected from the real edge API (prior to Prompt 12), it clearly and gracefully guides clients to the studio contact page.

---

## 2. Component Hierarchy & Structure

```
src/components/chat/
├── studio-chatbot.tsx           # Route-aware root wrapper (suppresses on /admin/* and /design-system)
├── chat-context.tsx             # React Context & conversation state machine
├── chat-launcher.tsx            # Floating action button (bottom-right, touch-friendly, safe-area aware)
├── chat-panel.tsx               # Master dialog window (Desktop floating card / Mobile full-screen)
├── chat-header.tsx              # Studio brand identity, AI disclosure, reset & close controls
├── chat-message-item.tsx        # Visitor, assistant, system, and error message presentation
├── chat-composer.tsx            # Multiline textarea with Enter-to-send and Shift+Enter newline
├── chat-starters.tsx            # 4 interactive suggestion chips for immediate engagement
├── chat-privacy-notice.tsx      # Explicit privacy notice linking to /privacy-policy
├── chat-typing-indicator.tsx    # Understated 3-dot pulse in Muted Bronze
├── chat-reset-dialog.tsx        # Accessible confirmation dialog preventing accidental conversation loss
└── lead-qualification-card.tsx  # Future lead intake UI foundation (Activated in Prompt 13)

src/lib/chat/
├── types.ts                     # TypeScript definitions for messages, API contracts, and lead models
└── chat-service.ts              # Client API caller with truthful unavailable-state handling
```

---

## 3. Conversational State Management (`chat-context.tsx`)

The client-side state is encapsulated in `ChatProvider`:

| State Property | Type | Description |
|---|---|---|
| `isOpen` | `boolean` | Controls visibility of the chat dialog |
| `isMinimized` | `boolean` | Minimizes panel to floating title bar on desktop |
| `conversationId` | `string` | Unique client-generated session identifier (`conv_<uuid>`) |
| `messages` | `ChatMessage[]` | Chronological list of visitor, assistant, and system messages |
| `status` | `ChatFlowStatus` | `"idle" \| "sending" \| "typing" \| "error"` |
| `error` | `string \| null` | Current active error message |
| `isResetConfirmOpen` | `boolean` | Tracks whether the conversation reset confirmation modal is active |

### Lifecycle & Initial State
- Initialized with an authentic welcome message:
  > *"Hello! Welcome to Aurelle Spaces. I can help you explore our services, understand our design approach or guide you towards a project enquiry."*
- Chat starters and the studio guidance card render only during the pristine initial state (`messages.length <= 1`).
- Submitting a message transitions `status` to `"typing"`, appends the visitor message, dispatches the HTTP request to the API, and renders either the real response or the truthful unavailable fallback.

---

## 4. API Integration Contract (`src/lib/chat/types.ts`)

### Endpoint Specification (Implemented in Prompt 12)
* **Method:** `POST`
* **Route:** `/api/chat/message`
* **Headers:** `Content-Type: application/json`

### Request Payload (`ChatMessageRequest`)
```typescript
interface ChatMessageRequest {
  conversationId?: string;
  message: string;
  safeContext?: {
    pageUrl?: string;
    discipline?: string;
    timestamp?: string;
  };
}
```

### Response Payload (`ChatMessageResponse`)
```typescript
interface ChatMessageResponse {
  success: boolean;
  conversationId: string;
  messageId: string;
  message?: string;
  error?: string;
  timestamp: string;
}
```

### Truthful Unavailable Fallback
Until Prompt 12 implements the Cloudflare Worker Gemini AI route, any call returning 404, 502, 503 or network failure displays:
> *"Live chat is currently unavailable. You can still explore our services or use the contact page."*
With an actionable link directly to `/contact`.

---

## 5. Suggested Conversation Starters

Four architectural conversation triggers are provided:
1. **"What services do you offer?"**
2. **"Tell me about your design process"**
3. **"I want to plan my home interiors"**
4. **"How can I discuss my project?"**

Clicking a suggestion immediately submits the prompt into the active conversation stream, disabling double-submissions while in flight.

---

## 6. Accessibility & Keyboard Navigation (WCAG 2.1 AA)

- **Semantic Role & Labels:**
  - Dialog container: `role="dialog" aria-modal="true" aria-labelledby="chat-heading"`
  - Message log: `role="log" aria-live="polite" aria-relevant="additions"`
  - Launcher button: `aria-label="Chat with Aurelle Spaces" aria-haspopup="dialog" aria-expanded={isOpen}`
- **Keyboard Controls:**
  - `Escape` key closes the dialog (or dismisses the reset confirmation if open).
  - Focus is automatically restored to the `ChatLauncher` button upon closing.
  - Multiline composer sends on `Enter`, inserts newline on `Shift+Enter`.
- **Focus Rings:** High-contrast `ring-2 ring-[#A17C55] ring-offset-2` indicators on all interactive buttons and textareas.
- **Screen Reader Announcements:** Accessible status labels for typing indicators (`Studio assistant is preparing a response...`) and send states.

---

## 7. Responsive Mobile UX

- **Desktop Form Factor:**
  - Width: `420px`, Height: `620px` (or `max-h-[calc(100vh-8rem)]`).
  - Position: `bottom-24 right-6`, rounded corners (`rounded-xl`), soft drop shadow.
- **Mobile Form Factor:**
  - Layout: Fullscreen (`fixed inset-0 z-50`).
  - Viewport Safety: Uses `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
  - Background Locking: Disables `document.body.style.overflow = "hidden"` on viewports `< 640px` when active.
  - Clean Header: Dedicated full-width close button for easy thumb access.

---

## 8. Privacy Notice & Future Lead Qualification (Prompt 13)

- **Privacy Banner:** Prominently featured on the welcome screen:
  > *"Please avoid sharing sensitive personal information in chat. If you choose to submit an enquiry, we will ask for your consent before saving your contact details."*
- **Future Lead Qualification Card (`lead-qualification-card.tsx`):**
  - Prepared UI schema for capturing: `fullName`, `email`, `phone`, `city`, `projectType`, `approximateBudget`, `timeline`, and `consentGiven`.
  - Currently displays a clear disabled preview notice directing visitors to the `/contact` consultation form until Prompt 13 wires real conversational lead triage to Cloudflare D1.

---

## 9. Route Suppression Rules

The assistant automatically mounts on all public studio pages:
- Homepage (`/`)
- About (`/about`)
- Services (`/services`, `/services/*`)
- Portfolio (`/portfolio`, `/portfolio/*`)
- Our Process (`/process`)
- Journal (`/journal`, `/journal/*`)
- Contact (`/contact`)
- Legal pages (`/privacy-policy`, `/terms-of-use`)

The assistant is strictly suppressed on:
- Admin login (`/admin/login`)
- Protected admin dashboard (`/admin/*`)
- Internal design system documentation (`/design-system`)

