import React from 'react'
import { cookies } from 'next/headers'
import { Provider } from 'jotai';
import { SidebarProvider } from '@workspace/ui/components/sidebar'
import { AuthGuard } from '../../../auth/ui/components/auth-guard'
import { OrganizationGuard } from '../../../auth/ui/components/organization-guard'
import DashboardSidebar from '../components/dashboard-sidebar'
import { ModeToggle } from '@/components/ModeToggle'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  // 'sidebar-open' are defined in shadcn/ui/components/sidebar/sidebar.tsx
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  console.log("defaultOpen", defaultOpen)

  return (
     <AuthGuard>
      <OrganizationGuard>
        <Provider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <div className='absolute right-2 top-2'><ModeToggle /></div>
            <DashboardSidebar />
            <main className="flex flex-1 flex-col">
              {children}
            </main>
          </SidebarProvider>
        </Provider>
      </OrganizationGuard>
    </AuthGuard>
  )
}

export default DashboardLayout