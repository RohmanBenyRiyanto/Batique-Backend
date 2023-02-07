import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const User = db.define('user', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
            this.setDataValue('name', val.charAt(0).toUpperCase() + val.slice(1));
        },
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
            this.setDataValue('username', val.toLowerCase());
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 255],
        },
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
        set(val) {
            this.setDataValue('role', val.toLowerCase());
        },
        validate: {
            isIn: [['user', 'admin', 'superadmin', 'toko']],
        },
    },
    refreshToken: {
        type: DataTypes.TEXT,
    },
}, {
    freezeTableName: true,
});

export default User;