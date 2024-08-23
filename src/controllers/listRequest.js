const { Request } = require("../db");
const { Op } = require('sequelize');

const listRequest = async (query) => {
    // Obtain the search query parameter from query
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

    // Return the list of requests
    return requests;
};

module.exports = listRequest;
