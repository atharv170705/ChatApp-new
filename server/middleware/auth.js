import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes
const jwtSecret = process.env.JWT_SECRET;
export const protectRoute = async (req, res, next) => {
    try {
        // console.log("Request headers:", req.headers);
        const token = req.headers.token;
        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.json({success:false, message: "User not found"});
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error at protectRoute", error.message);
        res.json({success:false, message:error.message})
    }
}