// import React from 'react'

import { useState } from "react";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function CreateListing() {
	const [files, setfiles] = useState([]);
	const [formData, setFormData] = useState({
		imageUrls: [],
	});

	const [imageUploadError, setImageUploadError] = useState(false);
	const [uploading, setUploading] = useState(false);

	console.log(formData);
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
					console.log(progress);
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
	// eslint-disable-next-line no-unused-vars
	const handleImageSubmit = (e) => {
		// e.preventDefault();
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
			console.log(promises);
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
	return (
		<main className="p-3 max-w-4xl mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">
				Create A Listing
			</h1>
			<form className="flex flex-col sm:flex-row gap-4">
				<div className="flex flex-col gap-3 flex-1">
					<input
						type="text"
						placeholder="Name"
						className="border p-3 rounded-lg"
						id="name"
						minLength="10"
						maxLength="62"
						required
					/>
					<input
						type="text"
						placeholder="Description"
						className="border p-3 rounded-lg"
						id="description"
						required
					/>
					<input
						type="text"
						placeholder="Address"
						className="border p-3 rounded-lg"
						id="address"
						required
					/>
					<div className="flex flex-wrap gap-4">
						<div className="flex gap-2">
							<input type="checkbox" id="sale" className="w-5" />
							<span>Sell</span>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="rent" className="w-5" />
							<span>Rent</span>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="parking" className="w-5" />
							<span>Parking Spot</span>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="furnished" className="w-5" />
							<span>Furnished</span>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="offer" className="w-5" />
							<span>Offer</span>
						</div>
					</div>
					<div className="flex flex-wrap gap-4">
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border-blue-500 rounded-lg w-16"
								type="number"
								id="bedrooms"
								min="1"
								max="10"
								required
							/>
							<p className="">Beds</p>
						</div>
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border-blue-500 rounded-lg w-16"
								type="number"
								id="bathrooms"
								min="1"
								max="10"
								required
							/>
							<p className="">Baths</p>
						</div>
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border-blue-500 rounded-lg w-16"
								type="number"
								id="regulerPrice"
								required
							/>
							<div className="flex flex-col items-center">
								<p className="">Reguler Price</p>
								<span className="text-xs">($/Month)</span>
							</div>
						</div>
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border-blue-500 rounded-lg w-16"
								type="number"
								id="discounPrice"
								required
							/>
							<div className="flex flex-col items-center">
								<p className="">Discounted Price</p>
								<span className="text-xs">($/Month)</span>
							</div>
						</div>
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
								key={url.id}
								className="flex justify-between p-3 items-center border-blue-900"
							>
								<img
									src={url}
									alt="listing image"
									key={url.id}
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
					<button className="p-3 bg-blue-900 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80">
						Create Listing
					</button>
				</div>
			</form>
		</main>
	);
}
