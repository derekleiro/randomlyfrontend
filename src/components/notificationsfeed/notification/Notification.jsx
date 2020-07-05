import React from "react";
import moment from "moment";

import "./notification.css";

const Notification = (props) => {
	const setTime = (timestamp) => {
		if (moment.utc(timestamp).local().calendar().includes("Today")) {
			return moment.utc(timestamp).local().calendar();
		} else {
			return moment.utc(timestamp).local().format("M/DD/YYYY, h:mm a");
		}
	};
	const setAltTime = (timestamp) => {
		if (moment.utc(timestamp).local().calendar().includes("Today")) {
			return moment.utc(timestamp).local().format("LT");
		} else {
			return moment.utc(timestamp).local().format("M/DD/YYYY, h:mm a");
		}
	};
	return (
		<div
			className="notification-container"
			style={{
				background: props.new ? "rgb(246, 246, 246)" : "#fafafa",
				borderBottom: props.new ? "solid 1px #f0f0f0" : "none",
			}}
		>
			<div className="profile-picture">
				<img
					src={props.notificationUserInfo.profilePicture}
					alt={props.notificationUserInfo.profileName}
				/>
			</div>
			<div className="post-content-container">
				{props.notificationType === "comment" ||
				props.notificationType === "reply" ? (
					<div>
						<span className="profile-name">
							{props.notificationUserInfo.profileName}
						</span>
						<span
							style={{ margin: `0 5px` }}
							dangerouslySetInnerHTML={{ __html: `&#8226;` }}
						></span>
						<span className="post-date">
							{setAltTime(props.notificationDate)}
						</span>
					</div>
				) : null}

				<div className="post-content">
					{props.notificationType === "comment" ||
					props.notificationType === "reply" ? null : (
						<b style={{color: "#29303b"}}>{props.notificationUserInfo.profileName}</b>
					)}

					{props.count > 0 ? (
						<>
							{props.notificationText}{props.count} other{props.count > 1 ? "s" : ""} have liked your post ❤
						</>
					) : (
						<> {props.notificationText} </>
					)}

					{props.notificationType === "comment" ||
					props.notificationType === "reply" ? null : (
						<span>
							<span
								style={{ margin: `0 5px` }}
								dangerouslySetInnerHTML={{ __html: `&#8226;` }}
							></span>
							<span className="post-date">
								{setAltTime(props.notificationDate)}
							</span>
						</span>
					)}
				</div>

				<div className="notification-post-container">
					<div className="profile-picture">
						<img
							src={props.interactedPost.profilePicture}
							alt={props.interactedPost.profileName}
						/>
					</div>
					<div className="post-content-container">
						<span className="profile-name">
							{props.interactedPost.profileName}
						</span>
						<span
							style={{ margin: `0 5px` }}
							dangerouslySetInnerHTML={{ __html: `&#8226;` }}
						></span>
						<span className="post-date">
							{setTime(props.interactedPost.postDate)}
						</span>

						<div className="post-content">
							{props.interactedPost.postContent.length > 50
								? `${props.interactedPost.postContent.substring(0, 51)}...`
								: props.interactedPost.postContent}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Notification;
