require("dotenv").config(); //* imports the use of .env files
const { Sequelize/* , DataTypes*/ } = require("sequelize"); //* imports the ORM

const fs = require('fs');
const path = require('path');

const { //* defines variables to access the DB
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env; //*

//* imports functions for model creation (tables)



//* connection to the DB
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/countries`, { //*
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});




const basename = path.basename(__filename);
const modelDefiners = [];

// reads all files in Models folder, requires 'em and adds 'em to the modelDefiners array
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });




// establishes sequelize conexion to all the models
modelDefiners.forEach(model => model(sequelize));
// capitalizes the models' names from 'product' to 'Product'
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);





//* calls the model's creation and establishes n:n relationship



// all imported  sequelize.models
// destructuring to relate the models



//* model relationships
// product.hasMany(Reviews);







module.exports = { //*sequelize
  ...sequelize.models, // to be able to import the models like: const { Product, User } = require('./db.js');
  conn: sequelize,     // to import the connection { conn } = require('./db.js');
};