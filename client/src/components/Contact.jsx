/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
	const [landlord, setLandlord] = useState(null);
	const [message, setmessage] = useState("");

	useEffect(() => {
		const fetchLandLord = async () => {
			try {
				const res = await fetch(`/api/user/${listing.userRef}`);
				const data = await res.json();
				setLandlord(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchLandLord();
	}, [listing.userRef]);

	return (
		<div>
			{landlord && (
				<div className="flex-col flex gap-2">
					<p>
						Contact{" "}
						<span
							className="font-semibold
						"
						>
							{landlord.username}
						</span>{" "}
						for <span className="lowercase font-semibold ">{listing.name}</span>
					</p>
					<textarea
						name="message"
						id="message"
						rows="2"
						value={message}
						onChange={(e) => {
							setmessage(e.target.value);
						}}
						placeholder="Message for Landlord"
						className="w-full border p-3 rounded-lg "
					></textarea>
					<Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
					className="bg-blue-900 text-white text-center p-3 uppercase rounded-lg hover:opacity-70 "
					>
					Send Message
					</Link>
				</div>
			)}
		</div>
	);
}
