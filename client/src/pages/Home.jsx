/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
	const [offerListings, setOfferListings] = useState([]);
	const [saleListings, setSaleListings] = useState([]);
	const [rentListings, setRentListings] = useState([]);
	SwiperCore.use(Navigation);
	// console.log(saleListings);
	useEffect(() => {
		const fetchOfferListings = async () => {
			try {
				const res = await fetch("/api/listing/get?offer=true&limit=4");
				const data = await res.json();
				setOfferListings(data);
				fetchRentListings();
			} catch (error) {
				console.log(error);
			}
		};
		const fetchRentListings = async () => {
			try {
				const res = await fetch("/api/listing/get?type=rent&limit=4");
				const data = await res.json();
				setRentListings(data);
				fetchSaleListings();
			} catch (error) {
				console.log(error);
			}
		};

		const fetchSaleListings = async () => {
			try {
				const res = await fetch("/api/listing/get?type=sale&limit=4");
				const data = await res.json();
				setSaleListings(data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchOfferListings();
	}, []);

	return (
		<div className="">
			{/* top */}
			<div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
				<h1 className="text-blue-800 font-bold text-3xl lg:text-6xl">
					Find your Next <span className="text-blue-600">Perfect</span> place
					with ease
				</h1>
				<br />
				<div className="text-slate-700 text-xs sm:text-sm ">
					Sahand Estate is the best place to find your next perfect place to
					live.
					<br />
					We have a wide range of properties for you to choose from.
				</div>
				<Link
					className="text-xs sm:text-sm font-bold text-emerald-600 hover:underline"
					to={"/search"}
				>
					Let's get started...
				</Link>
			</div>

			{/* swiper */}
			<Swiper navigation>
				{offerListings &&
					offerListings.length > 0 &&
					offerListings.map((listing) => (
						<SwiperSlide key={offerListings._id}>
							<div
								style={{
									background: `url(${listing.imageUrls[0]}) center no-repeat`,
									backgroundSize: "cover",
								}}
								className="h-[500px]"
								key={offerListings._id}
							></div>
						</SwiperSlide>
					))}
			</Swiper>

			{/* listing cards */}
			<div className="max-w-full mx-auto p-3 flex flex-col gap-8 my-10">
				{offerListings && offerListings.length > 0 && (
					<div className="">
						<div className="">
							<h2 className="text-blue-800 font-bold text-3xl lg:text-6xl">
								Recent Offers
							</h2>
							<Link
								className="text-emerald-700 hover:underline"
								to={"/search?offer=true"}
							>
								Show More Offers
							</Link>
						</div>
						<div className="flex flex-wrap gap-4 ">
							{offerListings.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}

				{/* rent */}
				{rentListings && rentListings.length > 0 && (
					<div className="">
						<div className="">
							<h2 className="text-blue-800 font-bold text-3xl lg:text-6xl">
								Recent Rent Locations
							</h2>
							<Link
								className="text-emerald-700 hover:underline"
								to={"/search?offer=true"}
							>
								Show More Rent Locations
							</Link>
						</div>
						<div className="flex flex-wrap gap-4 ">
							{rentListings.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}

				{/* sale */}
				{saleListings && saleListings.length > 0 && (
					<div className="">
						<div className="">
							<h2 className="text-blue-800 font-bold text-3xl lg:text-6xl">
								Recent Sale Locations
							</h2>
							<Link
								className="text-emerald-700 hover:underline"
								to={"/search?offer=true"}
							>
								Show More Sale Locations
							</Link>
						</div>
						<div className="flex flex-wrap gap-4 ">
							{saleListings.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
