- [create a monorepo project using shadcn](#create-a-monorepo-project-using-shadcn)
- [Convex integration](#convex-integration)
- [Clerk Authentication integration](#clerk-authentication-integration)
- [Clerk sign-in/up customize and organization](#clerk-sign-inup-customize-and-organization)
- [Error Tracking](#error-tracking)
- [AI Voice Assistant- Vapi](#ai-voice-assistant--vapi)
- [Dashboard Layout](#dashboard-layout)
- [Widget App](#widget-app)
  - [Widget Layout](#widget-layout)
  - [Widget session](#widget-session)
  - [widget screen Router - Jotai](#widget-screen-router---jotai)
  - [AI agents: add Convex Agent component](#ai-agents-add-convex-agent-component)
  - [Infinite Scroll](#infinite-scroll)
  - [Dicebear Avatar](#dicebear-avatar)
  - [Widget Inbox screen](#widget-inbox-screen)
  - [Dashboard Chat screen](#dashboard-chat-screen)
- [RAG- Retrieval Augmented Generation](#rag--retrieval-augmented-generation)
  - [Embeddings in backend](#embeddings-in-backend)
  - [Knowledge base](#knowledge-base)
  - [AI Search Tools](#ai-search-tools)
- [AWS Secrets Manager](#aws-secrets-manager)
- [Vapi plugin and Vapi data](#vapi-plugin-and-vapi-data)

----------------------------------------------------------

## create a monorepo project using shadcn

1. init project by using [shadcn with monorepo](https://ui.shadcn.com/docs/monorepo)
   - `pnpm dlx shadcn@latest init --monorepo`
     - create a new monorepo project with two workspaces: `web` and `ui`, and **Turborepo** as the build system
   - create another app(widget)
     1. copy 'web' folder and rename as 'widget'
     2. change to `"name": "widget",` of '\apps\widget\package.json'
     3. `pnpm install`
2. add shadcn component to project
  1. `cd packages\ui`
  2. `pnpm dlx shadcn@latest add input`
     1. will create 1 file: '\packages\ui\src\components\input.tsx'
     2. `pnpm dlx shadcn@latest add --all`   <-- add all components
3. [Creating an Internal Package](https://turborepo.dev/docs/crafting-your-repository/creating-an-internal-package)
  1. create 'packages\math' folder
  2. create '\packages\math\package.json'
  3. create '\packages\math\tsconfig.json'
  4. create '\packages\math\src\a.ts'
  5. add ` "@workspace/math": "workspace:*",` to 'apps\web\package.json'
  6. `pnpm install`   <-- **importance**
  7. using in other app
     1. add following codes to 'apps\web\app\page.tsx'
     2. `import { add } from "@workspace/math/add";`
     3. `<p>{add(1, 2)}</p>`

- References
  - [turborepo](https://turborepo.dev/docs): monorepo build system
  - [shadcn in monorepo](https://ui.shadcn.com/docs/monorepo)

```json
// package.json
{
  "name": "@workspace/math",    // change repo to workspace
  "type": "module",
  "scripts": {
    "dev": "tsc --watch",
    "build": "tsc"
  },
  "exports": {
    "./add": {
      "types": "./src/add.ts",
      "default": "./dist/add.js"
    }
  },
  "devDependencies": {
    "@workspace/typescript-config": "workspace:*",   // change repo to workspace
    "typescript": "latest"
  }
}
//tsconfig.json
{
  "extends": "@workspace/typescript-config/base.json",   // change repo to workspace
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
//src/add.ts
export const add = (a: number, b: number) => a + b;
//using math inter package in app, such as apps\web\app\page.tsx
import { add } from "@workspace/math/add";
   //...
<p>{add(2, 3)}</p>
```

[🚀back to top](#top)

## Convex integration

1. `pnpm build`  👉 check whether there is missing dependencies
   1. run `pnpm -F eslint-config add --save-dev @eslint/js` if missing dependencies
2. setup Convex backend: refer to https://github.com/get-convex/turbo-expo-nextjs-clerk-convex-monorepo
   1. create 'packages\backend' folder
   2. create 'packages\backend\package.json' file
   3. `pnpm install`
   4. `pnpm -F backend add convex`
   5. `pnpm -F backend run setup` --> choose create new project
      1. 👉will create '.env.local' file
      2. 👉will create a 'convex' folder
3. Test Convex:
   1. create 'packages\backend\convex\schema.ts' file
   2. create 'packages\backend\convex\users.ts' file
   3. `turbo dev`
   4. check [convex dashboard](https://dashboard.convex.dev/) whether there is table and function
4. using convex backend api in web/app: refer to [Convex+Next.js-official](https://docs.convex.dev/quickstart/nextjs)
   1. modification in convert/backend
      1. create 'packages\backend\tsconfig.json'
      2. modify 'packages\backend\package.json'
   2. add convex to web/app
      1. `pnpm -F web add convex`  👉 convex will be added to 'apps\web\package.json'
      2. `pnpm install`  👉 install dependency of convex for web/app
   3. modification in web/app
      1. add `"@workspace/backend": "workspace:*",` to 'apps\web\package.json'
      2. add `"@workspace/backend/*": ["../../packages/backend/convex/*"]` to 'apps\web\tsconfig.json'
      3. create 'apps\web\.env.local'
      4. add `ConvexProvider` to 'apps\web\components\providers.tsx'
      5. modify 'apps\web\app\page.tsx' to use backend api, query data and display data
5. using convex backend api in widget/app
   1. add convex to web/app
      1. `pnpm -F widget add convex`  👉 convex will be added to 'apps\web\package.json'
      2. `pnpm install`  👉 install dependency of convex for web/app
   2. modification in widget/app
      1. add `"@workspace/backend": "workspace:*",` to 'apps\widget\package.json'
      2. add `"@workspace/backend/*": ["../../packages/backend/convex/*"]` to 'apps\widget\tsconfig.json'
      3. create 'apps\widget\.env.local'
      4. add `ConvexProvider` to 'apps\widget\components\providers.tsx'
      5. modify 'apps\widget\app\page.tsx' to use backend api, query data and display data

```mermaid
sequenceDiagram
    autonumber
    participant F as Frontend Page
    participant P as ConvexProvider
    participant C as Convex API
    F->> P: useQuery(api.users.getUsers)
    P->> C: Fetch all users
    C-->>P: return user lists
    P-->>F: Provide users data
    F->> P: useMutation(api.users.addUser)
    P->> C: Add user
    C-->>P: return new UserID
    P-->>F: Update users data(re-fetch or update)
```

```ts
// packages\backend\package.json
{
  "name": "@workspace/backend",
  "type": "module",
  "scripts": {
    "dev": "convex dev",
    "setup": "convex dev --until-success"
  },
  "exports": {
    "./convex": "./convex/*.ts"
  },
  "devDependencies": {
    "@workspace/typescript-config": "workspace:*",
    "typescript": "latest"
  },
  "dependencies": {
    "convex": "^1.32.0"
  }
}
// packages\backend\tsconfig.json
{
  "extends": "@workspace/typescript-config/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@workspace/backend/*": ["./convex/*"]
    }
  },
  "include": ["."],
  "exclude": ["node_modules"]
}
```

[🚀back to top](#top)

## Clerk Authentication integration

1. **backend side**
   1. `pnpm -F backend add --save-dev @types/node`
   2. [Clerk Dashboard](https://dashboard.clerk.com/)
      1. Create an application
      2. Activate the Convex integration  👉 click button 'Activate Convex integration' in new application
      3. add 'jwt template'
         - ![JWT-template](JWT-template.png)
         - copy **'Issuer'** url to `CLERK_JWT_ISSUER_DOMAIN` in 'packages\backend\.env.local'
   3. [convex dashboard](https://dashboard.convex.dev/)
      - add environment variables
      - ![clerk-integration](clerk-integration.png)
   4. Configure Convex with the Clerk issuer domain
      1. Create 'packages\backend\convex\auth.config.ts'
      2. `turbo dev'   👉  - sync configuration to  backend
2. **web app side**
   1. `pnpm -F web add @clerk/nextjs`
   2. In the Clerk Dashboard, navigate to the API keys page, copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` environment variables to 'apps\web\.env.local'
   3. Add Clerk middleware   👉 Create a 'apps\web\middleware.ts'
   4. Configure ConvexProviderWithClerk  👉 create 'apps\web\components\ConvexClientProvider.tsx`
   5. Wrap app in Clerk and Convex(ConvexProviderWithClerk)  👉 modify 'apps\web\app\layout.tsx'
   6. Show UI based on authentication state  👉 modify 'apps\web\app\page.tsx'
   7. Customize you own sign-in/sign-up(nextjs+clerk)
      1. modify 'apps/web/middleware.ts', add `isPublicRoute`
      2. create 'apps/web/app/(auth)/sign-in/[[...sign-in]]/page.tsx'
      3. create 'apps/web/app/(auth)/sign-up/[[...sign-up]]/page.tsx'
      4. create 'apps/web/app/(auth)/layout.tsx'
      5. adding to 'apps/web/.env.local'
         1. `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
         2. `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/`
         3. ...
      6. https://clerk.com/docs/nextjs/guides/development/custom-sign-in-or-up-page
- **References**
  - https://docs.convex.dev/auth/clerk#nextjs
  - https://clerk.com/docs/nextjs/getting-started/quickstart

[🚀back to top](#top)

## Clerk sign-in/up customize and organization

1. customization of sign-in/sign-up
   1. adjust codes structure
   2. create folders and files according to following
2. organization
   1. add organization codes in middleware('apps\web\proxy.ts')
   2. add `OrganizationSwitcher` to 'apps\web\app\(dashboard)\page.tsx'
   3. add `orgId` to JWT templates in clerk dashboard
   4. ![organization](organization.png)

```
├── 📂 apps\web\app\
│     ├──  📂 (auth)\
│     │    ├──  📂 org-selection\[[...org-selection]]\
│     │    │      └── 📄 page.tsx
│     │    ├──  📂 sign-in\[[...sign-in]]\
│     │    │      └── 📄 page.tsx
│     │    ├──  📂 sign-up\[[...sign-up]]\
│     │    │      └── 📄 page.tsx
│     │    └── 📄 layout.tsx                         -> authentication page layout
│     ├──  📂 (dashboard)\
│     │    ├── 📄 layout.tsx                         -> homepage layout
│     │    └── 📄 page.tsx                           -> home page
│     ├──  📂 module\auth\ui\
│     │       ├──  📂 components\
│     │       │      ├── 📄 auth-guard.tsx
│     │       │      └── 📄 organization-guard.tsx
│     │       ├──  📂 layouts\
│     │       │      └── 📄 auth-layout.tsx           -> authentication page layout
│     │       ├──  📂 views\
│     │       │      ├── 📄 org-selection-view.tsx
│     │       │      ├── 📄 sign-in-view.tsx
│     │       │      └── 📄 sign-up-view.tsx
-----------------------
├── 📂 packages\backend\convex\
│     ├── 📄 user.ts
```

## Error Tracking

1. `cd apps/web`
2. `pnpm dlx @sentry/wizard@latest -i nextjs`
3. add `SENTRY_AUTH_TOKEN` to 'apps\web\.env.local'
4. add `.env.sentry-build-plugin` to '.gitignore'
- [sentry with nextjs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

[🚀back to top](#top)

## AI Voice Assistant- Vapi

1. setup Vapi in [Vapi dashboard](https://dashboard.vapi.ai/)
   - add knowledge base
   - add tools
   - following steps of [Vapi Inbound customer support](https://docs.vapi.ai/assistants/examples/inbound-support)
2. integrate Vapi in apps/widget
   1. `pnpm -F widget add @vapi-ai/web`
   2. create hook(`useVapi`) in 'apps\widget\modules\widget\hooks\use-vapi.ts'
      1. create a **new public API** in Vapi dashboard and use it as `vapiInstance` in 'use-vapi.ts
         1. ![vapiInstance](vapiInstancePublicKey.png)
      2. copy **Assistants ID** and use it `startCall()` function in in 'use-vapi.ts
   3. use hook(`useVapi`) in 'apps\widget\app\page.tsx'
- [Vapi Inbound customer support](https://docs.vapi.ai/assistants/examples/inbound-support)
- https://docs.vapi.ai/guides

```mermaid
flowchart TB
    User["User"] -- B2B SaaS App request --> W@{ label: "Whitelabel Vapi's API key" }
    W -- Bring your owe key method --> API["API key"]
    VAPI["Vapi API"] -- Single Tenant --> API
    API --> P["Phone number"]
    API --> Assistants
    W --> Tools
    API -- Assign API key to Tenant-N --> App1
subgraph App["Assign API key to Tenant-n"]
  subgraph App1["Assign API key to Tenant-1"]
    P1h("Phone number")
    A1("Assistants")
    T1("Tools")
  end
  subgraph App2["Assign API key to Tenant-2"]
    P2("Phone number")
    A2("Assistants")
    T2("Tools")
  end
end
```

[🚀back to top](#top)

## Dashboard Layout

1. `cd apps/web`
2. `pnpm dlx shadcn@4.0.0 add --all`
3. [theme toggle](https://ui.shadcn.com/docs/dark-mode/next)
   1. create 'apps\web\components\ModeToggle.tsx'
   2. add `ThemeProvider` to 'apps\web\app\(dashboard)\layout.tsx'
   3. add `ModeToggle` to 'apps\web\app\modules\auth\ui\dashboard\ui\layouts\dashboard-layout.tsx'
4. dashboard layout
   1. back to root directory and run `pnpm install`
   2. create directories and files according following

```
├── 📂 apps\web\app\(dashboard)\
│     ├──  📂 conversations\
│     │    └── 📄 page.tsx
│     ├──  📂 customization\
│     │    └── 📄 page.tsx
│     ├──  📂 files\
│     │    └── 📄 page.tsx
│     ├──  📂 integrations\
│     │    └── 📄 page.tsx
│     ├──  📂 plugins\
│     │    └──  📂 vapi\
│     │         └── 📄 page.tsx
│     ├── 📄 page.tsx
│     └── 📄 layout.tsx
```

[🚀back to top](#top)

## Widget App

```mermaid
sequenceDiagram
        actor User
        participant Widget
        participant Backend
        participant DB@{ "type": "database" }
        User->>Widget: Enter name/email
        Widget->>Widget: Collect browser metadata
        Widget->>Backend: create contact session
        Backend->>DB: store session(24 hours expiry)
        DB-->>Backend: contactSessionId
        Backend-->>Widget: contactSessionId
        Widget->>Widget: store in localstorage
        User->>Widget: Navigate to widget selection
        Widget->>Backend: validate session
        Backend->>DB: check expiry
        alt [<4 hours remaining]
            DB-->Backend: Refresh session
        end
```

### Widget Layout

```
├── 📂 apps\web\widget\modules\widget\
│     ├──  📂 hooks\
│     │    └── 📄 page.tsx
│     ├──  📂 ui\
│     │    └──  📂 components\
│     │         ├── 📄 widget-footer.tsx
│     │         └── 📄 widget-header.tsx
│     ├──  📂 screens\
│     │    └── 📄 widget-auth-screen.tsx
│     ├──  📂 views\
│     │    └── 📄 widget-view.tsx
```

### Widget session

1. 'contactSession' table
   1. add `contactSession` to 'packages\backend\convex\schema.ts'
   2. `turbo dev`    ->  generate contact Session schema
2. 'contactSession' -> 'createContactSession' functions
   1. `pnpm -F widget add zod react-hook-form @hookform/resolvers`
   2. create 'packages\backend\convex\public\contactSessions.ts'
3. widget Auth screen
   1. create 'apps\widget\modules\widget\ui\screens\widget-auth-screen.tsx'

[🚀back to top](#top)

### widget screen Router - Jotai

1. `pnpm -F widget add jotai jotai-family`
2. add `provider` to 'apps\widget\components\providers.tsx'
3. create widget atoms --> 'apps\widget\modules\widget\ui\atoms\widget-atoms.ts'
4. define screens in 'apps\widget\modules\widget\ui\screens' folder
5. create screen router in 'apps\widget\modules\widget\ui\views\widget-view.tsx'
6. Widget Loading part
   1. create error screen
      1. add `errorMessageAtom` in 'apps\widget\modules\widget\ui\atoms\widget-atoms.ts'
      2. create '/apps/widget/modules/widget/ui/screens/widget-error-screen.tsx'
      3. add `<WidgetErrorScreen />` to 'apps\widget\modules\widget\ui\views\widget-view.tsx'
   2. add convex function `organization.getOne()` and `contactSessions.validate()`
      1. `pnpm -F backend add @clerk/backend`
      2. add `validate` to 'packages\backend\convex\public\contactSessions.ts'
      3. create 'apps\widget\modules\widget\ui\screens\widget-auth-screen.tsx'
   3. create Loading screen
      1. create `organizationId`
         1. create 'packages\backend\convex\public\organization.ts'
         2. add `CLERK_SECRET_KEY` to 'packages\backend\.env.local'(can copy from 'apps\web\.env.local')
         3. go to [convex dashboard](https://dashboard.convex.dev/)  --> setting --> Environment Variables --> add button: add `CLERK_SECRET_KEY`
      2. validation `organizationId`     --> verify organization
         1. in [convex dashboard](https://dashboard.convex.dev/):  functions --> choose 'organization:validate' --> 'Run Function' button
         2. https://docs.convex.dev/functions/actions
      3. Loading `contactSessionId`   --> verify contact session
      4. create 'apps\widget\modules\widget\ui\views\widget-loading-screen.tsx'
         1. add loading screen to 'apps\widget\modules\widget\ui\views\widget-view.tsx'
   4. create Conversation(selection) screen
      1. add `conversations` to schema('packages\backend\convex\schema.ts')
         1. `turbo dev` --> prepare, ready and validate schema
      2. add `conversations` functions(create 'packages\backend\convex\public\conversations.ts')
         1. `turbo dev` --> prepare, ready and validate functions
         2. https://docs.convex.dev/functions/error-handling/application-errors
      3. add selection screen
         1. create 'apps\widget\modules\widget\ui\views\widget-selection-screen.tsx'
         2. add selection screen to 'apps\widget\modules\widget\ui\views\widget-view.tsx'
         3. add `` to 'packages\backend\convex\schema.ts'
            1. create `conversations` table
         4. create 'packages\backend\convex\public\conversations.ts'
            1. create `createConversation`, `getOneConversation` and `getManyConversations` functions
         5. create apps\widget\modules\widget\ui\views\widget-chat-screen.tsx'
            1. user-defined button- add `transparent` to `variants` in 'packages\ui\src\components\button.tsx'

```mermaid
sequenceDiagram
        actor User
        participant Widget as WidgetSelectionScreen
        participant Backend as Backend(convex)
        participant WidgetC as WidgetChatScreen
        User->>Widget: click "start chat"
        Widget->>Backend: create {[organizationId, contactSessionId]}
        Backend-->>Widget: returns conversationId
        Widget->>WidgetC: sets conversationIdAtom, switches screen
        WidgetC->>Backend: getOneConversation(conversationId,contactSessionId)<br>-->>WidgetC: returns conversation summary)
        WidgetC-->>User: Displays chat UI
```

[🚀back to top](#top)

### AI agents: add Convex Agent component

1. installation and setup
   1. `pnpm -F backend add  @convex-dev/agent`
   2. create 'packages\backend\convex\convex.config.ts'
   3. run `convex dev` to generate code for the component
      1. note: run `pnpm -F backend add convex-helpers` if there is error
2. install AI SDK and choose AI provider(Gemini, OpenAI, Anthropic...)
   1. `pnpm -F backend add ai`             ➡️  AI SDK package
   2. `pnpm -F backend add @ai-sdk/openai` ➡️  [OpenAI Provider](https://ai-sdk.dev/providers/ai-sdk-providers/openai)
   3. add `OPENAI_API_KEY` to 'packages\backend\.env.local'
   4. create AI agent(OpenAI agent)  ➡️   'packages\backend\convex\system\ai\agents\supportAgent.ts'
      - [Building AI Agents with Convex](https://docs.convex.dev/agents)
3. create ThreadId in backend
   1. delete all old conversations
   2. update `threadId` in `createConversation` function of 'packages\backend\convex\public\conversations.ts'
4. add AI-related components library (front end)
   1. [kibo-ui](https://www.kibo-ui.com/): included AI component based on shadcn
   2. [AI element component](https://elements.ai-sdk.dev/components/message)
   3. copy 'echo-assets/ui/components/ai' to 'packages\ui\src\components\ai\'
      1. `pnpm -F ui add use-stick-to-bottom @radix-ui/react-use-controllable-state react-markdown remark-gfm `
5. create [internal functions](https://docs.convex.dev/functions/internal-functions) in backend
   1. create 'packages\backend\convex\system\contactSessions.ts'  ---> internal function `getOneSession`
   2. create 'packages\backend\convex\system\conversation.ts'     ---> internal function `getByThreadId`
6. create messages(packages\backend\convex\public\messages.ts)
7. AI-related components(front end)
   1. `pnpm -F widget add @convex-dev/agent`
   2. modify 'apps\widget\modules\widget\ui\screens\widget-chat-screen.tsx'

[🚀back to top](#top)

### Infinite Scroll

1. create `useInfiniteScroll` hook  <--  'packages\ui\src\hooks\use-infinite-scroll.ts'
2. create 'InfiniteScrollTrigger' component <--  ' packages\ui\src\components\InfiniteScrollTrigger.tsx'

### Dicebear Avatar

1. `pnpm -F ui add @dicebear/collection @dicebear/core`
   1. [dicebear- avatar library with 30+ SVG styles](https://www.dicebear.com/)
2. create 'packages\ui\src\components\dicebear-avatar.tsx'
3. add to 'apps\widget\modules\widget\ui\screens\widget-chat-screen.tsx'

[🚀back to top](#top)

### Widget Inbox screen

1. create `conversation.getManyConversations` function   <-- 'packages\backend\convex\public\conversations.ts'
2. create 'widgetInboxScreen' component      <--  'apps\widget\modules\widget\ui\screens\widget-inbox-screen.tsx'
   1. `pnpm -F widget add date-fns`
3. modify 'apps\widget\modules\widget\ui\components\widget-footer.tsx'
4. create 'ConversationStatusIcon' component   <--  'packages\ui\src\components\conversation-status-icon.tsx'

[🚀back to top](#top)

### Dashboard Chat screen

1. add Jotai provider to 'apps\web\modules\dashboard\ui\layouts\dashboard-layout.tsx'
   1. create 'apps\web\modules\dashboard\atoms.ts' and 'apps\web\modules\dashboard\constant.ts'
2. create `ConversationIdView` view
   1. `pnpm -F web add countries-and-timezones`
   2. create a file 'apps\web\lib\country-utils.ts'
   3. `pnpm -F web add zod react-hook-form @hookform/resolvers`
   4. `pnpm -F web add @convex-dev/agent`
   5. Conversation page layout
      1. conversation layout page   <---  create a file 'apps\web\modules\dashboard\ui\layouts\conversations-layout.tsx'
      2. conversation home page   <---  create a file 'apps\web\modules\dashboard\ui\views\conversations-view.tsx'
      3. conversation id page   <---  create a file 'apps\web\modules\dashboard\ui\views\conversation-id-view.tsx'
      4. conversation id layout page   <---  create a file 'apps\web\modules\dashboard\ui\components\conversations-panel.tsx'
   6. conversation route -->
      1. create a file 'apps\web\app\(dashboard)\conversations\[conversationId]\page.tsx'
      2. create a file 'apps\web\app\(dashboard)\conversations\layout.tsx' and 'apps\web\app\(dashboard)\conversations\page.tsx'
3. create `enhanceResponse` function, modify `createMessage` function in 'packages\backend\convex\public\messages.ts'
4. modify `getManyConversations` function in 'packages\backend\convex\public\messages.ts'
5. Create Status public components
   1. create 'packages\ui\src\components\hint.tsx'
   2. create 'packages\ui\src\components\conversation-status-icon.tsx'
   3. add `tertiary` and `warning` to 'packages\ui\src\components\button.tsx'

```
├─ web
│  ├─ app
│  │  └─ (dashboard)
│  │     └─ conversations
│  │        ├─ [conversationId]
│  │        │     └─ page.tsx
│  │        ├─ layout.tsx
│  │        └─ page.tsx
│  ├─ modules
│  │  └─ dashboard
│  │     ├─ ui
│  │     │  ├─ components
│  │     │  │  ├─ conversation-status-button.tsx
│  │     │  │  └─ conversations-panel.tsx
│  │     │  ├─ layouts
│  │     │  │  └─ conversations-layout.tsx
│  │     │  └─ views
│  │     │     ├─ conversation-id-view.tsx
│  │     │     └─ conversations-view.tsx
│  │     ├─ atoms.ts
│  │     └─ constants.ts
```

[🚀back to top](#top)

## RAG- Retrieval Augmented Generation

### Embeddings in backend

1. `pnpm -F backend add @convex-dev/rag`
2. modify 'packages\backend\convex\convex.config.ts', add `rag`
3. create 'packages\backend\convex\lib\extractTextContent.ts'
4. create 'packages\backend\convex\system\ai\rag.ts'
   1. [OpenAI embedding models support](https://ai-sdk.dev/providers/ai-sdk-providers/openai)
5. create 'packages\backend\convex\private\files.ts'
   1. `addFile`, `deleteFile` functions
6. References
   1. [RAG (Retrieval-Augmented Generation) with the Agent component](https://docs.convex.dev/agents/rag)
   2. [@convex-dev/rag](https://www.convex.dev/components/rag)
   3. [@convex-dev/agent](https://www.convex.dev/components/agent)
      - https://docs.convex.dev/agents
   4. [Uploading files via upload URLs](https://docs.convex.dev/file-storage/upload-files)
   5. https://ai-sdk.dev/providers/ai-sdk-providers/openai

[🚀back to top](#top)

### Knowledge base

1. add `listFile` function to 'packages\backend\convex\private\files.ts'
2. Create File View component
   1. create 'apps\web\modules\files\ui\views\files-view.tsx'
   2. add `FileView` to 'apps\web\app\(dashboard)\files\page.tsx'
   3. [Creating a tool with a Convex context](https://docs.convex.dev/agents/tools)
3. create Convex RAG component
   1. table  - 'apps\web\modules\files\ui\views\files-view.tsx'
   2. Upload dialog - 'apps\web\modules\files\ui\components\upload-file-dialog.tsx'
      - need 'dropzone.tsx' in ui, `pnpm -F ui add react-dropzone`
      - refer to https://www.kibo-ui.com/components/dropzone
   3. delete dialog - 'apps\web\modules\files\ui\components\delete-file-dialog.tsx'
   4. https://www.convex.dev/components/rag

[🚀back to top](#top)

### AI Search Tools

1. create `searchTool` function   <-- 'packages\backend\convex\system\ai\tools\search.ts'
   1. upload file such as 'faq.txt'
   2. go to 'http://localhost:3001/?organizationId=xxx' to ask question in 'faq.txt'
   3. should got answer in 'faq.txt'
2. limit answer in local knowledge
   1. create `SUPPORT_AGENT_PROMPT` in 'packages\backend\convex\system\ai\constants.ts`
   2. add `SUPPORT_AGENT_PROMPT` to `content` 'packages\backend\convex\system\ai\tools\search.ts'
3. improve prompts --> make sure questions are in the knowledge base
   1. create 'packages\backend\convex\system\ai\constants.ts'
   2. add `searchTool` to `createMessage` function 'packages\backend\convex\public\messages.ts'
4. Debug tips
   1. `pnpm -F backend add @convex-dev/agent-playground`
   2. create 'packages\backend\convex\playground.ts'
   3. go to 'packages/backend' directory
   4. `pnpm dlx convex run --component agent apiKeys:issue`  -->  to generate key, copy it
   5. `pnpm dlx  @convex-dev/agent-playground`
   6. https://docs.convex.dev/agents/playground

[🚀back to top](#top)

## AWS Secrets Manager


[🚀back to top](#top)

## Vapi plugin and Vapi data

```mermaid
sequenceDiagram
        participant User
        participant VapiView as VapiView(FrontEnd)
        participant Backend as Backend API
        participant AWS as AWS Secrets Manager
        User->>VapiView: click "connect" & submit API keys
        VapiView->>Backend: upsert secret mutation(API keys)
        Backend->>AWS: store API keys(upsertSecret)
        AWS-->>Backend: Success/Failure
        Backend->>Backend: update plugin record in DB
        Backend-->>VapiView: Success response
        VapiView-->>User: Show toast notification & update UI
```

> References
- https://www.codewithantonio.com/workshops/build-and-deploy-a-b2b-saas-ai-support-platform
- [Build and Deploy a B2B AI SaaS Support Platform | Next.js 15, React, Convex, Turborepo, Vapi, AWS](https://www.youtube.com/watch?v=CAr02YlEJUc)
- https://github.com/code-with-antonio/next15-echo
- https://www.codewithantonio.com/workshops/build-and-deploy-a-b2b-saas-ai-support-platform/
- https://github.com/AntonioErdeljac/echo-assets

- [The Ultimate Convex Crash Course](https://www.youtube.com/watch?v=_Qqvoq8JVXM)
- [The Complete Convex Crash Course](https://www.youtube.com/watch?v=DpZIkkYPd5I)
