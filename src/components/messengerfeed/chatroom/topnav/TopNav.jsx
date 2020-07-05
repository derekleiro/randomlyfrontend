import React from "react";
import { withRouter, Link } from "react-router-dom";

import menu from "../../../../assets/icons/menu.png";
import back from "../../../../assets/icons/back.png";

import "./topnav.css";

const TopNav = (props) => {
	return (
		<div className="top-nav">
			<span id="top-nav-left">
				<img onClick={() => props.history.goBack()} src={back} alt="Go back" />
			</span>
			<Link to={`/u/${props.uid}`}>{props.name || ""}</Link>
			<span id="top-nav-right">
				<img src={menu} alt="Menu" />
			</span>
		</div>
	);
};

export default withRouter(TopNav);
