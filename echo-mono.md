   3. create Loading screen
      1. create `organizationId`
         1. create 'packages\backend\convex\public\organization.ts'
         2. add `CLERK_SECRET_KEY` to 'packages\backend\.env.local'(can copy from 'apps\web\.env.local')
         3. go to [convex dashboard](https://dashboard.convex.dev/)  --> setting --> Environment Variables --> add button: add `CLERK_SECRET_KEY`
      2. validation `organizationId`     --> verify organization
         1. in [convex dashboard](https://dashboard.convex.dev/):  funtions --> choose 'organization:validate' --> 'Run Function' button
         2. https://docs.convex.dev/functions/actions
      3. Loading `contactSessionId`   --> verify contact session
      4. create 'apps\widget\modules\widget\ui\views\widget-loading-screen.tsx'
