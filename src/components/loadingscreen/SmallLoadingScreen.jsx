import React from "react";

import load from "../../assets/icons/6.gif";

import "./screen.css";

const SmallLoadingScreen = (props) => {
	return (
		<div id="loading-contain-small" style={{display: props.loadingState ? "flex" : "none"}}>
			<div id="loader-image">
				<img src={load} alt="loading..." />
			</div>
		</div>
	);
};

export default SmallLoadingScreen;
