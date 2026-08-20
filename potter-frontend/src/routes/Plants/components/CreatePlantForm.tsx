import { useEffect, useState, type FormEvent } from "react";
import {
  useCreateOrUpdatePlant,
  useCreatePlantOperations,
} from "../hooks/useCreatePlant";
import { toast } from "sonner";
import type { Plant } from "@/types/plantTypes";

interface AddPlantProps {
  plant?: Plant;
  open: boolean;
  onClose: () => void;
}

const CreatePlantForm = ({ plant, open, onClose }: AddPlantProps) => {
  const isEditing = !!plant;
  const { handleChange, handleSubmit, handleClose, formData } =
    useCreatePlantOperations({ plant, onClose });

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
              {isEditing ? "Update" : "Add"} Plant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlantForm;
