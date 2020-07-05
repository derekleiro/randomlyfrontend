import React, { useEffect, useState } from "react";
import moment from "moment";
import firebase from "firebase/app";
import "firebase/auth";

import "./chat.css";

const Chat = (props) => {
	const senderInfo = props.senderInfo ? props.senderInfo : "";
	const receiverInfo = props.receiverInfo ? props.receiverInfo : "";

	const [uid, setUID] = useState(null);
	useEffect(() => {
		let unmounted = false;
		const getUID = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					setUID(user.uid);
				}
			});
		};

		getUID();
		return () => {
			unmounted = true;
		};
	}, []);

	const setTime = (timestamp) => {
		if (moment.utc(timestamp).local().calendar().includes("Today")) {
			return moment.utc(timestamp).local().format("LT");
		} else {
			return moment.utc(timestamp).local().format("M/DD/YYYY, h:mm a");
		}
	};

	return (
		<div className="chat-container">
			<div className="profile-info">
				<span className="profile-image">
					<img
						style={{ width: "55px", height: "55px" }}
						src={
							props.senderUID === uid
								? receiverInfo.profilePicture
								: senderInfo.profilePicture
						}
						alt={
							props.senderUID === uid
								? receiverInfo.profileName
								: senderInfo.profileName
						}
					/>
				</span>

				<span>
					<span className="profile-name">
						{props.senderUID === uid
							? receiverInfo.profileName
							: senderInfo.profileName}
					</span>
					{props.senderUID === uid ? (
						props.senderUnread ? (
							<span>
								<span
									style={{ margin: `0 5px` }}
									dangerouslySetInnerHTML={{ __html: `&#8226;` }}
								></span>
								<span className="chat-unread">{props.senderUnread}</span>
							</span>
						) : null
					) : props.receiverUID === uid ? (
						props.receiverUnread ? (
							<span>
								<span
									style={{ margin: `0 5px` }}
									dangerouslySetInnerHTML={{ __html: `&#8226;` }}
								></span>
								<span className="chat-unread">{props.receiverUnread}</span>
							</span>
						) : null
					) : null}

					<span className="profile-interest-p">{setTime(props.timestamp)}</span>
					<div className="chat-text">
						{props.lastMessage.length > 50
							? `${props.lastMessage.substring(0, 51)}...`
							: props.lastMessage}
					</div>
				</span>
			</div>
		</div>
	);
};

export default Chat;
