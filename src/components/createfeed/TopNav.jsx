import React from "react";
import {withRouter} from "react-router-dom";

import return_icon from "../../assets/icons/back2.png";

import "../topnavstyle/topnav.css";

const TopNav = (props) => {
	return (
		<div className="top-nav">
            <span id="return"><img onClick={() => props.history.goBack()} src={return_icon} alt="Go back" /></span>
		</div>
	);
};

export default withRouter(TopNav);
