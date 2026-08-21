import { Avatar, AvatarFallback, AvatarImage } from "#components/ui/avatar";
import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
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
import { Button } from "#components/ui/button";

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
  const isEditing = !!plant;

  const {
    handleChange,
    handleSubmit,
    handleClose,
    formData,
    handleSelectChange,
    handleFileUpload,
  } = useCreatePlantOperations({ plant, onClose });

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {isEditing ? "Edit" : "Add"} Plant
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add some basic information about your plant.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Avatar className="rounded-full size-24 mx-auto">
            <Input
              type="file"
              onChange={handleFileUpload}
              accept=".png , .jpg, .jpeg, .webp, .heic"
              className="opacity-0 absolute size-full z-1 cursor-pointer"
            />
            <AvatarImage
              src={`${S3_URL}/${formData?.avatar ?? plant?.avatar}`}
              alt="Plant avatar"
            />
            <AvatarFallback>
              {plant?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") ||
                plant?.species
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-4 justify-between">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="mb-1 block text-sm font-medium">
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
            <div>
              <Label
                htmlFor="species"
                className="mb-1 block text-sm font-medium"
              >
                What's the common name? <span className="text-red-500">*</span>
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
              value={formData.location_type ?? plant?.location_type}
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

          <div className="flex gap-4 justify-between">
            {/* Height */}
            <div>
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
            <div>
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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={handleClose} variant={"destructive"}>
              Drop
            </Button>

            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlantForm;
