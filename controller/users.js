const Users = require("../model/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.SignUp = async (req, res) => {
    try {
        const {
            user_name,
            user_email,
            user_phone,
            user_password,
            user_role,
        } = req.body;

        if (
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

        const existingUser = await Users.findOne({
            where: { user_email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        const hashedPassword = await bcrypt.hash(user_password, 10);

        const user = await Users.create({
            user_name,
            user_email,
            user_phone,
            user_password: hashedPassword,
            user_role: user_role || "USER",
        });

        return res.status(201).json({
            success: true,
            message: "SignUp Successfully",
            data: {
                id: user.id,
                user_name: user.user_name,
                user_email: user.user_email,
                user_phone: user.user_phone,
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

exports.SignIn = async (req, res) => {
    try {
        const { user_email, user_password } = req.body;

        if (!user_email || !user_password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await Users.findOne({
            where: { user_email },
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
                user_role: user.user_role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "SignIn successful",
            data: {
                token,
                user: {
                    id: user.id,
                    user_name: user.user_name,
                    user_email: user.user_email,
                    user_phone: user.user_phone,
                    user_role: user.user_role,
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


