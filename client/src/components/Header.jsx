import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
	const { currentUser } = useSelector((state) => state.user);
	const [searchTerm, setSearchTerm] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("searchTerm", searchTerm);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		if (searchTermFromUrl) {
			setSearchTerm(searchTermFromUrl);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.search]);
	return (
		<header className="bg-blue-300 shadow-md">
			<div className="flex justify-between max-w-6xl mx-auto p-3">
				<Link to="/">
					<h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
						<span className="text-blue-700">Abhishek</span>
						<span className="text-blue-500">Estate</span>
					</h1>
				</Link>
				<form
					onSubmit={handleSubmit}
					className="bg-blue-200 p-3 rounded-lg flex items-center"
				>
					<input
						className="bg-transparent focus:outline-none w-24 sm:w-64"
						type="text"
						placeholder="Search..."
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
						}}
					/>
					<button>
						<FaSearch className="text-blue-500 cursor-pointer " />
					</button>
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
					<Link to="/Profile">
						{currentUser ? (
							<img
								className="rounded-full h-7 w-7 object-cover"
								src={currentUser.avatar}
								alt="Profile"
							/>
						) : (
							<li className=" text-blue-500 hover:underline">Sign In</li>
						)}
					</Link>
				</ul>
			</div>
		</header>
	);
}
