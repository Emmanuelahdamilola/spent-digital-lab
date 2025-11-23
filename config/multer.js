import multer from "multer";
import path from "path";

const fileFilter = (req, file, cb) => {
  const allowedImageExt = ["jpeg", "jpg", "png", "gif", "webp", "svg"];
  const allowedDocExt = ["pdf", "doc", "docx"];

  const allowedDocMime = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  const mimetype = file.mimetype;

  // Image validation
  if (
    allowedImageExt.includes(ext) &&
    (mimetype.startsWith("image/") || mimetype === "image/svg+xml")
  ) {
    return cb(null, true);
  }

  // Document validation
  if (allowedDocExt.includes(ext) && allowedDocMime.includes(mimetype)) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Invalid file type. Allowed: images (jpg, png, gif, webp, svg) and documents (pdf, doc, docx)"
    )
  );
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter,
});

export default upload;
