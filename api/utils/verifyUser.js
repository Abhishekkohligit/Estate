import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	const token = req.cookies.access_token; // get the cookie data

	if (!token) return next(errorHandler(401, "Unauthorized")); //error for cookie not found
	// verify the cookie data
	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return next(errorHandler(403, "Forbidden"));

		req.user = user; // get user data(._id)
		next(); //move to ext step
	});
};
