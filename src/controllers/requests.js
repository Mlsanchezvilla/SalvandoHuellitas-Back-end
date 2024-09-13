const { Request, Pet, User} = require("../db");
const {Op} = require("sequelize");
const { getAuthUser } =  require("../jwt");
const { requestNotification, updateRequestStatus } = require("../services/emailService")


const listRequest = async (req, res) => {
  try {
    // Obtain the search query parameter from query
      let query = req.query;
      let search = query.search;

    // If search is not undefined, manage that value in the query
    if (search) {
        // Remove the "search" key from the query object
        delete query.search;

        // Define a query where status or preferredSpecies contain the search term (case-insensitive)
        query[Op.or] = [
            { status: { [Op.iLike]: "%" + search + "%" } },
            { preferredSpecies: { [Op.iLike]: "%" + search + "%" } }
            // Add more fields if needed
        ];
    }

    // Retrieve all requests that match the query
    let requests = await Request.findAll({
        where: query,
        // Add pagination if limit and offset are provided in the query
        limit: query.limit ? parseInt(query.limit) : undefined,
        offset: query.offset ? parseInt(query.offset) : undefined,
    });
    res.status(200).json(requests);
    } catch (error) {
    res.status(400).json({ error: error.message });
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