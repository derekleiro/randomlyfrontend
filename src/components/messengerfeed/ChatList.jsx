import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";

import Chat from "./chat/Chat";

import "./chatlist.css";
import { holdChatListData } from "../../actions/messengerActions";

const ChatList = () => {
	const chatlist = useSelector((store) => store.chatList);
	const dispatch = useDispatch();

	useEffect(() => {
		let unmounted = false;
		const chatList = () => {
			try {
				firebase.auth().onAuthStateChanged((user) => {
					if (user && !unmounted) {
						user.getIdToken(true).then(async (token) => {
							if (token) {
								const response = await fetch(
									`http://localhost:5000/chatrooms?uid=${user.uid}&token=${token}`
								);
								if (response.ok) {
									const JSONresponse = await response.json();
									if (JSONresponse) {
										dispatch(holdChatListData(JSONresponse.chatrooms))
									};
								}
							}
						});
					}
				});
			} catch (e) {
				console.log(e);
			}
		};

		if(chatlist.length === 0){
			chatList();
		}
		return () => {
			unmounted = true;
		};
	}, []);

	return (
		<div id="chat-list">
			{chatlist.map((data, index) => {
				return (
					<div key={index}>
						<Chat
							senderUID={data.senderUID}
							receiverUID={data.receiverUID}
							createdAt={data.createdAt}
							senderInfo={data.senderInfo}
							receiverInfo={data.receiverInfo}
							lastMessage={data.lastMessage}
							senderUnread={data.senderUnread}
							receiverUnread={data.receiverUnread}
							timestamp={data.timestamp}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default ChatList;
