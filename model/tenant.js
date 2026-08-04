const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Tenant = sequelize.define(
    "Tenant",
    {
        tenant_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        tenant_owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("active", "trial", "suspended", "inactive"),
            defaultValue: "trial",
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        industry: {
            type: DataTypes.ENUM(
                "Manufacturing", "IT Services", "Finance", "Healthcare",
                "Retail", "HR Consulting", "Education", "Logistics", "Other"
            ),
        },
        plan: {
            type: DataTypes.ENUM("enterprise", "pro", "starter"),
        },
        working_hours_per_day: {
            type: DataTypes.FLOAT,
            defaultValue: 8.0,
        },
        standard_check_in_time: {
            type: DataTypes.STRING,
            defaultValue: "09:00",
        }
    },
    {
        tableName: "tenants",
        timestamps: true, 
    }
);

module.exports = Tenant;
