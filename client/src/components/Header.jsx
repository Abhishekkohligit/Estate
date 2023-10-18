import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
	return (
		<header className="bg-blue-300 shadow-md">
			<div className="flex justify-between max-w-6xl mx-auto p-3">
				<Link to="/">
					<h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
						<span className="text-blue-700">Abhishek</span>
						<span className="text-blue-500">Estate</span>
					</h1>
				</Link>
				<form className="bg-blue-200 p-3 rounded-lg flex items-center">
					<input
						className="bg-transparent focus:outline-none w-24 sm:w-64"
						type="text"
						placeholder="Search..."
					/>
					<FaSearch className="text-blue-500 " />
				</form>
				<ul className="flex gap-4">
					<Link to="/">
						<li className="hidden sm:inline text-blue-500 hover:underline">
							Home
						</li>
					</Link>
					<Link to="/about">
						<li className="hidden sm:inline text-blue-500 hover:underline">
							About
						</li>
					</Link>
					<Link to="/sign-in">
						<li className=" text-blue-500 hover:underline">Sign In</li>
					</Link>
				</ul>
			</div>
		</header>
	);
}
