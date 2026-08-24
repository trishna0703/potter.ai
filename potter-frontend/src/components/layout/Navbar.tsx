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
import { useRef, useState } from "react";
import { cn, getToday } from "#lib/utils";
import PhotoPicker from "#components/utils/PhotoPicker";
import usePhotoUpload from "@/routes/HealthConcerns/hooks/usePhotoUpload";
import useIdentify from "#hooks/useIdentify";
import usePlantIdentityStore from "@/store/PlantIdentificationStore";
import IdentifiedPlantModal from "#components/utils/IdentifiedPlantModal";
import CreatePlantForm from "@/routes/Plants/components/CreatePlantForm";
import Overlay from "./Overlay";
import { useLogout } from "@/routes/Login/useAuth";
import usePlantStore from "@/store/PlantStore";

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
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const { mutate: logout } = useLogout();

  const handleMenuClick = async (item: MenuType) => {
    if (item.path === "/logout") {
      await logout();
      setUser(null);

      navigate("/login");
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
  const { handleFileChange } = usePhotoUpload();
  const { mutateAsync: runAIIdentification } = useIdentify();
  const { plantIdentity, setPlantIdentity } = usePlantIdentityStore();
  const [isLoadingIdentification, setIsLoadingIdentification] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { showForm, setShowForm } = usePlantStore();

  const onPhotoSelected = async (
    event: React.ChangeEvent<HTMLInputElement, Element>,
  ) => {
    setIsLoadingIdentification(true);
    let photo_url = await handleFileChange(event);

    if (photo_url) {
      let identified_data = await runAIIdentification({
        photo_url: photo_url,
        captured_on: getToday(),
      });
      setPlantIdentity({ ...identified_data, photo_url });
    }
    setIsLoadingIdentification(false);
    setIsOpen(true);
  };

  return (
    <>
      <nav className="h-16 border-b px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">Potter.ai</h1>
        <div className="flex gap-4">
          <PhotoPicker {...{ onPhotoSelected }} />
          <Menu />
        </div>
      </nav>

      {isLoadingIdentification ? <Overlay /> : null}

      <IdentifiedPlantModal
        createPlant={() => setShowForm(true)}
        {...{ isOpen, setIsOpen }}
      />

      <CreatePlantForm
        plant={{
          avatar_id: plantIdentity?.photo_id,
          added_on: getToday(),
          species: plantIdentity?.species,
          avatar: plantIdentity?.photo_url,
        }}
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </>
  );
};

export default Navbar;
