import { SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function SidebarFooterContent() {
  const { state } = useSidebar();

  return (
    <SidebarFooter>
      <div className={state === "expanded" ? "" : "flex items-center justify-center"}>
        {state === "expanded" ? <ThemeToggle variant="compact" /> : <ThemeToggle variant="icon" />}
      </div>
    </SidebarFooter>
  );
}
