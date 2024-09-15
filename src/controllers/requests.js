const { Request, Pet, User} = require("../db");
const {Op} = require("sequelize");
const { getAuthUser } =  require("../jwt");
const { requestNotification, updateRequestStatus } = require("../services/emailService")


const listRequest = async (req, res) => {
  try {
    const user = await getAuthUser(req);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Only admins can perform this action." });
    }

    let { page = 1, limit = 10, sort = 'id', order = 'ASC', status } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let whereClause = {};
    if (status) {
      whereClause.status = status; // Filter by status if provided
    }

    const requests = await Request.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: (page - 1) * limit,
      order: [[sort, order]],
      include: [
        { model: User, attributes: ['fullName'] },
        { model: Pet, attributes: ['name', 'photo', 'species'] },
      ],
    });

    const totalPages = Math.ceil(requests.count / limit);

    res.status(200).json({
      page,
      totalPages,
      results: requests.rows,
    });
  } catch (error) {
    console.error("Error fetching requests:", error.message);
    res.status(500).json({ message: "Error fetching requests", error: error.message });
  }
};






const updateRequest = async (req, res) => {

  try {
    // Obtener el usuario autenticado
    const adminUser = await getAuthUser(req); // Verificar si el usuario que hace la solicitud es administrador

    // Verificar si el usuario es administrador
    if (!adminUser || !adminUser.isAdmin) {
        return res.status(403).json({ message: 'Solo los administradores pueden realizar esta acción' });
    }

    
        const { id } = req.params;
        const { status, comment } = req.body;

        
          // Encontrar la solicitud por su id e incluir la información del usuario asociado
        let request = await Request.findByPk(id, {
          include: {
              model: User, // Modelo del usuario
              attributes: ['email', 'fullName'] // Campos que necesitas
          }
      });
        
        if (!request) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
          }



        // Actualizar el estado y comentario de la solicitud
        request.status = status;
        request.comment = comment;
        await request.save();


         // Enviar el correo según el estado
        await updateRequestStatus(request.user.email, request.user.fullName, status, comment);

        res.status(200).json({ message: 'Solicitud actualizada exitosamente', request});
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la solicitud', error });
    }
  }



const createRequest = async (req, res) => {
  try {
    const user = await getAuthUser(req)
    let petFound;
    if(!user){
        return res.status(403).json({message:'Authentication needed'})
    }

    const {id_pet, timeAvailable, space, totalHabitants, hasPets, hasKids, addedCondition} = req.body;
    if(id_pet){
        petFound = await Pet.findByPk(id_pet);
        if(petFound.status !== "available"){
            return res.status(404).json({message:'Pet is not available'});
        }
    }
    const newRequest = await Request.create({
        id_pet,
        timeAvailable,
        space,
        totalHabitants,
        hasPets,
        hasKids,
        addedCondition,
        id_user: user.id,
    });
    if(petFound){
        petFound.status = "onHold";
        await petFound.save();
    }

    // Enviar correo de notificación de solicitud de adopción
    await requestNotification(user, newRequest.id, petFound ? petFound.name : null);

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la solicitud', error: error.message });
  }
};

module.exports = {
  listRequest,
  updateRequest, createRequest
};