import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

//mondodb connection
mongoose
	.connect(process.env.MONGO)
	.then(() => {
		console.log("MNG COnnected");
	})
	.catch((err) => {
		console.log(err);
	});

	// starting server
const app = express();
app.use(express.json());
app.listen(3000, () => {
	console.log("Server is running on port 3000!!!");
});

//routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// error middleware
app.use((err,req,res,next)=>{
	const statuscode =err.statuscode || 500;
	const message =err.message || 'Internal Server Error';
	return res.status(statuscode).json({
		success:false,
		statuscode:statuscode,
		message:message
	});
})
