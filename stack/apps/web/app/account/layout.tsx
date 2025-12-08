import { SidebarProvider, SidebarInset } from "@workspace/ui/components/sidebar"
import { AccountSidebar } from "../../components/account-sidebar"

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AccountSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
