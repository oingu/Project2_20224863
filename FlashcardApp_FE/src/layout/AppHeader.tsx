import { useLocation } from "react-router-dom";
import { getRouteByPath } from "@/routes/router";
import { useIsMobile } from "@/hooks/useMobile";
import CustomSidebarTrigger from "../components/custom-ui/CustomSidebarTrigger";
import { useEffect, useState } from "react";
import { folderService } from "@/services/folderService";
import UserDropdownMenu from "./sidebar/UserDropdownMenu";

export function usePageTitle() {
  const location = useLocation();
  const currentRoute = getRouteByPath(location.pathname);
  const [pageTitle, setPageTitle] = useState<string>("");

  useEffect(() => {
    if (!currentRoute) return;

    const getFolderName = async () => {
      if ("type" in currentRoute && currentRoute.type === "folder" && "slug" in currentRoute) {
        const folder = await folderService.getFolderBySlug(currentRoute.slug);
        setPageTitle(folder ? folder.name : "Folder");
      } else {
        setPageTitle(currentRoute.title || "");
      }
    };
    getFolderName();
  }, [currentRoute]);

  if (!currentRoute) {
    return null;
  }

  return pageTitle;
}

export default function AppHeader() {
  const pageTitle = usePageTitle();
  const isMobile = useIsMobile();

  return (
    <div className="frosted-glass sticky top-0 z-10 flex shrink-0 items-center justify-between border-b px-4 py-4 md:px-6">
      <div className="flex items-center space-x-2">
        {isMobile && (
          <div className="-ml-2">
            <CustomSidebarTrigger variant="open" />
          </div>
        )}
        <h1 className="text-3xl font-semibold select-none">{pageTitle}</h1>
      </div>
      <UserDropdownMenu />
    </div>
  );
}
