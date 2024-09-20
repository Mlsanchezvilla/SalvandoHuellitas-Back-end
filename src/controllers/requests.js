const { Request, Pet, User} = require("../db");
const {Op} = require("sequelize");
const { getAuthUser } =  require("../jwt");
const { requestNotification, updateRequestStatus } = require("../services/emailService")


const listRequest = async (req, res) => {
  try {
    const user = await getAuthUser(req);

    if (!user) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    let { page = 1, limit = 10, sort = 'id', order = 'ASC', status } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let whereClause = {};

    // If the user is not an admin, they should only see their own requests
    if (!user.isAdmin) {
      whereClause.id_user = user.id; // Use 'id_user' instead of 'userId'
    }

    // Filter by status if provided
    if (status) {
      whereClause.status = status;
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
        console.log(id);
        console.log(comment);
        
          // Encontrar la solicitud por su id e incluir la información del usuario asociado
        let request = await Request.findByPk(id);
        if (!request) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
          }
      console.log(request);

      let user = await User.findByPk(request.id_user);
        console.log(user);
        let pet = await Pet.findByPk(request.id_pet);

        // Actualizar el estado y comentario de la solicitud
        request.status = status;
        console.log(request.status);

        request.comment = comment;
        console.log(request.comment);

        await request.save();

        if (status === "approved"){
            pet.status = "adopted"
        } else if (status === "denied"){
            pet.status = "available"
        }
        await pet.save()
        console.log(request.comment);
        console.log(request.status);

        user.adoptions = user.adoptions + 1;
        console.log(user.adoptions);
        await user.save();
        console.log(user.adoptions);

        //  // Enviar el correo según el estado
        // await updateRequestStatus(user.email, user.fullName, status, comment);

        return res.status(200).json({ message: 'Solicitud actualizada exitosamente', request});
    } catch (error) { 
      console.log(error);
        return res.status(500).json({ message: 'Error al actualizar la solicitud', error });
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