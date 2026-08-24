import { useRef} from "react";
import { Camera } from "lucide-react";
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
  onPhotoSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export default function PhotoPicker({
  children,
  onPhotoSelected,
  onOpenChange,
}: PhotoPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("photo upload");
    onPhotoSelected(e);
    onOpenChange?.(false);

    e.target.value = "";
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger className={"w-full"}>
          {children ?? (
            <span
              className={
                "rounded-full size-9 flex justify-center cursor-pointer items-center p-1 bg-primary text-card"
              }
            >
              <Camera className="size-5" />
            </span>
          )}
        </DropdownMenuTrigger>

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
