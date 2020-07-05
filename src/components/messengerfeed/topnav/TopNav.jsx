import React from "react";

import "../../topnavstyle/topnav.css";

const TopNav = () => {
	const requestCount = 15;
	return (
		<div className="top-nav">
			<div id="requests-count">{requestCount}</div>
			<div id="special_nav_container">
				<span id="logo_nav">random-ly</span> <span id="logo_mes">Messenger</span>
			</div>
		</div>
	);
};

export default TopNav;
