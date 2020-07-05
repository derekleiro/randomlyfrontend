import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";

import missing from "../../../assets/icons/missing.png";

import { notificationCount } from "../../../actions/notificationCount";

import "./profilecontainer.css";

const ProfileContainer = () => {
	const dispatch = useDispatch();
	const [data, setData] = useState(
		JSON.parse(localStorage.getItem("userInfo"))
	);
	const photoURL = JSON.parse(localStorage.getItem("user"))
		? JSON.parse(localStorage.getItem("user")).photoURL
		: "";
	const name = JSON.parse(localStorage.getItem("user"))
		? JSON.parse(localStorage.getItem("user")).name
		: "";
	const offline = (data ? data.bio : null) && photoURL && name;

	useEffect(() => {
		let unmounted = false;
		const getUser = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					user.getIdToken(true).then(async (idToken) => {
						if (idToken) {
							try {
								const response = await fetch(
									`http://localhost:5000/user?u=${user.uid}&token=${idToken}`
								);
								if (response) {
									const JSONresponse = await response.json();
									if (JSONresponse) {
										if (!unmounted) {
											setData(JSONresponse.user);
										}
										dispatch(notificationCount(JSONresponse.notificationCount));
										localStorage.setItem(
											"userInfo",
											JSON.stringify({
												bio: JSONresponse.user.bio,
												interests: JSONresponse.user.interests,
											})
										);
										localStorage.setItem(
											"user",
											JSON.stringify({
												photoURL: JSONresponse.user.photoURL,
												name: JSONresponse.user.name,
											})
										);
									}
								}
							} catch (e) {
								console.log(e);
							}
						}
					});
				}
			});
		}
		if (!offline) {
			getUser();
		}

		return () => {
			unmounted = true;
		};
	}, [offline, dispatch]);

	return (
		<div id="profile-contain-info">
			<div id="profile-contain-image">
				<img src={photoURL ? photoURL : missing} alt={name ? name : ""} />
			</div>
			<span id="profile-contain-name">{name ? name : ""}</span>
			{data ? (
				data.interests ? (
					<>
						<span
							style={{ margin: `0 5px` }}
							dangerouslySetInnerHTML={{ __html: `&#8226;` }}
						></span>
						<span id="profile-contain-interests">
							{data ? data.interests : ""}
						</span>{" "}
					</>
				) : null
			) : null}

			<div id="profile-contain-caption">{data ? data.bio : ""}</div>
		</div>
	);
};

export default ProfileContainer;
