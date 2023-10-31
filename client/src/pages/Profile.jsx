import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";

import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	logOutUserStart,
	logOutUserFailure,
	logOutUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
	const { currentUser, loading, error } = useSelector((state) => state.user);
	const fileRef = useRef(null);
	const [file, setfile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [formData, setFormData] = useState({});
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [showListingsError, setShowListingsError] = useState(false);
	const [userListing, setUserListing] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file]);

	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
			},
			() => {
				setFileUploadError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					setFormData({ ...formData, avatar: downloadURL })
				);
			}
		);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};
	// console.log(formData);
	// console.log(userListing);
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			// console.log(data);
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
				return;
			}
			dispatch(updateUserSuccess(data));
		} catch (error) {
			dispatch(updateUserFailure(error.message));
			setUpdateSuccess(true);
		}
	};

	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};

	const handleSignOut = async () => {
		try {
			dispatch(logOutUserStart());
			const res = await fetch(`/api/auth/signout`);
			const data = await res.json();
			if (data.respose === false) {
				dispatch(logOutUserFailure(data.message));
				return;
			}
			dispatch(logOutUserSuccess(data));
		} catch (error) {
			dispatch(logOutUserFailure(error.message));
		}
	};

	const handleShowListings = async () => {
		try {
			setShowListingsError(false);
			const res = await fetch(`/api/user/listings/${currentUser._id}`);
			const data = await res.json();
			if (data.success === false) {
				setShowListingsError(true);
				return;
			}

			setUserListing(data);
		} catch (error) {
			setShowListingsError(true);
		}
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<input
					type="file"
					onChange={(e) => setfile(e.target.files[0])}
					ref={fileRef}
					hidden
					accept="image/*"
				/>
				<img
					onClick={() => fileRef.current.click()}
					className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
					src={formData.avatar || currentUser.avatar}
					alt="Profile Image"
				/>
				<p className="text-sm self-center">
					{fileUploadError ? (
						<span className="text-red-500">Error Image Upload</span>
					) : filePerc > 0 && filePerc < 100 ? (
						<span className="text-slate-500">Uploading {filePerc}%</span>
					) : filePerc === 100 ? (
						<span className="text-green-500">Image Upload Success!</span>
					) : (
						""
					)}
				</p>
				<input
					type="text"
					defaultValue={currentUser.username}
					placeholder="username"
					className="border p-3  rounded-lg"
					id="username"
					onChange={handleChange}
				/>
				<input
					type="email"
					placeholder="email"
					defaultValue={currentUser.email}
					className="border p-3  rounded-lg"
					id="email"
					onChange={handleChange}
				/>
				<input
					type="password"
					placeholder="password"
					className="border p-3  rounded-lg"
					id="password"
					onChange={handleChange}
				/>
				<button
					disabled={loading}
					className="rounded-lg border bg-blue-600 text-white p-3 uppercase hover:opacity-90 cursor-pointer disabled:opacity-80"
				>
					{loading ? "Loading..." : "Update"}
				</button>
				<Link
					to={"/create-listing"}
					className="bg-green-800 text-white rounded-lg uppercase p-3 text-center hover:opacity-80"
				>
					Create Listings
				</Link>
			</form>

			<div className="flex justify-between mt-5">
				<span
					onClick={handleDeleteUser}
					className="text-red-700 cursor-pointer"
				>
					Delete Account
				</span>
				<span onClick={handleSignOut} className="text-red-700 cursor-pointer">
					Sign Out
				</span>
			</div>

			<p className="text-red-700 mt-5">{error ? error : ""}</p>
			<p className="text-green-600 mt-5">
				{updateSuccess ? "User is Updated Succesfully" : ""}
			</p>

			<button onClick={handleShowListings} className="text-emerald-700 w-full">
				Show Listings
			</button>
			<p className="text-red-700 mt-5">
				{showListingsError ? "error show listing" : ""}
			</p>

			{userListing && userListing.length > 0 && (
				<div className="flex flex-col gap-3" id="Wrapper">
					<h1 className="text-center mt-7 text-2xl font-semibold">
						Your Listings
					</h1>
					{userListing.map((listing) => (
						<div
							key={listing._id}
							className="p-1 flex gap-2 items-center border  rounded-lg justify-between"
						>
							<Link to={`/listing/${listing._id}`}>
								<img
									src={listing.imageUrls[0]}
									alt="Listing Image"
									className="h-20 w-20 object-contain rounded-lg"
								/>
							</Link>

							<Link
								className="text-slate-600 font-semibold flex-1 hover:underline truncate"
								to={`/lsiting/${listing._id}`}
							>
								<p>{listing.name}</p>
							</Link>
							<div className="flex flex-col items-center">
								<button className="text-red-600 uppercase">Delete</button>
								<button className="text-emerald-600 uppercase">edit</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
