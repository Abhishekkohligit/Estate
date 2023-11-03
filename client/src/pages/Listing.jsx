import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

import {
	FaBath,
	FaBed,
	FaChair,
	FaMapMarkerAlt,
	FaParking,
	FaShare,
} from "react-icons/fa";

import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {
	SwiperCore.use([Navigation]);
	const params = useParams();
	const { currentUser } = useSelector((state) => state.user);
	const [listing, setListing] = useState({
		imageUrls: [],
		name: "",
		description: "",
		address: "",
		type: "rent",
		bedRooms: 1,
		bathRooms: 1,
		regularPrice: "50",
		discountPrice: "0",
		offer: false,
		parking: false,
		furnished: false,
	});

	// console.log(listing.userRef, currentUser);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [copied, setCopied] = useState(false);
	const [contact, setContact] = useState(false);
	useEffect(() => {
		const fetchListing = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/listing/get/${params.listingId}`);
				const data = await res.json();
				if (data.success === false) {
					setError(true);
					setLoading(false);
					return;
				}
				setListing(data);
				setLoading(false);
				setError(false);
			} catch (error) {
				setError(true);
				setLoading(false);
			}
		};
		fetchListing();
	}, [params.listingId]);

	return (
		<main>
			{loading && (
				<p className="text-2xl text-center my-7 text-blue-800">Loading... </p>
			)}

			{error && (
				<p className="text-2xl text-center my-7 text-red-800">
					Oops Something went wrong :-()
				</p>
			)}

			{listing && !loading && !error && (
				<div className="p-2">
					<Swiper navigation>
						{listing.imageUrls.map((url, index) => (
							<SwiperSlide key={index}>
								<div
									className="h-[550px] w-full"
									style={{
										background: `url(${url}) center no-repeat`,
										backgroundSize: "cover",
									}}
								></div>
							</SwiperSlide>
						))}
					</Swiper>
					<div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
						<FaShare
							className="text-slate-500"
							onClick={() => {
								navigator.clipboard.writeText(window.location.href);
								setCopied(true);
								setTimeout(() => {
									setCopied(false);
								}, 2000);
							}}
						/>
					</div>
					{copied && (
						<p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
							Link copied!
						</p>
					)}

					<div className="flex flex-col max-w-4xl mx-auto p-5 my-3 gap-4">
						<p className="text-2xl font-semibold">
							{listing.name} - ${" "}
							{listing.offer
								? listing.discountPrice.toLocaleString("en-US")
								: listing.regularPrice.toLocaleString("en-US")}
							{listing.type === "rent" && " / month"}
						</p>
						<p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
							<FaMapMarkerAlt className="text-green-700" />
							{listing.address}
						</p>
						<div className="flex gap-4 mt-3">
							<p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
								{listing.type === "rent" ? "For Rent" : "For Sale"}
							</p>
							{listing.offer && (
								<p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
									${+listing.regularPrice - +listing.discountPrice}
								</p>
							)}
						</div>
						<p className="text-slate-700 pt-3">
							<span className="font-semibold text-black">Description - </span>
							{listing.description}
						</p>
						<ul className="whitespace-nowrap text-emerald-800 font-semibold text-sm flex items-center gap-2 sm:gap-6 flex-wrap">
							<li className="flex items-center gap-1">
								<FaBed className="text-lg" />
								{listing.bedRooms > 1
									? `${listing.bedRooms} Beds`
									: `${listing.bedRooms} Bed`}
							</li>
							<li className="flex items-center gap-1">
								<FaBath className="text-lg" />
								{listing.bathRooms > 1
									? `${listing.bathRooms} Baths`
									: `${listing.bathRooms} Bath`}
							</li>
							<li className="flex items-center gap-1">
								<FaParking className="text-lg" />
								{listing.parking ? "Parking spot" : "No Parking"}
							</li>
							<li className="flex items-center gap-1">
								<FaChair className="text-lg" />
								{listing.furnished ? "Furnished" : "Un-Furnished"}
							</li>
						</ul>
						{currentUser && listing.userRef !== currentUser._id && !contact && (
							<button
								onClick={() => {
									setContact(true);
								}}
								className="bg-blue-900 text-white rounded-lg uppercase p-3 hover:opacity-90"
							>
								Contact Landloard
							</button>
						)}
						{contact && <Contact listing ={listing}/>}
					</div>
				</div>
			)}
		</main>
	);
}
