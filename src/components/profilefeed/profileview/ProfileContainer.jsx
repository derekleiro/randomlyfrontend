import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

import LoadingScreen from "../../loadingscreen/LoadingScreen";

import missing from "../../../assets/icons/missing.png";

import "../profilecontainer/profilecontainer.css";

const ProfileContainer = () => {
	const [data, setData] = useState(null);
	const uid = window.location.href.substring(
		window.location.href.lastIndexOf("/") + 1
	);
	const [isYou, setisYou] = useState(false);
	const [loadingState, setState] = useState(true);

	useEffect(() => {
		let unmounted = false;
		const getUser = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					if (user.uid === uid && !unmounted) {
						setisYou(true);
					}

					user.getIdToken(true).then(async (idToken) => {
						if (idToken) {
							try {
								const response = await fetch(
									`http://localhost:5000/u?u=${uid}&token=${idToken}`
								);
								if (response) {
									const JSONresponse = await response.json();
									if (JSONresponse) {
										if (!unmounted) {
											setData(JSONresponse);
											setState(false);
										}
									}
								}
							} catch (e) {
								console.log(e);
							}
						}
					});
				}
			});
		};
		getUser();

		return () => {
			unmounted = true;
		};
	}, [uid]);

	return (
		<div id="profile-contain-info">
			<LoadingScreen loadingState={loadingState} />
			<div id="profile-contain-image">
				<img
					src={data ? data.photoURL : missing}
					alt={data ? data.name : "profile"}
				/>
			</div>
			<span id="profile-contain-name">{data ? data.name : "Profile"}</span>
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

			{isYou ? null : (
				<Link to={`/chat/${uid}`}>
					<div id="profile-send-message">Message</div>
				</Link>
			)}
		</div>
	);
};

export default ProfileContainer;
