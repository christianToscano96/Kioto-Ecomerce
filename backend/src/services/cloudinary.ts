import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'drjdpt4t7',
  api_key: process.env.CLOUDINARY_API_KEY || '463585348947528',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Wf9DmUkTtom95G-2siDvclnzPc4',
});

export interface UploadResult {
  url: string;
  public_id: string;
}

/**
 * Upload a file buffer to Cloudinary
 */
export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: 'products' | 'categories' | 'combos' = 'products'
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1000, crop: 'limit' }, // Resize if larger than 1000px
          { quality: 'auto' } // Auto quality optimization
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/**
 * Delete an image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;