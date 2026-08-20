import { AvatarFallback, Avatar, AvatarImage } from "#components/ui/avatar";
import useUserStore from "../../store/UserStore";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Menu = () => {
  const { user } = useUserStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full cursor-pointer"
          >
            {" "}
            <Avatar>
              <AvatarImage src={user?.avatar} />

              <AvatarFallback>
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Plants</DropdownMenuItem>
          <DropdownMenuItem>Shelves</DropdownMenuItem>
          <DropdownMenuItem>Concerns</DropdownMenuItem>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const Navbar = () => {
  return (
    <nav className="h-16 border-b px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-primary">Potter.ai</h1>
      <div className="flex gap-4">
        <Menu />
      </div>
    </nav>
  );
};

export default Navbar;
