const { Request, Pet, User} = require("../db");
const {Op} = require("sequelize");
// const sgMail = require('../services/sendgrid');
const { getAuthUser } =  require("../jwt");

const listRequest = async (req, res) => {
  try {
    // Authenticate the user
    const user = await getAuthUser(req);

    // If no user is authenticated, return an error
    if (!user) {
      return res.status(403).json({ error: "Authentication required." });
    }

    // Only admins can access this route
    if (!user.isAdmin) {
      return res.status(403).json({ error: "Only admins can perform this action." });
    }

    // Retrieve query parameters for filtering and pagination
    let { page = 1, limit = 10, sort = 'id', order = 'ASC' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Fetch all requests, including pet details with species
    const requests = await Request.findAndCountAll({
      limit: limit,
      offset: (page - 1) * limit,
      order: [[sort, order]],  // Sorting by the provided column and order
      include: [
        {
          model: User,
          attributes: ['fullName'], // Get the request creator's full name
        },
        {
          model: Pet,
          attributes: ['name', 'photo', 'species'], // Get the pet's name, photo, and species
        },
      ],
    });

    // Calculate total pages
    const totalPages = Math.ceil(requests.count / limit);

    // Return the list of requests with pagination data
    res.status(200).json({
      page: page,
      totalPages: totalPages,
      results: requests.rows,
    });
  } catch (error) {
    // Catch and log any error
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