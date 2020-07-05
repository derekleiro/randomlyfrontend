import React, { useState, useEffect } from "react";

import "./messenger.css";

import TopNav from "../../components/messengerfeed/topnav/TopNav";
import ChatList from "../../components/messengerfeed/ChatList";

const Messenger = () => {
	const [fade, setFade] = useState(false);
	useEffect(() => {
		setTimeout(() => setFade(true), 200);
	}, []);

	return (
		<div className="page" style={{ opacity: fade ? 1 : 0 }}>
			<TopNav />
			<ChatList />
		</div>
	);
};

export default Messenger;
