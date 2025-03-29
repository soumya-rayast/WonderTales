const jwt = require('jsonwebtoken');

const authenticationToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: true, message: "Access Denied: No Token Provided" });
        }

        const token = authHeader && authHeader.split(" ")[1];

        // No token, unauthorized
        if (!token) {
            return res.status(401).json({ error: true, message: "Access Denied: No Token Provided" });
        }
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables.");
            return res.status(500).json({ error: true, message: "Internal Server Error" });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
            // Token invalid or expired
            if (err) {
                console.error("JWT Verification Error:", err.message);
                return res.status(403).json({ error: true, message: "Invalid or Expired Token" });
            }

            req.user = decodedUser;
            next();
        });
    } catch (error) {
        console.error('Authentication Middleware Error:', error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

module.exports = authenticationToken;
