import React from "react";

import edit from "../../../assets/icons/edit.png";
import settings from "../../../assets/icons/settings.png";

import "../../topnavstyle/topnav.css";

const TopNav = () => {
	return (
        <div className="top-nav">
            <span id="top-nav-left">
                <img src={edit} alt="Edit profile" />
            </span>
			Profile
            <span id="top-nav-right">
                <img src={settings} alt="Edit profile" />
            </span>
		</div>
	);
};

export default TopNav;