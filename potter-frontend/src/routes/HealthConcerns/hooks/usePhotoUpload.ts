import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import { getToday } from "#lib/utils";
import type { PlantPhotoUploadResponse } from "@/types/plantTypes";

const usePhotoUpload = () => {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return null;

    try {
      const { object_key } = await getPresignURL(file);

      if (!object_key) {
        return null;
      }

      return object_key as string;
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const getPresignURL = async (file: File) => {
    const { upload_url, object_key } = await apiClient(
      API_ENDPOINTS.PRESIGN_UPLOAD,
      {
        method: "POST",
        body: JSON.stringify({
          file_name: file.name,
          content_type: file.type,
        }),
      },
    );

    // 2. Upload directly to S3
    const uploadResponse = await fetch(upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image");
    }

    // 3. Return the S3 object information
    return {
      object_key,
    };
  };

  const handleUpload = async (
    url: string,
  ): Promise<PlantPhotoUploadResponse> => {
    return await apiClient(API_ENDPOINTS.UPLOAD, {
      method: "POST",
      body: JSON.stringify({ photo_url: url, captured_on: getToday() }),
    });
  };

  return {
    getPresignURL,
    handleFileChange,
    handleUpload,
  };
};

export default usePhotoUpload;
