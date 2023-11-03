/* eslint-disable react/prop-types */
// import React from 'react'
import { Link } from "react-router-dom";
import { MdLocationOn, MdBed, MdBathtub } from "react-icons/md";

export default function ListingItem({ listing }) {
	return (
		<div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
			<Link to={`/listing/${listing._id}`}>
				<img
					src={
						listing.imageUrls[0] ||
						"https://atriarealestate.com.au/wp-content/uploads/2023/09/Copy-of-10-Companies-That-Hire-for-Remote-Real-Estate-Jobs.jpeg"
					}
					alt="Listing cover"
					className="h-[320px] sm:h-[220px] object-cover w-full hover:scale-105 transition-scale duration-300"
				/>
				<div className="p-3 flex flex-col gap-2">
					<p className="text-lg font-semibold text-blue-900 truncate">
						{listing.name}
					</p>
					<div className="flex items-center text-blue-900 gap-1">
						<MdLocationOn className="text-emerald-600 h-4 w-4" />
						<p className="text-sm truncate w-full">{listing.address}</p>
					</div>
					<p className="text-sm text-blue-900 opacity-80 line-clamp-2">
						{listing.description}
					</p>
					<p className=" text-blue-900 opacity-95 font-semibold mt-2 ">
						$
						{listing.offer
							? listing.discountPrice.toLocaleString("en-us")
							: listing.regularPrice.toLocaleString("en-us")}
						{listing.type === "rent" && " /Month"}
					</p>
					<div className="flex items-center gap-1">
						<div className=" flex items-center gap-1 text-purple-900 opacity-80">
							<MdBed className="h-6 w-6" /> {listing.bedRooms}
						</div>
						<div className=" flex items-center gap-1 text-purple-900 opacity-90">
							<MdBathtub className="h-5 w-5" /> {listing.bedRooms}
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}
