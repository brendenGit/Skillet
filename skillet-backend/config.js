"use strict";

/** Shared config for application; can be required many places. */
require("dotenv").config();
require("colors");


const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12; 


// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
    //dynamic db vars based on dev mode
    let dbType;
    
    //set dynamic db vars
    if (process.env.NODE_ENV === "test") {
        dbType = process.env.DB_TEST_NAME;
    } else {
        dbType = process.env.DB_NAME;
    }

    //return db connection config
    return {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        database: dbType,
    };
};

//log config on db start up 
console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");


module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};
