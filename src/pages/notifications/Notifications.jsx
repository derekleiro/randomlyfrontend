import React, { useState, useEffect } from "react";

import "./notifications.css";

import TopNav from "../../components/notificationsfeed/topnav/TopNav";
import NotificationsFeed from "../../components/notificationsfeed/NotificationsFeed";

const Notifications = () => {
	const [fade, setFade] = useState(false);
	useEffect(() => {
		setTimeout(() => setFade(true), 200);
	}, []);

	return (
		<div className="page" style={{ opacity: fade ? 1 : 0 }}>
			<TopNav />
			<NotificationsFeed />
		</div>
	);
};

export default Notifications;
