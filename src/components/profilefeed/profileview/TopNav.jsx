import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

import back from "../../../assets/icons/back2.png";
import message from "../../../assets/icons/send.png";

import "../../topnavstyle/topnav.css";

const TopNav = (props) => {
	const uid = window.location.href.substring(
		window.location.href.lastIndexOf("/") + 1
	);
	const [name, setName] = useState("");
	const [isYou, setisYou] = useState(false);
	useEffect(() => {
		let unmounted =	false;
		const getName = async () => {
			try {
				firebase.auth().onAuthStateChanged((user) => {
					if (user) {
						if (user.uid === uid && !unmounted) {
							setisYou(true);
						}

						user.getIdToken(true).then(async (idToken) => {
							if (idToken) {
								const response = await fetch(
									`http://localhost:5000/u?u=${uid}&token=${idToken}`
								);
								if (response.ok) {
									const JSONResponse = await response.json();
									if (JSONResponse && !unmounted) {
										setName(JSONResponse.name);
									}
								}
							}
						});
					}
				});
			} catch (e) {
				console.log(e);
			}
		};

		getName();

		return () =>{
			unmounted = true;
		}
	}, [uid]);

	return (
		<>
			{isYou ? (
				<div className="top-nav">
					<span id="top-nav-left">
						<img
							onClick={() => props.history.goBack()}
							src={back}
							alt="Go back"
						/>
					</span>
					You
				</div>
			) : (
				<div className="top-nav">
					<span id="top-nav-left">
						<img
							onClick={() => props.history.goBack()}
							src={back}
							alt="Go back"
						/>
					</span>
					{name ? name : "Profile"}
					<span id="top-nav-right">
						<Link to={`/chat/${uid}`}>
							<img src={message} alt={`send a message to ${name}`} />
						</Link>
					</span>
				</div>
			)}
		</>
	);
};

export default withRouter(TopNav);
