import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LogoutConfirmDialog from "@/features/auth/LogoutConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound, Cog } from "lucide-react";

export default function FolderCardDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-card-foreground hover:bg-accent/50 flex items-center justify-center rounded-full bg-transparent">
        <Avatar>
          <AvatarImage></AvatarImage>
          <AvatarFallback>NH</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 flex flex-col rounded-xl">
        <Button variant="ghost" className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent">
          <CircleUserRound />
          Profile
        </Button>
        <Button variant="ghost" className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent">
          <Cog />
          Settings
        </Button>
        <LogoutConfirmDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
