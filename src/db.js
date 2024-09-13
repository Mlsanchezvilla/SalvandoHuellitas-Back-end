// require("dotenv").config(); //* imports the use of .env files
// const { Sequelize, DataTypes } = require("sequelize"); //* imports the ORM

// const fs = require("fs");
// const path = require("path");

// const {
//   //* defines variables to access the DB
//   DB_URL,
// } = process.env; //*

// //* imports functions for model creation (tables)
// const PetFunction = require("./models/Pet");
// const UserFunction = require("./models/User");
// const ReviewFunction = require("./models/Review");
// const RequestFunction = require("./models/Request");

// //* connection to the DB
// const sequelize = new Sequelize(DB_URL, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });

// const basename = path.basename(__filename);
// const modelDefiners = [];

// // reads all files in Models folder, requires 'em and adds 'em to the modelDefiners array
// fs.readdirSync(path.join(__dirname, "/models"))
//   .filter(
//     (file) =>
//       file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
//   )
//   .forEach((file) => {
//     modelDefiners.push(require(path.join(__dirname, "/models", file)));
//   });

// // establishes sequelize conexion to all the models
// modelDefiners.forEach((model) => model(sequelize));
// // capitalizes the models' names from 'product' to 'Product'
// let entries = Object.entries(sequelize.models);
// let capsEntries = entries.map((entry) => [
//   entry[0][0].toUpperCase() + entry[0].slice(1),
//   entry[1],
// ]);
// sequelize.models = Object.fromEntries(capsEntries);

// //* calls the model's creation and establishes n:n relationship
// PetFunction(sequelize);
// UserFunction(sequelize);
// ReviewFunction(sequelize);
// RequestFunction(sequelize);

// // all imported  sequelize.models
// // destructuring to relate the models
// // const { Pet, User, Review, Request, Adoptions } = sequelize.models;

// //* model relationships

// module.exports = {
//   //*sequelize
//   ...sequelize.models, // to be able to import the models like: const { Product, User } = require('./db.js');
//   conn: sequelize, // to import the connection { conn } = require('./db.js');
// };

require("dotenv").config(); // Imports the use of .env files
const { Sequelize } = require("sequelize"); // Imports the ORM

const fs = require("fs");
const path = require("path");

const { DB_URL } = process.env; // Defines variables to access the DB

// Connection to the DB
const sequelize = new Sequelize(DB_URL, {
  logging: false, // Set to console.log to see the raw SQL queries
  native: false, // Lets Sequelize know we can use pg-native for ~30% more speed
});

const basename = path.basename(__filename);
const modelDefiners = [];

// Reads all files in Models folder, requires them, and adds them to the modelDefiners array
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, "/models", file));
    if (typeof model === "function") {
      modelDefiners.push(model);
    } else {
      console.warn(`Skipping non-function model: ${file}`);
    }
  });

// Defines all models with sequelize
modelDefiners.forEach((model) => model(sequelize));

// Capitalizes the models' names from 'product' to 'Product'
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(([key, value]) => [
  key[0].toUpperCase() + key.slice(1),
  value,
]);
sequelize.models = Object.fromEntries(capsEntries);

// Define model relationships (example)
// sequelize.models.User.hasMany(sequelize.models.Pet);
// sequelize.models.Pet.belongsTo(sequelize.models.User);

module.exports = {
  ...sequelize.models, // To be able to import the models like: const { Product, User } = require('./db.js');
  conn: sequelize, // To import the connection { conn } = require('./db.js');
};
