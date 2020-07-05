import React from "react";

import "./screen.css";

const MainLoadingScreen = (props) => {
	return (
		<div id="main-loading-contain" style={{display: props.loadingState ? "flex" : "none"}}>
			<div id="loader-text">
				random-ly
			</div>
		</div>
	);
};

export default MainLoadingScreen;
