# shadcn/ui monorepo template

This is a Next.js monorepo template with shadcn/ui.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```

```
├─ web
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ layout.tsx
│  │  │  ├─ org-selection
│  │  │  │  └─ [[...org-selection]]
│  │  │  │       └─ page.tsx
│  │  │  ├─ sign-in
│  │  │  │  └─ [[...sign-in]]
│  │  │  │       └─ page.tsx
│  │  │  └─ sign-up
│  │  │     └─ [[...sign-up]]
│  │  │          └─ page.tsx
│  │  ├─ (dashboard)
│  │  │  ├─ conversations
│  │  │  │  └─ page.tsx
│  │  │  ├─ customization
│  │  │  │  └─ page.tsx
│  │  │  ├─ files
│  │  │  │  └─ page.tsx
│  │  │  ├─ integrations
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ plugins
│  │  │     └─ vapi
│  │  │        └─ page.tsx
│  │  ├─ api
│  │  │  └─ sentry-example-api
│  │  │     └─ route.ts
│  │  ├─ favicon.ico
│  │  ├─ global-error.tsx
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─  sentry-example-page
│  │     └─ page.tsx
│  ├─ components
│  │  ├─ convex-provider.tsx
│  │  ├─ ConvexClientProvider.tsx
│  │  ├─ ModeToggle.tsx
│  │  └─ theme-provider.tsx
│  ├─ components.json
│  ├─ eslint.config.js
│  ├─ hooks
│  │  └─ use-mobile.ts
│  ├─ lib
│  ├─ middleware.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  └─ ui
│  │  │     ├─ components
│  │  │     │  ├─ auth-guard.tsx
│  │  │     │  └─ organization-guard.tsx
│  │  │     ├─ layouts
│  │  │     │  └─ auth-layout.tsx
│  │  │     └─ views
│  │  │        ├─ org-selection-view.tsx
│  │  │        ├─ sign-in-view.tsx
│  │  │        └─ sign-up-view.tsx
│  │  └─ dashboard
│  │     └─ ui
│  │        ├─ components
│  │        │  └─ dashboard-sidebar.tsx
│  │        ├─ layouts
│  │        │  └─ dashboard-layout.tsx
│  │        └─ views
│  │           ├─ conversation-id-view.tsx
│  │           └─ conversations-view.tsx
```

```
│  └─ widget
│     ├─ app
│     │  ├─ favicon.ico
│     │  ├─ layout.tsx
│     │  └─ page.tsx
│     ├─ components
│     │  ├─ convex-provider.tsx
│     │  └─ theme-provider.tsx
│     ├─ components.json
│     ├─ eslint.config.js
│     ├─ hooks
│     ├─ lib
│     ├─ modules
│     │  └─ widget
│     │     ├─ constants.ts
│     │     ├─ hooks
│     │     │  └─ use-vapi.ts
│     │     ├─ types.ts
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
│     ├─ next-env.d.ts
│     ├─ next.config.mjs
│     ├─ package.json
│     ├─ postcss.config.mjs
│     ├─ public
│     │  └─ logo.svg
│     └─ tsconfig.json
```

```
├─ packages
│  ├─ backend
│  │  ├─ convex
│  │  │  ├─ auth.config.ts
│  │  │  ├─ constants.ts
│  │  │  ├─ convex.config.ts
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
│  │  │  │     └─ constants.ts
│  │  │  ├─ tsconfig.json
│  │  │  ├─ users.ts
│  │  │  └─ _generated
│  │  │     ├─ api.d.ts
│  │  │     ├─ api.js
│  │  │     ├─ dataModel.d.ts
│  │  │     ├─ server.d.ts
│  │  │     └─ server.js
```

```
│  └─ ui
│     ├─ components.json
│     ├─ eslint.config.js
│     ├─ package.json
│     ├─ postcss.config.mjs
│     ├─ src
│     │  ├─ components
│     │  │  ├─ accordion.tsx
│     │  │  ├─ ai
│     │  │  │  ├─ branch.tsx
│     │  │  │  ├─ conversation.tsx
│     │  │  │  ├─ input.tsx
│     │  │  │  ├─ message.tsx
│     │  │  │  ├─ reasoning.tsx
│     │  │  │  ├─ response.tsx
│     │  │  │  ├─ source.tsx
│     │  │  │  ├─ suggestion.tsx
│     │  │  │  └─ tool.tsx
│     │  │  ├─ alert-dialog.tsx
│     │  │  ├─ context-menu.tsx
│     │  │  ├─ conversation-status-icon.tsx
│     │  │  ├─ dicebear-avatar.tsx
│     │  │  └─ ...
│     │  ├─ hooks
│     │  │  ├─ use-infinite-scroll.ts
│     │  │  └─ use-mobile.ts
│     │  ├─ lib
│     │  │  └─ utils.ts
│     │  └─ styles
│     │     └─ globals.css
│     ├─ tsconfig.json
│     └─ tsconfig.lint.json
├─ tsconfig.json
└─ turbo.json

```