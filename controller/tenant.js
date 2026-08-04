const Tenant = require("../model/tenant");
const TenantUser = require("../model/tenant_user");
const sequelize = require("../sequelize");

const VALID_STATUSES = ["active", "trial", "suspended", "inactive"];
const VALID_INDUSTRIES = [
    "Manufacturing", "IT Services", "Finance", "Healthcare",
    "Retail", "HR Consulting", "Education", "Logistics", "Other"
];
const VALID_PLANS = ["enterprise", "pro", "starter"];

exports.createTenant = async (req, res) => {
    try {
        const { tenant_name,tenant_owner_id,status, slug, industry, plan } = req.body;

        if (!tenant_name || !slug) {
            return res.status(400).json({
                success: false,
                message: "Tenant name and slug are required",
            });
        }

        if (status && !VALID_STATUSES.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value provided" });
        }
        if (industry && !VALID_INDUSTRIES.includes(industry)) {
            return res.status(400).json({ success: false, message: "Invalid industry value provided" });
        }
        if (plan && !VALID_PLANS.includes(plan)) {
            return res.status(400).json({ success: false, message: "Invalid plan value provided" });
        }

        const isExist = await Tenant.findOne({
            where: { tenant_name }
        });

        if (isExist) {
            return res.status(400).json({
                success: false,
                message: "Tenant name already exists",
            });
        }

        const isSlugExist = await Tenant.findOne({
            where: { slug }
        });

        if (isSlugExist) {
            return res.status(400).json({
                success: false,
                message: "Slug already exists",
            });
        }

        const tenant = await Tenant.create({
            tenant_name,
            tenant_owner_id,
            status,
            slug,
            industry,
            plan
        });

        return res.status(201).json({
            success: true,
            message: "Tenant created successfully",
            data: tenant,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getAllTenants = async (req, res) => {
    try {
        const tenants = await Tenant.findAll({ raw: true });

        const usersCount = await TenantUser.findAll({
            attributes: ['tenant_id', [sequelize.fn('COUNT', sequelize.col('id')), 'userCount']],
            group: ['tenant_id'],
            raw: true
        });

        const countMap = {};
        usersCount.forEach(uc => {
            countMap[uc.tenant_id] = parseInt(uc.userCount, 10);
        });

        const enrichedTenants = tenants.map(t => ({
            ...t,
            users: countMap[t.id] || 0
        }));

        return res.status(200).json({
            success: true,
            data: enrichedTenants,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.deleteTenant = async (req, res) => {
    try {
        const { id } = req.params;
        const tenant = await Tenant.findByPk(id);

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found",
            });
        }

        await tenant.destroy();

        return res.status(200).json({
            success: true,
            message: "Tenant deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.getTenantBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const tenant = await Tenant.findOne({ where: { slug } });
        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: tenant,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.updateTenant = async (req, res) => {
    try {
        const { id } = req.params;
        const { working_hours_per_day, standard_check_in_time, tenant_name, industry, plan, status } = req.body;
        const tenant = await Tenant.findByPk(id);

        if (!tenant) {
            return res.status(404).json({ success: false, message: "Tenant not found" });
        }

        if (working_hours_per_day !== undefined) tenant.working_hours_per_day = parseFloat(working_hours_per_day);
        if (standard_check_in_time !== undefined) tenant.standard_check_in_time = standard_check_in_time;
        if (tenant_name) tenant.tenant_name = tenant_name;
        if (industry) tenant.industry = industry;
        if (plan) tenant.plan = plan;
        if (status) tenant.status = status;

        await tenant.save();

        return res.status(200).json({
            success: true,
            message: "Tenant updated successfully",
            data: tenant,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};