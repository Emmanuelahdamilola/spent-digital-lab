import uploadService from "../services/uploadService.js";

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const result = await uploadService.uploadImage(req.file.buffer, {
      folder: req.body.folder || 'admin_panel/images'
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const result = await uploadService.uploadPDF(req.file.buffer, {
      folder: req.body.folder || 'admin_panel/documents'
    });

    res.json({
      success: true,
      message: 'PDF uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const result = await uploadService.uploadThumbnail(req.file.buffer);

    res.json({
      success: true,
      message: 'Thumbnail uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const result = await uploadService.uploadProfileImage(req.file.buffer);

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { resourceType } = req.query;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const result = await uploadService.deleteFile(publicId, resourceType || 'image');

    res.json({
      success: true,
      message: 'File deleted successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  uploadImage,
  uploadPDF,  
  uploadThumbnail,
  uploadProfileImage,
  deleteFile
};
