import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider";
//import { Toaster } from "@workspace/ui/components/sonner";
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'

import { cn } from "@workspace/ui/lib/utils";
import { TooltipProvider } from "@workspace/ui/components/tooltip";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", fontSans.variable)}
    >
      <body>
          <ClerkProvider>
            <ConvexClientProvider>
              <TooltipProvider>
                {/* <Toaster /> */}
                {children}
              </TooltipProvider>
            </ConvexClientProvider>
          </ClerkProvider>
      </body>
    </html>
  )
}


