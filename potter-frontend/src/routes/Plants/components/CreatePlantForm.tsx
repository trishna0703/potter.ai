import { useState, type FormEvent } from "react";
import { useCreatePlant } from "../hooks/useCreatePlant";
import { toast } from "sonner";

interface AddPlantProps {
  open: boolean;
  onClose: () => void;
}

interface PlantFormData {
  name: string;
  species: string;
  location_type: "INDOOR" | "OUTDOOR" | undefined;
  height_cm: string;
  pot_size: string;
}

const initialFormData: PlantFormData = {
  name: "",
  species: "",
  location_type: undefined,
  height_cm: "",
  pot_size: "",
};

const CreatePlantForm = ({ open, onClose }: AddPlantProps) => {
  const { mutateAsync: createNewPlant } = useCreatePlant();
  const [formData, setFormData] = useState<PlantFormData>(initialFormData);

  if (!open) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const added_on = new Date().toISOString().split("T")[0];
    const payload = {
      name: formData.name || null,
      species: formData.species,
      location_type: formData.location_type ?? undefined,
      height_cm: formData.height_cm ? Number(formData.height_cm) : null,
      pot_size: formData.pot_size ? Number(formData.pot_size) : null,
      added_on
    };

    let newPlant = await createNewPlant(payload);
    toast(`${newPlant.name} has been added to your shelf.`);

    onClose();
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

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
            <h2 className="text-xl font-semibold">Add Plant</h2>
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
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Maya"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Species */}
          <div>
            <label htmlFor="species" className="mb-1 block text-sm font-medium">
              Species <span className="text-red-500">*</span>
            </label>

            <input
              id="species"
              name="species"
              type="text"
              value={formData.species}
              onChange={handleChange}
              placeholder="e.g. Monstera Deliciosa"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location_type"
              className="mb-1 block text-sm font-medium"
            >
              Location
            </label>

            <select
              id="location_type"
              name="location_type"
              value={formData.location_type}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            >
              <option value="">Select location</option>
              <option value="INDOOR">Indoor</option>
              <option value="OUTDOOR">Outdoor</option>
            </select>
          </div>

          {/* Height */}
          <div>
            <label
              htmlFor="height_cm"
              className="mb-1 block text-sm font-medium"
            >
              Height (cm)
            </label>

            <input
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
            <label
              htmlFor="pot_size"
              className="mb-1 block text-sm font-medium"
            >
              Pot Size
            </label>

            <input
              id="pot_size"
              name="pot_size"
              type="number"
              min="0"
              step="0.1"
              value={formData.pot_size}
              onChange={handleChange}
              placeholder="e.g. 8"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Add Plant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlantForm;
