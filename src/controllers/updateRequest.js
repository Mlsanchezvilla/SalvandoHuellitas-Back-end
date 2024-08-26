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

        res.status(200).json({ message: 'Solicitud actualizada exitosamente', request });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la solicitud', error });
    }
};

module.exports = updateRequest;