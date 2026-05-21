const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Users = sequelize.define(
    "Users",
    {
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        user_email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        
        user_phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        user_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_role: {
            type: DataTypes.ENUM(
                "SUPER_ADMIN",
                "USER"
            ),
            allowNull: false,
            defaultValue: "USER",
        },
    },
    {
        tableName: "Users",
        timestamps: true,
    }
);

module.exports = Users;
