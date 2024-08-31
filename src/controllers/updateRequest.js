const Request = require('../models/Request') //Para encontrar y actualizar la solicitud de adopción.
const Pet = requiere('../models/Pet.js') //Para actualizar el estado de la mascota basado en el estado de la solicitud.

const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comment } = req.body;

        if (!['approved', 'denied'].includes(status)) {
            return res.status(400).json({ message: 'Estado no válido. Debe ser "approved" o "denied"' });
        }

        // Encontrar la solicitud por su id
        const request = await Request.findByPk(id);
        if (!request) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        // Actualizar el estado y comentario de la solicitud
        request.status = status;
        request.comment = comment;
        await request.save();

        // Actualizar el estado de la mascota dependiendo del estado de la solicitud
        const petStatus = status === 'approved' ? 'adopted' : 'available';
        await Pet.update({ status: petStatus }, {
            where: { id: request.petId }
        });

        res.status(200).json({ message: 'Solicitud actualizada exitosamente', request });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la solicitud', error });
    }
};

module.exports = updateRequest;