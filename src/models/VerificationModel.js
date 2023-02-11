import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import User from '../models/UserModel.js';

const { DataTypes } = Sequelize;

const Verification = db.define('verification', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    expiredAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

User.hasOne(Verification, { foreignKey: 'userId' });
Verification.belongsTo(User, { foreignKey: 'userId' });

export default Verification;