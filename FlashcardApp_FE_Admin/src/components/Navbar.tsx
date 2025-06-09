// src/components/Navbar.tsx
import { Link } from "react-router-dom"; // THAY ĐỔI Ở ĐÂY
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menu, MountainIcon, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

// Component ListItem (không thay đổi)
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        {/* Sử dụng thẻ <a> bên trong ListItem cho react-router-dom Link bên ngoài */}
        <Link
          to={props.href || "#"} // THAY ĐỔI Ở ĐÂY: props.href sẽ là to của Link ngoài
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          // Bỏ {...props} ở đây nếu props.href đã được dùng cho `to`
          // và các props khác không dành cho thẻ <a> thuần
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

// Dữ liệu mẫu cho navigation (không thay đổi)
const navItems = [
  { to: "/", label: "Overview" }, // THAY ĐỔI: href -> to
  { to: "/about", label: "User List" },
  { to: "/services", label: "Subcription" },
  { to: "/contact", label: "Management" },
];

const components: { title: string; to: string; description: string }[] = [ // THAY ĐỔI: href -> to
  {
    title: "Sản phẩm A",
    to: "/products/a",
    description: "Mô tả chi tiết về sản phẩm A và các tính năng nổi bật.",
  },
  {
    title: "Sản phẩm B",
    to: "/products/b",
    description: "Khám phá sản phẩm B với công nghệ tiên tiến và thiết kế độc đáo.",
  },
  // ... thêm các components khác
];


export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "light");
  };

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="mr-6 flex items-center space-x-2"> {/* THAY ĐỔI: href -> to */}
          <MountainIcon className="h-6 w-6" />
          <span className="font-bold inline-block">Admin</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.label}>
                <Link to={item.to}> {/* THAY ĐỔI: href -> to, bỏ legacyBehavior & passHref */}
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Sản phẩm</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    // ListItem bây giờ sẽ render Link của react-router-dom bên trong nó
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.to} // ListItem vẫn nhận prop là href, nhưng sẽ dùng nó cho `to` của Link bên trong
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-x-2 ml-auto">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isLoggedIn ? (
             <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                 <Avatar className="h-8 w-8">
                   <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> {/* Thay bằng ảnh thật */}
                   <AvatarFallback>CN</AvatarFallback> {/* Thay bằng chữ cái đầu tên người dùng */}
                 </Avatar>
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" forceMount>
               <DropdownMenuLabel className="font-normal">
                 <div className="flex flex-col space-y-1">
                   <p className="text-sm font-medium leading-none">Tên Người Dùng</p>
                   <p className="text-xs leading-none text-muted-foreground">
                     user@example.com
                   </p>
                 </div>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem asChild><Link to="/profile">Hồ sơ</Link></DropdownMenuItem> {/* THAY ĐỔI */}
               <DropdownMenuItem asChild><Link to="/settings">Cài đặt</Link></DropdownMenuItem> {/* THAY ĐỔI */}
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={handleLoginLogout}>
                 Đăng xuất
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
          ) : (
            <Button onClick={handleLoginLogout} className="hidden md:inline-flex">Đăng nhập</Button>
          )}

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="mb-4">
                  <SheetTitle>
                    <Link to="/" className="flex items-center space-x-2"> {/* THAY ĐỔI */}
                        <MountainIcon className="h-6 w-6" />
                        <span className="font-bold">MyApp</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-3">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.label}>
                      <Link
                        to={item.to} // THAY ĐỔI
                        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  {!isLoggedIn && (
                     <SheetClose asChild>
                        <Button onClick={handleLoginLogout} className="w-full">Đăng nhập</Button>
                     </SheetClose>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

