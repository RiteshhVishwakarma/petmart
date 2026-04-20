/**
 * Cloudinary image upload service
 *
 * Setup Instructions:
 * 1. Go to https://cloudinary.com and login to your account
 * 2. Dashboard me "Cloud Name" copy karo (top-left corner)
 * 3. Settings → Upload → Add upload preset:
 *    - Upload preset name: petmart_unsigned
 *    - Signing mode: Unsigned
 *    - Asset folder: petmart/products (optional)
 *    - Save karo
 * 4. Neeche apni CLOUD_NAME aur UPLOAD_PRESET fill karo
 */

// ⚠️ IMPORTANT: Yahan apni Cloudinary details fill karo
const CLOUD_NAME = 'dk0bhqeuf';             // Your Cloudinary cloud name
const UPLOAD_PRESET = 'petmart_unsigned';   // Upload preset name jo aapne create kiya

// Validation check
if (CLOUD_NAME === 'YOUR_CLOUD_NAME' || !CLOUD_NAME) {
  console.error('❌ Cloudinary not configured! Update CLOUD_NAME in services/uploadService.ts');
}

export const uploadImageToCloudinary = async (imageUri: string): Promise<string> => {
  // Validate configuration
  if (CLOUD_NAME === 'YOUR_CLOUD_NAME' || !CLOUD_NAME) {
    throw new Error('Cloudinary not configured. Update CLOUD_NAME in uploadService.ts');
  }

  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: `product_${Date.now()}.jpg`,
  } as any);

  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'petmart/products');

  console.log('📤 Uploading to Cloudinary...', { CLOUD_NAME, UPLOAD_PRESET });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Cloudinary upload failed:', errorData);
    throw new Error(`Image upload failed: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  console.log('✅ Upload successful:', data.secure_url);
  return data.secure_url; // Final image URL to save in Firestore
};
