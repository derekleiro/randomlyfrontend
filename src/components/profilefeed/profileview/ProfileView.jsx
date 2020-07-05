import React, { useState, useEffect } from "react";

import "./profileview.css";

import TopNav from "./TopNav";
import ProfileContainer from "./ProfileContainer";
import ProfileFeed from "./ProfileFeed";

const ProfileView = () => {
	const [fade, setFade] = useState(false);
	useEffect(() => {
		setTimeout(() => setFade(true), 200);
	}, []);

	return (
		<div className="page" style={{ opacity: fade ? 1 : 0 }}>
			<TopNav />
			<ProfileContainer />
			<ProfileFeed />
		</div>
	);
};

export default ProfileView;
