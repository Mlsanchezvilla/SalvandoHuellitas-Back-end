const cloudinary = require("./cloudinaryConfig");
const streamifier = require("streamifier");

async function uploadImageStream(buffer) {
  try {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      // Convertir el buffer a un stream y subirlo
      streamifier.createReadStream(buffer).pipe(stream);
    });
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw error;
  }
}

module.exports = uploadImageStream;
