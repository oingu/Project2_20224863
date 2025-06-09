import { SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { routes } from "@/routes/router";
import React from "react";
import { NavLink } from "react-router-dom";

const sidebarItemActiveStyles = "rounded-lg bg-neutral-200 font-bold dark:bg-neutral-800";
const sidebarItemHoverStyles = "rounded-lg transition-colors duration-200";

export default function SidebarMenuList() {
  const sidebarItems = routes.filter((route) => route.showInSidebar);
  
  return (
    <SidebarContent>
        <SidebarMenu className="p-2">
          {sidebarItems.map((route) => (
            <NavLink key={route.path} to={route.path} className={({ isActive }) => (isActive ? sidebarItemActiveStyles : sidebarItemHoverStyles)}>
              {({ isActive }) => (
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    {route.icon &&
                      React.cloneElement(route.icon as React.ReactElement<{ className?: string }>, {
                        className: isActive ? "stroke-[2.5px]" : "stroke-[2px]",
                      })}
                    <span className="select-none">{route.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </NavLink>
          ))}
        </SidebarMenu>
      </SidebarContent>
  );
}