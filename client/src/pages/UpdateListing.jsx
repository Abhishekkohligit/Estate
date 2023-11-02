// import React from 'react'

import { useEffect, useState } from "react";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
	const { currentUser } = useSelector((state) => state.user);
	const [files, setfiles] = useState([]);
	const [formData, setFormData] = useState({
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
	const navigate = useNavigate();
	const params = useParams();

	const [errorForm, setErrorForm] = useState(false);
	const [loading, setLoading] = useState(false);

	const [imageUploadError, setImageUploadError] = useState(false);
	const [uploading, setUploading] = useState(false);

	// console.log(formData);
	useEffect(() => {
		const fetchListing = async () => {
			const listingId = params.listingId;
			// console.log(listingId);
			const res = await fetch(`/api/listing/get/${listingId}`);
			const data = await res.json();
			if (data.success === false) {
				console.log(data.message);
				return;
			}
			setFormData(data);
		};
		fetchListing();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const storeImage = async (file) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log(Math.round(progress));
				},
				(error) => {
					reject(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						resolve(downloadURL);
					});
				}
			);
		});
	};

	const handleImageSubmit = (e) => {
		e.preventDefault();
		if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
			setUploading(true);
			setImageUploadError(false);
			const promises = [];
			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]));
			}
			Promise.all(promises)
				.then((urls) => {
					setFormData({
						...formData,
						imageUrls: formData.imageUrls.concat(urls),
					});
					setImageUploadError(false);
					setUploading(false);
				})
				.catch((err) => {
					setImageUploadError(`"image Upload  failed "+ ${err.message}`);
					setUploading(false);
				});
			// console.log(promises);
		} else {
			setImageUploadError("you can only upload 6 images");
			setUploading(false);
		}
	};
	// console.log(files)

	const handleRemoveImage = (index) => {
		setFormData({
			...formData,
			imageUrls: formData.imageUrls.filter((url, i) => i !== index),
		});
	};

	const handleChangeForm = (e) => {
		if (e.target.id === "sale" || e.target.id === "rent") {
			setFormData({
				...formData,
				type: e.target.id,
			});
		}

		if (
			e.target.id === "parking" ||
			e.target.id === "furnished" ||
			e.target.id === "offer"
		) {
			setFormData({
				...formData,
				[e.target.id]: e.target.checked,
			});
		}

		if (
			e.target.type === "number" ||
			e.target.type === "text" ||
			e.target.type === "textarea"
		) {
			setFormData({ ...formData, [e.target.id]: e.target.value });
		}
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		try {
			//check for image upload
			if (formData.imageUrls.length < 1)
				return setErrorForm("You must upload at least 1 Image");
			// check for sicount price
			if (+formData.regularPrice < +formData.discountPrice)
				return setErrorForm("Discount price must be lower than Regular Price");

			setLoading(false);
			setErrorForm(false);
			const res = await fetch(`/api/listing/update/${params.listingId}`, {
				method: "post",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id,
				}),
			});
			const data = await res.json();
			setLoading(false);
			if (data.success === false) {
				setErrorForm(data.message);
			}
			navigate(`/listing/${data._id}`);
		} catch (error) {
			setErrorForm(error.message);
			setLoading(false);
		}
	};
	return (
		<main className="p-3 max-w-4xl mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">
				Update A Listing
			</h1>
			<form
				onSubmit={handleFormSubmit}
				className="flex flex-col sm:flex-row gap-4"
			>
				<div className="flex flex-col gap-3 flex-1">
					<input
						type="text"
						placeholder="Name"
						className="border p-3 rounded-lg"
						id="name"
						minLength="10"
						maxLength="62"
						required
						onChange={handleChangeForm}
						value={formData.name}
					/>
					<textarea
						type="text"
						placeholder="Description"
						className="border p-3 rounded-lg"
						id="description"
						required
						onChange={handleChangeForm}
						value={formData.description}
					/>
					<input
						type="text"
						placeholder="Address"
						className="border p-3 rounded-lg"
						id="address"
						required
						onChange={handleChangeForm}
						value={formData.address}
					/>
					<div className="flex flex-wrap gap-4">
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="sale"
								className="w-5"
								onChange={handleChangeForm}
								checked={formData.type === "sale"}
							/>
							<span>Sell</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="rent"
								className="w-5"
								onChange={handleChangeForm}
								checked={formData.type === "rent"}
							/>
							<span>Rent</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="parking"
								className="w-5"
								onChange={handleChangeForm}
								checked={formData.parking}
							/>
							<span>Parking Spot</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="furnished"
								className="w-5"
								onChange={handleChangeForm}
								checked={formData.furnished}
							/>
							<span>Furnished</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="offer"
								className="w-5"
								onChange={handleChangeForm}
								checked={formData.offer}
							/>
							<span>Offer</span>
						</div>
					</div>
					<div className="flex flex-wrap gap-4">
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border-blue-500 rounded-lg w-16"
								type="number"
								id="bedRooms"
								min="1"
								max="10"
								required
								onChange={handleChangeForm}
								value={formData.bedRooms}
							/>
							<p className="">Beds</p>
						</div>
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border-blue-500 rounded-lg w-16"
								type="number"
								id="bathRooms"
								min="1"
								max="10"
								required
								onChange={handleChangeForm}
								value={formData.bathRooms}
							/>
							<p className="">Baths</p>
						</div>
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border-blue-500 rounded-lg w-24"
								type="number"
								id="regularPrice"
								min="50"
								max="10000000000"
								required
								onChange={handleChangeForm}
								value={formData.regularPrice}
							/>
							<div className="flex flex-col items-center">
								<p className="">Reguler Price</p>
								{formData.type === "rent" && (
									<span className="text-xs">($/Month)</span>
								)}
							</div>
						</div>
						{formData.offer && (
							<div className="flex gap-2 items-center">
								<input
									className="p-3 border-blue-500 rounded-lg w-24"
									type="number"
									id="discountPrice"
									required
									min="0"
									max="10000000"
									onChange={handleChangeForm}
									value={formData.discountPrice}
								/>
								<div className="flex flex-col items-center">
									<p className="">Discounted Price</p>
									{formData.type === "rent" && (
										<span className="text-xs">($/Month)</span>
									)}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-col flex-1 gap-4">
					<p className="font-semibold">
						Images:
						<span className="font-normal text-gray-500 ml-2">
							The First image will be cover( max6)
						</span>
					</p>
					{formData.imageUrls.length > 0 &&
						formData.imageUrls.map((url, index) => (
							<div
								key={index}
								className="flex justify-between p-3 items-center border-blue-900"
							>
								<img
									src={url}
									alt="listing image"
									key={index}
									className="w-20 h-20 object-cover rounded-lg"
								/>

								<button
									type="button"
									onClick={() => handleRemoveImage(index)}
									className="p-3 uppercase text-red-700  hover:opacity-75 "
								>
									Delete
								</button>
							</div>
						))}

					<div className="flex gap-4">
						<input
							onChange={(e) => setfiles(e.target.files)}
							className="p-3 border-blue-400 rounded w-full"
							type="file"
							id="images"
							accept="image/*"
							multiple
						/>
						<p className="text-red-500 text-center">
							{imageUploadError && imageUploadError}
						</p>
						<button
							type="button"
							onClick={handleImageSubmit}
							disabled={uploading}
							className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
						>
							{uploading ? "Uploading " : "Upload"}
						</button>
					</div>
					<button
						disabled={loading || uploading}
						className="p-3 bg-blue-900 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80"
					>
						{loading ? "Updating..." : "Update Listing"}
					</button>
					{errorForm && <p className="text-red-500">{errorForm}</p>}
				</div>
			</form>
		</main>
	);
}
