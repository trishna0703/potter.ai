import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "#components/ui/avatar";

import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
import { Button } from "#components/ui/button";

import { useCreatePlantOperations } from "../hooks/useCreatePlant";
import type { Plant } from "@/types/plantTypes";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { S3_URL } from "#lib/routes";

interface AddPlantProps {
  plant?: Partial<Plant>;
  open: boolean;
  onClose: () => void;
}

const LOCATION_TYPE = [
  { label: "Indoor", value: "INDOOR" },
  { label: "Outdoor", value: "OUTDOOR" },
];

const CreatePlantForm = ({ plant, open, onClose }: AddPlantProps) => {
  const isEditing = !!plant?.id;

  const {
    handleChange,
    handleSubmit,
    handleClose,
    formData,
    handleSelectChange,
    handleFileUpload,
  } = useCreatePlantOperations({ plant, onClose });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg">
        {/* Fixed Header */}
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>{isEditing ? "Edit" : "Add"} Plant</DialogTitle>

          <DialogDescription>
            Add some basic information about your plant.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <form
            id="create-plant-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <Avatar className="mx-auto size-24 rounded-full">
              <Input
                type="file"
                onChange={handleFileUpload}
                accept=".png, .jpg, .jpeg, .webp, .heic"
                className="absolute z-10 size-full cursor-pointer opacity-0"
              />

              <AvatarImage
                src={`${S3_URL}/${formData?.avatar ?? plant?.avatar}`}
                alt="Plant avatar"
              />

              <AvatarFallback>
                {formData?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") ||
                  formData?.species
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
              </AvatarFallback>
            </Avatar>

            {/* Name + Species */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              {/* Name */}
              <div className="w-full">
                <Label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium"
                >
                  What are we calling this beauty?
                </Label>

                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Maya"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>

              {/* Species */}
              <div className="w-full">
                <Label
                  htmlFor="species"
                  className="mb-1 block text-sm font-medium"
                >
                  What's the common name?{" "}
                  <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="species"
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  placeholder="e.g. Monstera Deliciosa"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="location_type">Where does this baby live?</Label>

              <Select
                id="location_type"
                name="location_type"
                items={LOCATION_TYPE}
                value={formData.location_type}
                onValueChange={(value) =>
                  handleSelectChange("location_type", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {LOCATION_TYPE.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Height + Pot Size */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              {/* Height */}
              <div className="w-full">
                <Label
                  htmlFor="height_cm"
                  className="mb-1 block text-sm font-medium"
                >
                  How tall is the queen (cm)?
                </Label>

                <Input
                  id="height_cm"
                  name="height_cm"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.height_cm}
                  onChange={handleChange}
                  placeholder="e.g. 45"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>

              {/* Pot size */}
              <div className="w-full">
                <Label
                  htmlFor="pot_size"
                  className="mb-1 block text-sm font-medium"
                >
                  What's the throne size? (Pot size)
                </Label>

                <Input
                  id="pot_size"
                  name="pot_size"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.pot_size}
                  onChange={handleChange}
                  placeholder="e.g. 8 (inches)"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="shrink-0 border-t bg-background px-6 py-4">
          <div className="flex justify-end gap-3">
            <Button type="button" onClick={handleClose} variant="destructive">
              Drop
            </Button>

            <Button type="submit" form="create-plant-form">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlantForm;
