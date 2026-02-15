# AI Coding Agent Instructions for Fund-CAMH

## Project Overview
Fund-CAMH is a React/TypeScript community support platform for CAMH fundraising. It's a real-time post feed with AI-enhanced reflections, moderator review, and privacy-first design. The app is built with Vite and backed by Firebase Firestore.

## Architecture

### Service Layer Pattern
The codebase separates concerns into three services in `/services/`:
- **api.ts**: Firestore queries and real-time subscriptions (`subscribeToPosts`, `subscribeToPendingPosts`, CRUD operations)
- **firebase.ts**: Configuration and initialization with graceful degradation (`isConfigured` flag)
- **gemini.ts**: Calls Google Gemini 2.0 Flash API with category-aware fallbacks

**Key insight**: All external service calls fail gracefully (e.g., Gemini returns fallback reflections if API is unavailable).

### Data Flow
1. Posts are stored in Firestore with status: `pending | approved | rejected`
2. `App.tsx` maintains state for `posts` (approved) and `pendingPosts` (moderator view)
3. Real-time listeners (`onSnapshot`) sync data automatically
4. When posting: user content → Gemini enhancement → stored in Firestore with status=pending

### Component Hierarchy
- **Gates** (Filters/Access Control):
  - `PrivacyGate`: Overlay blocks everything until privacy accepted (stored in localStorage)
  - `PreviewGate`: Unlocks feed access
  - `PrivateGate`: Component skeleton exists
- **Forms**:
  - `PostForm`: Controlled component, calls `enhancePost` before submission
  - `ModeratorPasscodeModal`: Session-based auth (Ctrl+Shift+M toggles moderator mode)
- **Lists**:
  - `PostList`: Displays approved posts with helpful count toggle
  - `PendingPostsQueue`: Shows pending posts for moderators to approve/reject

## Critical Developer Workflows

### Local Development
```bash
npm install
npm run dev  # Starts Vite dev server on $PORT (default 3000) or :3000
```

### Building
```bash
npm run build  # Compiles to /dist/ folder
npm run preview  # Preview production build locally
```

### Environment Setup
- **Required**: `VITE_GEMINI_API_KEY` environment variable
- Firebase config is hardcoded in [services/firebase.ts](services/firebase.ts) (production keys embedded)
- If Firebase config missing, app runs in local-only mode with warnings

### Docker Deployment
Multi-stage build: compiles app in Node 20 build stage, serves from Alpine node with `serve` on port 8080.

## Project-Specific Patterns

### State Management
App uses React hooks with localStorage for persistence:
- `privacyAccepted` → localStorage ("camh_privacy_accepted")
- `previewUnlocked` → localStorage ("camh_preview_unlocked")
- `moderatorAuthenticated` → sessionStorage ("camh_moderator_authenticated")

All localStorage access wrapped in try-catch (SSR/private browsing safety).

### Form Pattern
Forms are controlled components with:
- `isSubmitting` flag to prevent double-submit
- Validation before external API calls
- Success toast messages (5s timeout)
- Clear state after submission

### Firestore Queries
- `subscribeToPosts`: Returns only posts where status is null (legacy) or "approved"
- `subscribeToPendingPosts`: Filtered on Firestore with where-clause, but main list filters client-side
- All listeners auto-cleanup via unsubscribe return value

### AI Reflection Strategy
`enhancePost` in [services/gemini.ts](services/gemini.ts):
- Uses Gemini 2.0 Flash with temperature 0.9 (diverse responses)
- System prompt ensures warm, professional mental health tone (max 20 words)
- **Fallback logic**: Categories have category-specific fallback messages, cycling by content.length % messages.length
- If API fails, fallback is used silently (no error shown to user)

### UI/CSS Notes
- Tailwind CSS (implicit in className patterns)
- Accessible icon library (Font Awesome: `fa-solid` classes)
- Modal/overlay z-index pattern: `z-[300]` for modals (check for conflicts when adding)
- Animations: fade-in class (custom CSS likely in index.html or global styles)

## Integration Points & External Dependencies

### Firebase
- Auto-initializes if `projectId` is valid
- Uses `getApps().length === 0` pattern to prevent re-initialization
- Firestore path: collection "posts" with document schema matching [types.ts](types.ts) `Post` interface

### Google Gemini API
- Endpoint: `models.generateContent` via `@google/genai` SDK v1.3.0
- Model: `gemini-2.0-flash`
- Requires `VITE_GEMINI_API_KEY` at app init (import.meta.env)

### React 19.2.4 & Vite 6.2.0
- TypeScript ~5.8.2 (strict mode likely enabled)
- React 19 features: use hook likely not needed yet (class refs unchanged)

## Important Conventions

1. **No Anonymous Username Variation**: Posts always created with `author: 'Anonymous'` (hardcoded)
2. **Client-Side Filtering**: Status filtering happens in [services/api.ts](services/api.ts) onSnapshot callback, not Firestore query (for backwards compatibility)
3. **Type Safety**: All Post operations reference `types.ts` `Post` interface (id, author, content, category, timestamp, aiReflection, helpfulCount, status)
4. **Category Types**: Exactly `'Anxiety' | 'Depression' | 'General Support' | 'Resources'`
5. **Moderator Activation**: Two methods, both trigger the passcode modal if unauthenticated:
   - **Desktop**: Ctrl+Shift+M keyboard shortcut (useEffect in App.tsx)
   - **Mobile/iPhone**: Tap the header logo 5 times within 2 seconds (hidden gesture in Header.tsx)
6. **Passcode Modal**: Uses controlled Modal component (location: [components/ModeratorPasscodeModal.tsx](components/ModeratorPasscodeModal.tsx))

## Common Pitfalls

- **Environment Variables**: VITE_GEMINI_API_KEY must be available at build/launch; use `import.meta.env` not `process.env`
- **Firestore Subscriptions**: Always return unsubscribe function in useEffect cleanup
- **localStorage Failures**: Must wrap in try-catch for edge cases
- **Moderator State**: Uses sessionStorage not localStorage (session-only) — clearing tabs loses authentication
- **Post Status Backwards Compatibility**: Filters include `!data.status` (null) OR "approved" to support legacy posts

## Testing & Debugging
- Check console for ✅/❌ status indicators (Firebase, Gemini, Firestore connection)
- Firestore Emulator: Not currently configured (use real Firestore or configure locally)
- Error console messages are prefixed with context (e.g., "❌ Gemini API Error", "✅ Firebase Connected")
