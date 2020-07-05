import React, { useState, useEffect } from "react";

import "./discover.css";

import DiscoverFeed from "../../components/discoverfeed/DiscoverFeed";
import TopNav from "../../components/discoverfeed/topnav/TopNav";

const Discover = () => {
	const [fade, setFade] = useState(false);
	useEffect(() => {
		setTimeout(() => setFade(true), 200);
	}, []);

	return (
		<div className="page" style={{ opacity: fade ? 1 : 0 }}>
			<TopNav />
			<DiscoverFeed />
		</div>
	);
};

export default Discover;
