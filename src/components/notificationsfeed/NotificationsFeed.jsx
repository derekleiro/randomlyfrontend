import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";

import Notification from "./notification/Notification";
import LoadingScreen from "../loadingscreen/LoadingScreen";
import { holdNotifications } from "../../actions/notificationsActions";

import "./notificationsfeed.css";

const NotificationsFeed = () => {
	const dispatch = useDispatch();
	const data = useSelector((state) => state.notificationsData);
	useEffect(() => {
		const getNotifications = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					user
						.getIdToken(true)
						.then(async (idToken) => {
							try {
								const response = await fetch(
									`http://localhost:5000/notifications?token=${idToken}&uid=${user.uid}`
								);
								if (response.ok) {
									const JSONresponse = await response.json();
									if (JSONresponse.notifications) {
										dispatch(holdNotifications(JSONresponse.notifications));
									}
								}
							} catch (e) {
								console.log(e);
							}
						})
						.catch((e) => {
							console.log(e);
						});
				}
			});
		};
		if (!data) {
			return getNotifications();
		}
	}, [data, dispatch]);

	return (
		<div id="notifications-feed">
			<LoadingScreen loadingState={!data ? true : false} />
			{data ? data.map((data, index) => {
				return (
					<div key={index}>
						<Notification
							interactedPost={data.interactedPost}
							notificationDate={data.notificationDate}
							notificationText={data.notificationText}
							notificationType={data.notificationType}
							notificationUserInfo={data.notificationUserInfo}
							new={data.new}
							count={data.count}
						/>
					</div>
				);
			}) : null}
		</div>
	);
};

export default NotificationsFeed;
