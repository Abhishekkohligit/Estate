import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
	const { username, email, password } = req.body;
	const hashedPassword = bcryptjs.hashSync(password, 10);
	const newUser = new User({ username, email, password: hashedPassword });
	try {
		await newUser.save();
		res.status(201).json("User Created succesfully");
	} catch (error) {
		next(error);
	}
};

export const signin = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		//checking for valid user email address
		const validUser = await User.findOne({ email: email });
		if (!validUser) return next(errorHandler(404, "User not found"));
		//checking password
		// since it is encrypted need to check the hashed password
		const validPassword = bcryptjs.compareSync(password, validUser.password);
		if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));

		//Saving user object id in cookie
		const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
		//removing the password from the res.body sent as cookie
		const { password: pass, ...rest } = validUser._doc;
		res
			.cookie("access_token", token, { httpOnly: true })
			.status(200)
			.json(rest);
	} catch (error) {
		next(error);
	}
};

export const google = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (user) {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
			//removing the password from the res.body sent as cookie
			const { password: pass, ...rest } = user._doc;
			res
				.cookie("access_token", token, { httpOnly: true })
				.status(200)
				.json(rest);
		} else {
			const genratedPassword = Math.random().toString(36).slice(-8);
			const hashedPassword = bcryptjs.hashSync(genratedPassword, 10);
			const newUser = new User({
				username:
					req.body.name.split(" ").join("").toLowerCase() +
					Math.random().toString(36).slice(-4),
				email: req.body.email,
				password: hashedPassword,
				avatar: req.body.photo,
			});
			await newUser.save();
			const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
			//removing the password from the res.body sent as cookie
			const { password: pass, ...rest } = newUser._doc;
			res
				.cookie("access_token", token, { httpOnly: true })
				.status(200)
				.json(rest);
		}
	} catch (error) {
		next(error);
	}
};

export const signOut = async (req, res, next) => {
	try {
		res.clearCookie("access_token");
		res.status(200).json("User has been loged out");
	} catch (error) {
		next(error);
	}
};
