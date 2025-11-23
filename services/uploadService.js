import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


class UploadService {
  /**
   * Upload image to Cloudinary
   * @param {Buffer} fileBuffer - File buffer from multer
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} - { secure_url, public_id, format, width, height }
   */
  async uploadImage(fileBuffer, options = {}) {
    const defaultOptions = {
      folder: 'admin_panel/images',
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ],
      ...options
    };

    return this.uploadToCloudinary(fileBuffer, defaultOptions);
  }

  /**
   * Upload PDF to Cloudinary
   * @param {Buffer} fileBuffer - File buffer from multer
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} - { secure_url, public_id, format, pages }
   */
  async uploadPDF(fileBuffer, options = {}) {
    const defaultOptions = {
      folder: 'admin_panel/documents',
      resource_type: 'raw', // For PDFs and documents
      ...options
    };

    return this.uploadToCloudinary(fileBuffer, defaultOptions);
  }

  /**
   * Upload thumbnail image (with size restrictions)
   * @param {Buffer} fileBuffer - File buffer
   * @param {Object} options - Upload options
   * @returns {Promise<Object>}
   */
  async uploadThumbnail(fileBuffer, options = {}) {
    const defaultOptions = {
      folder: 'admin_panel/thumbnails',
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
      ...options
    };

    return this.uploadToCloudinary(fileBuffer, defaultOptions);
  }

  /**
   * Upload profile image (square, optimized)
   * @param {Buffer} fileBuffer - File buffer
   * @param {Object} options - Upload options
   * @returns {Promise<Object>}
   */
  async uploadProfileImage(fileBuffer, options = {}) {
    const defaultOptions = {
      folder: 'admin_panel/profiles',
      resource_type: 'image',
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
      ...options
    };

    return this.uploadToCloudinary(fileBuffer, defaultOptions);
  }

  /**
   * Core upload method using streams
   * @param {Buffer} fileBuffer - File buffer
   * @param {Object} options - Cloudinary options
   * @returns {Promise<Object>}
   */
  uploadToCloudinary(fileBuffer, options) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              resource_type: result.resource_type,
              width: result.width,
              height: result.height,
              bytes: result.bytes,
              created_at: result.created_at
            });
          }
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  /**
   * Delete file from Cloudinary
   * @param {String} publicId - Cloudinary public_id
   * @param {String} resourceType - 'image' or 'raw'
   * @returns {Promise<Object>}
   */
  async deleteFile(publicId, resourceType = 'image') {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Delete multiple files
   * @param {Array} publicIds - Array of public_ids
   * @param {String} resourceType - 'image' or 'raw'
   * @returns {Promise<Object>}
   */
  async deleteMultipleFiles(publicIds, resourceType = 'image') {
    try {
      const result = await cloudinary.api.delete_resources(publicIds, {
        resource_type: resourceType
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to delete files: ${error.message}`);
    }
  }
}

export default new UploadService();