const {Pet} = require("../db");


const daoPet = {

    getPaginatedPets: async (query, limit, offset) => {
        // Remove undefined values from query to avoid filter issues
        for (let queryKey in query) {
            if (!query[queryKey]){
                delete query[queryKey]
            }
        }

        return await Pet.findAndCountAll({
            where: query,
            limit: limit,
            offset: offset,
        });
    }

}

module.exports = daoPet;