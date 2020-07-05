import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import moment from "moment";

import TopNav from "./topnav/TopNav";
import TextBar from "./textbar/TextBar";
import MyBubble from "./mybubble/MyBubble";
import YourBubble from "./yourbubble/YourBubble";

import LoadingScreen from "../../loadingscreen/LoadingScreen";

import missing from "../../../assets/icons/missing.png";

import "./chatroom.css";

const ChatRoom = (props) => {
	const r_uid = window.location.href.substring(
		window.location.href.lastIndexOf("/") + 1
	);

	const [uid, setUID] = useState(null);
	const [UserData, setUserData] = useState(null);
	const [data, setData] = useState([]);
	const [state, setState] = useState(true);

	const sentMessageHandler = (message) => {
		setData([].concat(...data, message));
	};

	const setTime = (timestamp) => {
		if (moment.utc(timestamp).local().calendar().includes("Today")) {
			return "Today";
		} else {
			return moment.utc(timestamp).local().format("M/DD/YYYY");
		}
	};

	const [fade, setFade] = useState(false);
	useEffect(() => {
		let unmounted = false;

		if (!unmounted) {
			setTimeout(() => setFade(true), 200);
		}

		return () => {
			unmounted = true;
		};
	}, []);

	useEffect(() => {
		let unmounted = false;

		const getUserInfo = () => {
			try {
				firebase.auth().onAuthStateChanged((user) => {
					if (user && !unmounted) {
						setUID(user.uid);
						user.getIdToken(true).then(async (idToken) => {
							if (idToken) {
								const response = await fetch(
									`http://localhost:5000/u?u=${r_uid}&token=${idToken}`
								);
								if (response.ok) {
									const JSONResponse = await response.json();
									if (JSONResponse && !unmounted) {
										setUserData(JSONResponse);
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

		const conversations = () => {
			try {
				firebase.auth().onAuthStateChanged((user) => {
					if (user && !unmounted) {
						user.getIdToken(true).then(async (idToken) => {
							if (idToken) {
								const response = await fetch(
									`http://localhost:5000/messenger?uid=${user.uid}&r_uid=${r_uid}&token=${idToken}`
								);
								if (response.ok) {
									const JSONResponse = await response.json();
									if (JSONResponse && !unmounted) {
										setState(false)
										setData([].concat(...data, JSONResponse.messages));
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
		getUserInfo();
		conversations();

		return () => {
			unmounted = true;
		};
	}, [r_uid]);

	return (
		<div id="chat-room" style={{ opacity: fade ? 1 : 0 }}>
			<LoadingScreen loadingState={state} />
			<TopNav name={UserData ? UserData.name : null} uid={uid} />
			<div id="chat-room-space">
				{data.length !== 0
					? data.map((message, index) => {
							const nextItem = data[index + 1];
							const previousItem = data[index - 1];

							if (message) {
								if (message.uid === uid) {
									return (
										<div key={index}>
											<>
												{!previousItem ? (
													<div className="conversation-date">
														{setTime(message.timestamp)}
													</div>
												) : null}
											</>
											<>
												{previousItem ? (
													setTime(previousItem.timestamp) ===
													setTime(message.timestamp) ? null : (
														<div className="conversation-date">
															{setTime(message.timestamp)}
														</div>
													)
												) : null}
											</>
											<MyBubble
												text={message.message}
												timestamp={message.timestamp}
											/>
										</div>
									);
								} else {
									if (!previousItem) {
										return (
											<div key={index}>
												<>
													{!previousItem ? (
														<div className="conversation-date">
															{setTime(message.timestamp)}
														</div>
													) : null}
												</>
												<>
													{previousItem ? (
														setTime(previousItem.timestamp) ===
														setTime(message.timestamp) ? null : (
															<div className="conversation-date">
																{setTime(message.timestamp)}
															</div>
														)
													) : null}
												</>
												<YourBubble
													text={message.message}
													photoURL={UserData ? UserData.photoURL : missing}
													name={UserData ? UserData.name : "Profile"}
													uid={r_uid}
													timestamp={message.timestamp}
												/>
											</div>
										);
									}
									if (
										previousItem
											? previousItem.uid === uid
												? true
												: false
											: true || nextItem
											? nextItem.uid === uid
												? true
												: false
											: true
									) {
										return (
											<div key={index}>
												<>
													{!previousItem ? (
														<div className="conversation-date">
															{setTime(message.timestamp)}
														</div>
													) : null}
												</>
												<>
													{previousItem ? (
														setTime(previousItem.timestamp) ===
														setTime(message.timestamp) ? null : (
															<div className="conversation-date">
																{setTime(message.timestamp)}
															</div>
														)
													) : null}
												</>
												<YourBubble
													text={message.message}
													photoURL={UserData ? UserData.photoURL : missing}
													name={UserData ? UserData.name : "Profile"}
													uid={r_uid}
													timestamp={message.timestamp}
												/>
											</div>
										);
									} else {
										return (
											<div key={index}>
												<>
													{!previousItem ? (
														<div className="conversation-date">
															{setTime(message.timestamp)}
														</div>
													) : null}
												</>
												<>
													{previousItem ? (
														setTime(previousItem.timestamp) ===
														setTime(message.timestamp) ? null : (
															<div className="conversation-date">
																{setTime(message.timestamp)}
															</div>
														)
													) : null}
												</>
												<YourBubble
													text={message.message}
													photoURL={null}
													name={UserData ? UserData.name : "Profile"}
													uid={r_uid}
													timestamp={message.timestamp}
												/>
											</div>
										);
									}
								}
							}
					  })
					: null}
			</div>
			<TextBar r_uid={r_uid} sentMessage={sentMessageHandler} />
		</div>
	);
};

export default ChatRoom;
