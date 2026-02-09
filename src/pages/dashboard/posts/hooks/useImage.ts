import { useState } from "react";
import { apiClient } from "../../../../api/config";

/**
 * Hook for managing image uploads with the new API endpoints
 */
function useImage() {
    const [loading, setLoading] = useState(false);

    /**
     * Create a new image post
     * @param date The date for the image
     * @param kaImage The Georgian language image
     * @param enImage The English language image
     * @returns Promise with the created image data
     */
    const createImage = async (
        date: Date,
        kaImage: File,
        enImage: File
    ) => {
        setLoading(true);

        try {
            // Create FormData for multipart/form-data request
            const formData = new FormData();
            
            // Format date as ISO string (YYYY-MM-DD)
            const formattedDate = date.toISOString().split('T')[0];
            formData.append("date", formattedDate);
            
            // Append images with language codes
            formData.append("FileKa", kaImage);
            formData.append("FileEn", enImage);

            const response = await apiClient.post("/Image/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update an existing image post
     * @param id The ID of the image to update
     * @param date The date for the image
     * @param kaImage The Georgian language image (optional if not changing)
     * @param enImage The English language image (optional if not changing)
     * @returns Promise with the updated image data
     */
    const updateImage = async (
        id: number,
        date: Date,
        kaImage?: File,
        enImage?: File
    ) => {
        setLoading(true);

        try {
            // Create FormData for multipart/form-data request
            const formData = new FormData();
            
            // Format date as ISO string (YYYY-MM-DD)
            const formattedDate = date.toISOString().split('T')[0];
            formData.append("date", formattedDate);
            
            // Append images with language codes if provided
            if (kaImage) {
                formData.append("FileKa", kaImage);
            }
            
            if (enImage) {
                formData.append("FileEn", enImage);
            }

            const response = await apiClient.put(`/Image/update/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data;
        } finally {
            setLoading(false);
        }
    };

    return { createImage, updateImage, loading };
}

export default useImage;