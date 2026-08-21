import { useRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "#lib/utils";

type PhotoPickerProps = {
  onPhotoSelected: (
    event: React.ChangeEvent<HTMLInputElement, Element>,
  ) => void;
};

export default function PhotoPicker({ onPhotoSelected }: PhotoPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const open = useRef<boolean | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPhotoSelected(e);

    e.target.value = "";
    open.current = null;
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={() => (open.current = true)}
          render={
            <Button size={"icon"} className={"rounded-full size-9"}>
              <Camera className="size-5" />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => cameraInputRef.current?.click()}
              className={cn("cursor-pointer")}
            >
              Take Photo
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => fileInputRef.current?.click()}
              className={cn("cursor-pointer")}
            >
              Upload Photo
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Camera */}
      <Input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* File upload */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
