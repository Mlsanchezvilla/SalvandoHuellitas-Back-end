const { Review } = require("../db");

const reviewManagement = async (req, res) => {
  const { id_user, reviewText, rating } = req.body;

  try {
    // Buscar al usuario por su id
    const user = await User.findOne({ where: { id: id_user } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario tiene al menos una adopción
    if (user.adoptions > 0) {
      // Crear la reseña si tiene adopciones
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
