import React, { useState, useEffect } from "react";

import "./home.css";

import HomeFeed from "../../components/homefeed/HomeFeed";
import TopNav from "../../components/homefeed/topnav/TopNav";

const Home = () => {
	const [fade, setFade] = useState(false);
	useEffect(() => {
		setTimeout(() => setFade(true), 200);
	}, []);

	return (
		<div className="page" style={{ opacity: fade ? 1 : 0 }}>
			<TopNav />
			<HomeFeed />
		</div>
	);
};

export default Home;
