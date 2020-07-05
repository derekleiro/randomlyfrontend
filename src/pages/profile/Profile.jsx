import React, { useState, useEffect } from "react";

import "./profile.css";

import TopNav from "../../components/profilefeed/topnav/TopNav";
import ProfileContainer from "../../components/profilefeed/profilecontainer/ProfileContainer";
import ProfileFeed from "../../components/profilefeed/ProfileFeed";

const Profile = () => {
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

export default Profile;
