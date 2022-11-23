import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import Users from '../model/users.js';
import Books from "../model/books.js"

const database = {};

const credentials = {
    host: "localhost",
    user: "root",
    password: "",
    database: "Library"
}

try {
    const connection = await mysql.createConnection({
        host: credentials.host,
        user: credentials.user,
        password: credentials.password
    })
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${credentials.database}`)
    const sequelize = new Sequelize(credentials.database, credentials.user, credentials.password, {dialect: "mysql"});
    database.Users = Users(sequelize)
    database.Books = Books(sequelize)

    database.Users.hasMany(database.Books)
    database.Books.belongsTo(database.Users)
   
    await sequelize.sync({alter: true})
}
catch(error) {
    console.log(error)
    console.log("Nepavyko prisijungti prie duomenu bazes")
}

export default database;
