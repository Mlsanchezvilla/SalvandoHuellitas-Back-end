const { Request } = require("../db");
const {Op} = require("sequelize");
const sgMail = require('../services/sendgrid'); 


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



         // Enviar notificación por correo
      const msg = {
            to: request.user.email,
            from: 'cinthyasem@gmail.com', 
            subject: `Estado de tu solicitud de adopción: ${status}`,
            text: `Hola ${request.user.fullName},\n\nTu solicitud de adopción ha sido ${status}.\nComentario: ${comment}\n\nGracias por ayudarnos a Salvar Huellitas.`,
            html: `<p>Hola ${request.user.fullName},</p>
                  <p>Tu solicitud de adopción ha sido <strong>${status}</strong>.</p>
                  <p>Comentario: ${comment}</p>
                  <p>Gracias por ayudarnos a Salvar Huellitas.</p>`
      };

      try {
          await sgMail.send(msg);
      } catch (error) {
          console.error("Error al enviar el correo:", error);
          return res.status(500).json({ message: 'Error al enviar el correo de notificación' });
      }

        
        res.status(200).json({ message: 'Solicitud actualizada exitosamente', request});
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la solicitud', error });
    }
};



const createRequest = async (req, res) => {
  try {
    console.log("Ruta /requests/ fue llamada");
    console.log("Datos recibidos:", req.body);
    
    const newRequest = await Request.create(req.body);
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la solicitud', error });
  }
};




module.exports = {
  listRequest,
  updateRequest, createRequest
};