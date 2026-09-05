import { Button } from "#components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "#components/ui/dialog";
import React from "react";

interface WarningDialogProps {
  children: React.ReactNode;
  open: boolean;
  onContinue: () => void;
  onCancel: (val: boolean) => void;
}
const WarningDialog = ({
  open,
  children,
  onCancel,
  onContinue,
}: WarningDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogDescription className={"p-4"}>
          Are you sure you want to delete it?
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => onCancel(false)} variant={"outline"}>
            No
          </Button>
          <Button onClick={onContinue} variant={"destructive"}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarningDialog;
