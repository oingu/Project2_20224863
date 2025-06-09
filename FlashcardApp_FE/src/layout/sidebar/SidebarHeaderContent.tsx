import { SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import CustomSidebarTrigger from "@/components/custom-ui/CustomSidebarTrigger";

export default function SidebarHeaderContent() {
  const { state } = useSidebar();

  return (
    <div className={state === "expanded" ? "flex items-center justify-between p-2" : "flex items-center justify-center p-2"}>
      <SidebarHeader
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: state === "expanded" ? "" : "0",
          opacity: state === "expanded" ? 1 : 0,
          padding: state === "expanded" ? "" : "0",
          margin: state === "expanded" ? "" : "0",
        }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold select-none">Flashcards</h1>
        </div>
      </SidebarHeader>
      <div>{state === "expanded" ? <CustomSidebarTrigger variant="close" /> : <CustomSidebarTrigger variant="open" />}</div>
    </div>
  );
}
