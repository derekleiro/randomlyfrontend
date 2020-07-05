import React, { useState, useEffect } from "react";

import firebase from "firebase/app";
import "firebase/auth";

import create from "../../../util/create";

import "./textarea.css";

const TextArea = () => {
	const user = JSON.parse(localStorage.getItem("user"));
	const [count, setCount] = useState(0);
	const [message, setMessage] = useState("");
	const [postUnsent, setState] = useState(true);
	const [token, setToken] = useState(null);
	const [UID, setUID] = useState(null);
	const [photoURL, setPhotoURL] = useState("");
	const [name, setName] = useState("");

	const messageDetails = (e) => {
		setCount(e.target.value.length);
		setMessage(e.target.value);
	};

	useEffect(() => {
		let unmounted = false;
		const getUserDetails = firebase.auth().onAuthStateChanged((user) => {
			if (user && !unmounted) {
				user
					.getIdToken(true)
					.then(function (idToken) {
						if (idToken && !unmounted) {
							setUID(user.uid);
							setToken(idToken);
							setPhotoURL(user.photoURL)
							setName(user.displayName)
						}
					})
					.catch(function (error) {
						console.log(error);
					});
			}
		});
		getUserDetails()
		return () => {
			unmounted = true;
		};
	}, []);

	const data = {
		photoURL: user ? user.photoURL : photoURL,
		token: token,
		name: user ? user.name : name,
		uid: UID,
	};

	const sendPost = async (e) => {
		e.preventDefault();
		setState(false);
		create(data.uid, message, data.token);
	};
	return (
		<div id="create-textarea">
			<div id="profile-picture-textarea">
				<img src={data.photoURL} alt={data.name} />
			</div>
			<div className="post-content-container">
				<form onSubmit={sendPost} method="POST">
					<textarea
						id="text-area"
						name="content"
						onChange={(e) => messageDetails(e)}
						placeholder="What's on your mind?"
					></textarea>
					<span id="submit">
						{count > 0 && count < 321 && postUnsent && message.trim() !== "" ? (
							<button style={{ opacity: "1" }} type="submit">
								post
							</button>
						) : (
							<button disabled>post</button>
						)}
					</span>
					<span
						style={{ margin: `0 5px` }}
						dangerouslySetInnerHTML={{ __html: `&#8226;` }}
					></span>
					<span
						id="text-count"
						style={{ color: count > 320 ? "#fc0060" : null }}
					>
						{count}
					</span>
					/320
				</form>
				<div id="textarea-avoid">
					<ol>
						<li>Avoid self promotion (your post will be supressed)</li>
						<li>Avoid posting links (all links are no follow)</li>
						<li>Avoid offensive language (be nice)</li>
						<li>
							To avoid mis-infomation about COVID-19, all posts related to it
							will have a WHO label pointing to the WHO official website
							accompanying the post
						</li>
					</ol>
				</div>
			</div>
		</div>
	);
};

export default TextArea;
