import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
export default function Listing() {
	SwiperCore.use([Navigation]);
	const params = useParams();
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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
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

			{listing && (
				<div className=" object-contain">
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
				</div>
			)}
		</main>
	);
}
