const jwt = require('jsonwebtoken');

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    // No token, unauthorized
    if (!token) {
        return res.status(401).json({ error: true, message: "Access Denied: No Token Provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        // Token invalid or expired
        if (err) {
            return res.status(403).json({ error: true, message: "Invalid or Expired Token" });
        }

        req.user = decodedUser;
        next();
    });
};

module.exports = authenticationToken;
