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

