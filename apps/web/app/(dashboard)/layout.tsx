import { ThemeProvider } from "@/components/theme-provider";
import DashboardLayout from "../modules/auth/ui/dashboard/ui/layouts/dashboard-layout";
//import { AuthLayout } from "../modules/auth/ui/layouts/auth-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
      <DashboardLayout>
          {children}
      </DashboardLayout>
    </ThemeProvider>
    )
}

export default Layout;