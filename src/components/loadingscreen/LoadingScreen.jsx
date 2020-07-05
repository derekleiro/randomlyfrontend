import React from "react";

import load from "../../assets/icons/6.gif";

import "./screen.css";

const LoadingScreen = (props) => {
	return (
		<div id="loading-contain" style={{display: props.loadingState ? "flex" : "none", zIndex: props.index ? props.index : "2"}}>
			<div id="loader-image">
				<img src={load} alt="loading..." />
			</div>
		</div>
	);
};

export default LoadingScreen;
