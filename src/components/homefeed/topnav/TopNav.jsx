import React from "react";
import {Link} from "react-router-dom";

import add from "../../../assets/icons/add.png";

import "./topnav.css";

const TopNav = () => {
	return (
		<div id="topnav-container">
            <div id="create-post-icon"><Link to="/create"><img src={add} alt="create a post" /></Link></div>
            <div className="logo">
                random-ly
            </div> 
		</div>
	);
};

export default TopNav;
