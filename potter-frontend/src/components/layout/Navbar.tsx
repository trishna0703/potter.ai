import { AvatarFallback, Avatar, AvatarImage } from "#components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
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
import { LeafIcon } from "@phosphor-icons/react";
import PendingEventsDrawer from "#components/utils/PendingEventsDrawer";

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
            className="relative size-9 rounded-full cursor-pointer"
          >
            <Avatar className={"size-9"}>
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
      <nav className="px-4 py-2.5 flex items-center justify-between md:justify-end">
        <Link
          to={"/plants"}
          aria-label="logo"
          className="flex md:hidden gap-2 items-center"
        >
          <LeafIcon size={32} weight="fill" color="var(--primary)" />
          <span className="text-title text-4xl font-bold">Potter.ai</span>
        </Link>
        <div className="flex gap-4">
          <PendingEventsDrawer />
          <AddNewPlantButton />
          <Menu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
