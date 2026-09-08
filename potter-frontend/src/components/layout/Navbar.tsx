import { AvatarFallback, Avatar, AvatarImage } from "#components/ui/avatar";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/UserStore";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef } from "react";
import { cn } from "#lib/utils";
import useAuth, { useLogout } from "@/routes/Login/useAuth";
import AddNewPlantButton from "#components/utils/AddNewPlantButton";

type MenuType = {
  label: string;
  path: string;
};
const menuItems: MenuType[] = [
  {
    label: "Plants",
    path: "/plants",
  },
  // {
  //   label: "Shelves",
  //   path: "/shelves",
  // },
  {
    label: "Concerns",
    path: "/concerns",
  },
  {
    label: "Logout",
    path: "/logout",
  },
];

const Menu = () => {
  const open = useRef<boolean | null>(null);
  const { user } = useUserStore();
  const navigate = useNavigate();

  const { mutate: logout } = useLogout();
  const { clearCurrentUser } = useAuth();

  const handleMenuClick = async (item: MenuType) => {
    if (item.path === "/logout") {
      await logout();
      clearCurrentUser();
      navigate("/login", { replace: true });
      return;
    }

    navigate(item.path);
    open.current = null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={() => (open.current = true)}
        render={
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full cursor-pointer"
          >
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
          {menuItems.map((item) => (
            <DropdownMenuItem
              onClick={() => handleMenuClick(item)}
              key={item.label}
              className={cn("cursor-pointer")}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const Navbar = () => {
  return (
    <>
      <nav className="px-4 py-2.5 flex items-center justify-end">
        <div className="flex gap-4">
          <AddNewPlantButton />
          <Menu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
