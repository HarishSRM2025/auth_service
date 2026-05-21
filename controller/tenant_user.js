const TenantUser = require("../model/tenant_user");
const Tenant = require("../model/tenant");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.createTenantUser = async (req, res) => {
    try {
        const {
            tenant_id,
            user_name,
            user_email,
            user_phone,
            user_password,
            user_role,
        } = req.body;

        if (
            !tenant_id ||
            !user_name ||
            !user_email ||
            !user_phone ||
            !user_password
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Find tenant by id
        const tenant = await Tenant.findOne({ where: { id: tenant_id } });
        if (!tenant) {
            return res.status(400).json({
                success: false,
                message: "Invalid tenant id",
            });
        }

        const existingUser = await TenantUser.findOne({
            where: { user_email },
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        const hashedPassword = await bcrypt.hash(user_password, 10);
        const user = await TenantUser.create({
            tenant_id: tenant.id,
            user_name,
            user_email,
            user_phone,
            user_password: hashedPassword,
            user_role: user_role || "EMPLOYEE",
        });
        console.log(user);
        return res.status(201).json({
            success: true,
            message: "Tenant user created successfully",
            data: {
                id: user.id,
                tenant_id: user.tenant_id,
                user_name: user.user_name,
                user_phone: user.user_phone,
                user_email: user.user_email,
                user_role: user.user_role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.signinTenantUser = async (req, res) => {
    try {
        const { user_email, user_password, tenant_id } = req.body;

        if (!user_email || !user_password || !tenant_id) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and tenant id are required",
            });
        }

        // Find tenant by id
        const tenant = await Tenant.findOne({ where: { id: tenant_id } });
        if (!tenant) {
            return res.status(400).json({
                success: false,
                message: "Invalid tenant id",
            });
        }
        
        const user = await TenantUser.findOne({
            where: { user_email, tenant_id: tenant.id },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            user_password,
            user.user_password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                tenant_id: user.tenant_id,
                role: user.user_role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "Signin successful",
            data: {
                token,
                user: {
                    id: user.id,
                    tenant_id: user.tenant_id,
                    user_name: user.user_name,
                    user_email: user.user_email,
                    role: user.user_role,
                    tenant_name: tenant.tenant_name,
                    slug: tenant.slug,
                },
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


exports.getUsersByTenant = async (req, res) => {
    try {
        const { tenant_id } = req.params;

        const users = await TenantUser.findAll({
            where: { tenant_id },
            attributes: { exclude: ["user_password"] },
        });

        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_role } = req.body;

        if (!user_role || !["TENANT_ADMIN", "MANAGER", "EMPLOYEE"].includes(user_role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role provided.",
            });
        }

        const user = await TenantUser.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        user.user_role = user_role;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User role updated successfully.",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
