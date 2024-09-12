const { Review, Adoptions } = require("../db");

const reviewManagement = async (req, res) => {
  const { id_user, reviewText, rating } = req.body;

  try {
    // Asegúrate de que el usuario haya completado la adopción
    const adoption = await Adoptions.findOne({
      where: { id_user, status: "Aprobada" },
    });

    if (adoption) {
      const review = await Review.create({
        id_user,
        reviewText,
        rating,
        date: new Date(),
      });
      res.status(201).json({ message: "Reseña enviada exitosamente", review });
    } else {
      res.status(403).json({
        message:
          "No puedes dejar una reseña si no has completado una adopción.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = reviewManagement;
