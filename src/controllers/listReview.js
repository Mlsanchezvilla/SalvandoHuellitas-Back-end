const { Review } = require("../db");
const { Op } = require('sequelize');

const listReview = async (query) => {
    // Obtain the search query parameter from query
    let search = query.search;

    // If search is not undefined, manage that value in the query
    if (search) {
        // Remove the "search" key from the query object
        delete query.search;

        // Define a query where the comment contains the search term (case-insensitive)
        query[Op.or] = [
            { comment: { [Op.iLike]: "%" + search + "%" } }
            // You can add more fields here if needed
        ];
    }

    // Retrieve all reviews that match the query
    let reviews = await Review.findAll({
        where: query
    });

    // Return the list of reviews
    return reviews;
};

module.exports = listReview;