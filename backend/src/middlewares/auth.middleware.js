import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";

export const verifyJWT = (req, res, next) => {
    
    // test env shortcut
    if (process.env.NODE_ENV === "test") {
        req.user = {
            _id: "test-user-id",
            role: "admin" // simulate admin access
        };
        return next();
    }

    // production auth
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Unauthorized: Token missing");
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        req.user = decoded; // {_id, email, role}
        next();
    } catch (error) {
        next(new ApiError(401, "Unauthorized: Invalid token"));
    }
};
