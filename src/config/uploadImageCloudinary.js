const cloudinary = require("./cloudinaryConfig");

async function uploadImage(id, image) {
  try {
    let public_id = "pets/" + id;
    const uploadResult = await cloudinary.uploader
      .upload(image, {
        public_id: public_id,
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(uploadResult)
    const optimizeUrl = cloudinary.url(public_id, {
      fetch_format: "auto",
      quality: "auto",
    });

    const autoCropUrl = cloudinary.url(public_id, {
      crop: "auto",
      gravity: "auto",
      width: 500,
      height: 500,
    });

    return {
      original_image: uploadResult.url,
      optimize_image: optimizeUrl,
      auto_crop_image_500: autoCropUrl,
    };
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw error; // Propaga el error para manejarlo fuera de la función si es necesario
  }
}

module.exports = uploadImage;

// De esta forma se debe llamar la funcion para cargar la imagen y obtener las URLs de las mismas.
// uploadImage("perro_pelota", imageUrl)
//   .then((dataResult) => {
//     console.log(dataResult); // Aquí verás las URLs de las imágenes
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
