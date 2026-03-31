import React from 'react'
import { SidebarProvider } from '@workspace/ui/components/sidebar'
import { AuthGuard } from '../../../components/auth-guard'
import { OrganizationGuard } from '../../../components/organization-guard'
import DashboardSidebar from '../components/dashboard-sidebar'
import { cookies } from 'next/headers'
import { ModeToggle } from '@/components/ModeToggle'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  // 'sidebar-open' are defined in shadcn/ui/components/sidebar/sidebar.tsx
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
     <AuthGuard>
      <OrganizationGuard>
        {/* <Provider> */}
          <SidebarProvider defaultOpen={defaultOpen}>
            <div className='absolute right-2 top-2'><ModeToggle /></div>
            <DashboardSidebar />
            <main className="flex flex-1 flex-col">
              {children}
            </main>
          </SidebarProvider>
        {/* </Provider> */}
      </OrganizationGuard>
    </AuthGuard>
  )
}

export default DashboardLayout