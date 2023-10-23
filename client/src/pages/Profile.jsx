import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
} from "../redux/user/userSlice";

export default function Profile() {
	const { currentUser, loading, error } = useSelector((state) => state.user);
	const fileRef = useRef(null);
	const [file, setfile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [formData, setFormData] = useState({});
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
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
			(error) => {
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
			</form>

			<div className="flex justify-between mt-5">
				<span className="text-red-700 cursor-pointer">Delete Account</span>
				<span className="text-red-700 cursor-pointer">Sign Out</span>
			</div>

			<p className="text-red-700 mt-5">{error ? error : ""}</p>
			<p className="text-green-600 mt-5">
				{updateSuccess ? "User is Updated Succesfully" : ""}
			</p>
		</div>
	);
}
