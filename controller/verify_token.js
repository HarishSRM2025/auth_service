const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing in request body",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return res.status(200).json({
            success: true,
            message: "Token is valid",
            data: {
                user: {
                    id: decoded.id,
                    role: decoded.user_role || decoded.role,
                },
            },
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};