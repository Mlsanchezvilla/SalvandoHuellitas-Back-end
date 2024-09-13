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

const { Review, Request } = require("../db");
const { getAuthUser } = require("../jwt");

const createReview = async (req, res) => {
  try {
    const user = await getAuthUser(req)

    const { score, comment } = req.body;

    // Verificar que id_user no sea undefined o null
    if (!user) {
      return res.status(403).json({ error: "Aunthentication is required" });
    }

    // Verificar que el valor de status sea uno de los valores permitidos
    const validStatuses = ["1", "2", "3", "4", "5"];
    if (!validStatuses.includes(score)) {
      return res.status(400).json({ error: "Invalid score value" });
    }

    //Verificar si el usuario tiene una adopción aprobada
    const adoption = await Request.findOne({
      where: { id_user: user?.id, status: "approved" },
    });

    if (!adoption) {
      return res.status(400).json({
        canReview: false,
        message:
          "No puedes dejar una reseña si no has completado una adopción.",
      });
    }

    //Verificar si el usuario tiene reviews previos
    const review = await Review.findOne({
      where: { id_user: user?.id, isActive: true },
    });

    if (review) {
      return res.status(400).json({
        canReview: false,
        message:
          "No puedes dejar una reseña si ya lo has hecho previamente.",
      });
    }


    // Si la adopción está aprobada, crear la reseña
    const newReview = await Review.create({
      id_user: user.id,
      score,
      comment
    });

    res.status(200).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = createReview;
