const { Review, User } = require("../db");

const createReview = async (req, res) => {
  try {
    const { id_user, status, comment, rating } = req.body;

    // Verificar que id_user no sea undefined o null
    if (!id_user) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findOne({ where: { id: id_user } });

    // Verificar que el valor de status sea uno de los valores permitidos
    const validStatuses = ["Pendiente", "Aprobada", "Rechazada"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    //Verificar si el usuario tiene una adopción aprobada
    if (user.adoptions == 0) {
      return res.status(400).json({
        canReview: false,
        message:
          "No puedes dejar una reseña si no has completado una adopción.",
      });
    }

    // Verificar si el usuario ya ha dejado una reseña
    const existingReview = await Review.findOne({
      where: { id_user, status: "Aprobada" },
    });
    if (existingReview) {
      return res.status(400).json({
        canReview: false,
        message: "Ya has dejado una reseña",
      });
    }

    // Si la adopción está aprobada, crear la reseña
    const newReview = await Review.create({
      id_user,
      status,
      comment,
      user_name: user.fullName,
      rating,
      date: new Date(), // Asegúrate de que la fecha sea generada
    });

    res.status(200).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = createReview;
