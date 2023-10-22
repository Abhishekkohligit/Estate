import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bycryptjs from "bcryptjs";

export const test = (req, res) => {
	res.json({
		message: "hello from API test",
	});
};

export const updateUser = async (req, res, next) => {
	if (req.user.id !== req.params.id)
		return next(errorHandler(401, "Not a valid user"));
	try {
		if (req.body.password) {
			req.body.password = bycryptjs.hashSync(req.body.password, 10); //hashing password
		}
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					username: req.body.username,
					email: req.body.email,
					password: req.body.password,
					avatar: req.body.avatar,
				}, // to only update the changed fields
			},
			{ new: true }
		); // to updat with new data )

		const { password, ...rest } = updatedUser._doc;
		res.status(200).json(rest);
	} catch (error) {
		next(error);
	}
};
