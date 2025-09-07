import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({quiet: true, path: ".env"});

const generateToken = async (user) => {
    try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        return token;
    } catch (error) {
        throw new Error("Error generating token");
    }
}

export default generateToken;