import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import User from './UserModel.js';

const { DataTypes } = Sequelize;

const Alamat = db.define('alamat', {


    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },

    kecamatan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kabupaten: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    provinsi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kodePos: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    alamat: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nomorTelepon: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    namaPenerima: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        defaultValue: false,
    },
    isPrimaryToko: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        defaultValue: false,
    },
});

User.hasMany(Alamat);
Alamat.belongsTo(User, { foreignKey: 'userId' });

export default Alamat;
