import { SidebarProvider, SidebarInset } from "../components/ui/sidebar";
import AppSidebar from "./sidebar/AppSidebar";
import AppHeader from "./AppHeader";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative">
        <div className="flex min-w-xs flex-1 flex-col">
          <AppHeader />
          <div className="flex min-w-xs flex-1 flex-col gap-4 p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
