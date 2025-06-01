const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        // Check if Authorization header exists
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'No auth token provided' });
        }

        // Extract token
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_key');
            
            // Add user info to request
            req.user = {
                userId: decoded.userId,
                email: decoded.email
            };
            
            next();
        } catch (err) {
            console.error('Token verification failed:', err.message);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Authentication error' });
    }
};

module.exports = auth; 