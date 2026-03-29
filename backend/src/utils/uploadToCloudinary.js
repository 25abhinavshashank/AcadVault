import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, filename, mimetype) =>
  new Promise((resolve, reject) => {
    // Notes are stored as raw assets so PDF/DOC files keep their original download behavior.
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "student-community-notes",
        public_id: `${Date.now()}-${filename}`.replace(/\s+/g, "-"),
        format: mimetype === "application/pdf" ? "pdf" : undefined
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });

export default uploadToCloudinary;
