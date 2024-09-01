const { Request } = require("../db");
const {Op} = require("sequelize");


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

        // Encontrar la solicitud por su id
        let request = await Request.findByPk(id);
        if (!request) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        // Actualizar el estado y comentario de la solicitud
        request.status = status;
        request.comment = comment;
        await request.save();

        res.status(200).json({ message: 'Solicitud actualizada exitosamente', request});
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la solicitud', error });
    }
};


module.exports = {
  listRequest,
  updateRequest
};