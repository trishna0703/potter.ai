import { Button } from "#components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#components/ui/dialog";
import { Input } from "#components/ui/input";
import { useState } from "react";

const UploadPhotoModal = ({
  selectFile,
  title,
  description,
  btnText,
}: {
  title: string;
  description?: string;
  btnText: string;
  selectFile: (
    event: React.ChangeEvent<HTMLInputElement, Element>,
  ) => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement, Element>,
  ) => {
    await selectFile(e);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant={"secondary"}>{btnText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>
          <Input
            type="file"
            onChange={handleChange}
            accept=".png , .jpg, .jpeg, .webp, .heic"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPhotoModal;
