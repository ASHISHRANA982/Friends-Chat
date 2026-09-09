export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "chart_image_upload");

  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;


  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = await response.json();

  return {
    imageUrl: data.secure_url,
    publicId: data.public_id,
  };
};