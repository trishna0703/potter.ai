import apiClient from "#lib/client";
import useUserStore from "@/store/UserStore";
import { addDraftConcern } from "../utils/draft-concern-utils";
import { API_ENDPOINTS } from "#lib/endpoints";

const usePhotoUpload = () => {
  const { user } = useUserStore();
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return null;

    try {
      const { object_key } = await uploadPhoto(file);

      if (!object_key) {
        return null;
      }

      addDraftConcern({
        id: String(user?.id) ?? crypto.randomUUID(),
        object_key,
        created_at: new Date().toISOString(),
      });

      return object_key as string;
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const uploadPhoto = async (file: File) => {
    const response = await apiClient(API_ENDPOINTS.PRESIGN_UPLOAD, {
      method: "POST",
      body: JSON.stringify({
        file_name: file.name,
        content_type: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get presigned URL");
    }

    const { upload_url, object_key } = await response.json();

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

  return {
    uploadPhoto,
    handleFileChange,
  };
};

export default usePhotoUpload;
