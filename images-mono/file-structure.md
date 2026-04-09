```
echo-monorepo1
├─ apps
│  ├─ web
│  │  ├─ app
│  │  │  ├─ (auth)
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ org-selection
│  │  │  │  │  └─ [[...org-selection]]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ sign-in
│  │  │  │  │  └─ [[...sign-in]]
│  │  │  │  │     └─ page.tsx
│  │  │  │  └─ sign-up
│  │  │  │     └─ [[...sign-up]]
│  │  │  │        └─ page.tsx
│  │  │  ├─ (dashboard)
│  │  │  │  ├─ conversations
│  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [conversationId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ customization
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ files
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ integrations
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ plugins
│  │  │  │     └─ vapi
│  │  │  │        └─ page.tsx
│  │  │  ├─ ._favicon.ico
│  │  │  ├─ ._layout.tsx
│  │  │  ├─ ._page.tsx
│  │  │  ├─ api
│  │  │  │  └─ sentry-example-api
│  │  │  │     └─ route.ts
│  │  │  ├─ favicon.ico
│  │  │  ├─ global-error.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ sentry-example-page
│  │  │     └─ page.tsx
│  │  ├─ components
│  │  │  ├─ convex-provider.tsx
│  │  │  ├─ ConvexClientProvider.tsx
│  │  │  ├─ ModeToggle.tsx
│  │  │  └─ theme-provider.tsx
│  │  ├─ hooks
│  │  │  └─ use-mobile.ts
│  │  ├─ lib
│  │  │  └─ country-utils.ts
│  │  ├─ middleware.ts
│  │  └─ modules
│  │     ├─ auth
│  │     │  └─ ui
│  │     │     ├─ components
│  │     │     │  ├─ auth-guard.tsx
│  │     │     │  └─ organization-guard.tsx
│  │     │     ├─ layouts
│  │     │     │  └─ auth-layout.tsx
│  │     │     └─ views
│  │     │        ├─ org-selection-view.tsx
│  │     │        ├─ sign-in-view.tsx
│  │     │        └─ sign-up-view.tsx
│  │     ├─ dashboard
│  │     │  ├─ atoms.ts
│  │     │  ├─ constants.ts
│  │     │  └─ ui
│  │     │     ├─ components
│  │     │     │  ├─ conversation-status-button.tsx
│  │     │     │  ├─ conversations-panel.tsx
│  │     │     │  └─ dashboard-sidebar.tsx
│  │     │     ├─ layouts
│  │     │     │  ├─ conversations-layout.tsx
│  │     │     │  └─ dashboard-layout.tsx
│  │     │     └─ views
│  │     │        ├─ conversation-id-view.tsx
│  │     │        └─ conversations-view.tsx
│  │     └─ files
│  │        └─ ui
│  │           ├─ components
│  │           │  ├─ delete-file-dialog.tsx
│  │           │  └─ upload-file-dialog.tsx
│  │           └─ views
│  │              └─ files-view.tsx
│  └─ widget
│     ├─ app
│     │  ├─ layout.tsx
│     │  └─ page.tsx
│     ├─ components
│     │  ├─ convex-provider.tsx
│     │  └─ theme-provider.tsx
│     ├─ hooks
│     ├─ lib
│     ├─ modules
│     │  └─ widget
│     │     ├─ constants.ts
│     │     ├─ hooks
│     │     │  └─ use-vapi.ts
│     │     └─ ui
│     │        ├─ atoms
│     │        │  └─ widget-atoms.ts
│     │        ├─ components
│     │        │  ├─ widget-footer.tsx
│     │        │  └─ widget-header.tsx
│     │        ├─ screens
│     │        │  ├─ widget-auth-screen.tsx
│     │        │  ├─ widget-chat-screen.tsx
│     │        │  ├─ widget-error-screen.tsx
│     │        │  ├─ widget-inbox-screen.tsx
│     │        │  ├─ widget-loading-screen.tsx
│     │        │  └─ widget-selection-screen.tsx
│     │        └─ views
│     │           └─ widget-view.tsx
│     ├─ ...
│     └─ tsconfig.json
├─ packages
│  ├─ backend
│  │  ├─ convex
│  │  │  ├─ auth.config.ts
│  │  │  ├─ constants.ts
│  │  │  ├─ convex.config.ts
│  │  │  ├─ lib
│  │  │  │  └─ extractTextContent.ts
│  │  │  ├─ playground.ts
│  │  │  ├─ private
│  │  │  │  ├─ contactSessions.ts
│  │  │  │  ├─ conversations.ts
│  │  │  │  ├─ files.ts
│  │  │  │  └─ messages.ts
│  │  │  ├─ public
│  │  │  │  ├─ contactSessions.ts
│  │  │  │  ├─ conversations.ts
│  │  │  │  ├─ messages.ts
│  │  │  │  └─ organization.ts
│  │  │  ├─ README.md
│  │  │  ├─ schema.ts
│  │  │  ├─ system
│  │  │  │  └─ ai
│  │  │  │     ├─ agents
│  │  │  │     │  └─ supportAgent.ts
│  │  │  │     ├─ constants.ts
│  │  │  │     ├─ rag.ts
│  │  │  │     └─ tools
│  │  │  │        ├─ escalateConversation.ts
│  │  │  │        ├─ resolveConversation.ts
│  │  │  │        └─ search.ts
│  │  │  ├─ tsconfig.json
│  │  │  ├─ users.ts
│  │  │  └─ _generated
│  │  │     ├─ api.d.ts
│  │  │     ├─ api.js
│  │  │     ├─ dataModel.d.ts
│  │  │     ├─ server.d.ts
│  │  │     └─ server.js
│  │  └─ ...
│  ├─ math
│  │  ├─ package.json
│  │  ├─ src
│  │  │  └─ add.ts
│  │  └─ tsconfig.json
│  └─ ui
│     ├─ ...
│     ├─ src
│     │  ├─ components
│     │  │  ├─ accordion.tsx
│     │  │  ├─ ai
│     │  │  │  ├─ ...
│     │  │  │  └─ tool.tsx
│     │  │  ├─ alert-dialog.tsx
│     │  │  └─ ...
│     │  ├─ hooks
│     │  │  ├─ use-infinite-scroll.ts
│     │  │  └─ use-mobile.ts
│     │  ├─ lib
│     │  │  └─ utils.ts
│     │  └─ styles
│     │     └─ globals.css
│     └─ ...
└─ ...
```
