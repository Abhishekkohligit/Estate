import { Link } from "react-router-dom";

export default function SignUp() {
	return (
		<div className=" p-3 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

			<form className="flex flex-col gap-4">
				<input
					type="text"
					placeholder="User Name"
					className="border p-3 rounded-lg"
					id="username"
				/>
				<input
					type="email"
					placeholder="Email"
					className="border p-3 rounded-lg"
					id="email"
				/>
				<input
					type="password"
					placeholder="Password"
					className="border p-3 rounded-lg"
					id="password"
				/>

				<button className="bg-blue-900 text-white p-3 rounded-lg uppercase hover:opacity-90">
					Sign up
				</button>
			</form>
			<div className="flex gap-2 mt-4">
				<p>Have an account? </p>
				<Link to={"/sign-in"}>
					<span className="text-blue-600"> Sign In</span>
				</Link>
			</div>
		</div>
	);
}
