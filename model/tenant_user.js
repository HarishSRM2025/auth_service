const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Tenant_User = sequelize.define(
    "Tenant_User",
    {
        tenant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

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
                "TENANT_ADMIN",
                "MANAGER",
                "EMPLOYEE"
            ),
            allowNull: false,
            defaultValue: "EMPLOYEE",
        },
    },
    {
        tableName: "tenant_users",
        timestamps: true,
    }
);

module.exports = Tenant_User;
