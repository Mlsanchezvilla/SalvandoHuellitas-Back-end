const { Review } = require("../db");

//* receives all info needed for the new review
const createReview = async(data) => {

    //* creates a new instance of Review
    const newReview = await Review.create(data);

    return newReview;
};

module.exports = createReview;
