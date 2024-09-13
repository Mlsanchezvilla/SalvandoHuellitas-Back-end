// // const { Review } = require("../db");

// // const createReview = async (req, res) => {
// //   try {
// //     const { id_user, status, comment } = req.body;

// //     // Verificar que id_user no sea undefined o null
// //     if (!id_user) {
// //       return res.status(400).json({ error: "User ID is required" });
// //     }

// //     // Verificar si el usuario tiene una adopción aprobada
// //     // const adoption = await Adoptions.findOne({
// //     //   where: { id_user, status: "Aprobada" },
// //     // });

// //     // if (!adoption) {
// //     //   return res.status(403).json({
// //     //     canReview: false,
// //     //     message: "No has completado el proceso de adopción.",
// //     //   });
// //     // }

// //     // Si la adopción está aprobada, crear la reseña
// //     const newReview = await Review.create({
// //       id_user,
// //       status,
// //       comment,
// //       date: new Date(), // Asegúrate de que la fecha sea generada
// //     });

// //     res.status(200).json(newReview);
// //   } catch (error) {
// //     res.status(400).json({ error: error.message });
// //   }
// // };

// // module.exports = createReview;

////////////////////////////////////////////////////////////////////////////////////////////

const { Review, Adoptions } = require("../db");

const createReview = async (req, res) => {
  try {
    const { id_user, status, comment, adoptionId } = req.body;

    // Verificar que id_user no sea undefined o null
    if (!id_user) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Verificar que el valor de status sea uno de los valores permitidos
    const validStatuses = ["1", "2", "3", "4", "5"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    //Verificar si el usuario tiene una adopción aprobada
    const adoption = await Adoptions.findOne({
      where: { id_user, status: "Aprobada" },
    });

    if (!adoption) {
      return res.status(403).json({
        canReview: false,
        message:
          "No puedes dejar una reseña si no has completado una adopción.",
      });
    }

    // Si la adopción está aprobada, crear la reseña
    const newReview = await Review.create({
      id_user,
      status,
      comment,
      adoptionId, // Incluye el campo adoptionId si es relevante
      date: new Date(), // Asegúrate de que la fecha sea generada
    });

    res.status(200).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = createReview;
