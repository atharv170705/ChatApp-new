import jwt from "jsonwebtoken"

// function to generate token

const jwtSecret = process.env.JWT_SECRET;

export const generateToken = (userId) => {
    const token = jwt.sign({userId}, jwtSecret);
    return token;
}