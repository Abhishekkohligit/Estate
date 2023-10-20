import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
	const [formData, setFormData] = useState({}); // from submition
	const [error, setError] = useState(null); //error handling
	const [loading, setLoading] = useState(false); // set loading
	const navigate = useNavigate(); //navigation post signup
	//getting user input & form data
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};
	//handle submittimg page
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// to prevent error crashing server
			setLoading(true);
			//create record
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			//error handling
			if (data.success === false) {
				setError(data.message);
				setLoading(false);
				return;
			}
			setLoading(false);
			setError(null);
			navigate("/");
			// console.log(data);
		} catch (error) {
			setLoading(false);
			setError(error.message);
		}
	};
	// }console.log(formData);
	return (
		<div className=" p-3 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				
				<input
					type="email"
					placeholder="Email"
					className="border p-3 rounded-lg"
					id="email"
					onChange={handleChange}
				/>
				<input
					type="password"
					placeholder="Password"
					className="border p-3 rounded-lg"
					id="password"
					onChange={handleChange}
				/>

				<button
					disabled={loading}
					className="bg-blue-900 text-white p-3 rounded-lg uppercase hover:opacity-90"
				>
					{loading ? "Loading" : "Sign In"}{" "}
					{/* if loading will not show signup */}
				</button>
			</form>
			<div className="flex gap-2 mt-4">
				<p>Do Not Have an account? </p>
				<Link to={"/sign-up"}>
					<span className="text-blue-600"> Sign Up</span>
				</Link>
			</div>
			{error && <p className="text-red-500 mt-5">{error}</p>}
		</div>
	);
}
