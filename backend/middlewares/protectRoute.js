import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt || req.headers["authorization"];
        console.log("Token: ", token); 

        if (!token) {
            return res.status(401).json({ message: "Unauthorized Access - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized Access - Invalid Token" });
        }   

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized Access - User Not Found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectedRoute middleware", error.message);
        res.status(401).json({ message: "Unauthorized Access" });
    }
};

export default protectedRoute;