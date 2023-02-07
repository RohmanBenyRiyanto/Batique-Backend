import { Sequelize } from 'sequelize';


const db = new Sequelize('auth_jwt', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

export default db;