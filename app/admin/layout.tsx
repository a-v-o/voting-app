import { AppSidebar } from "@/components/AppSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-0 self-start">
        <header className="flex h-16 items-center gap-2 border-b px-4 self-start">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="w-full h-[90%] flex justify-center">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
