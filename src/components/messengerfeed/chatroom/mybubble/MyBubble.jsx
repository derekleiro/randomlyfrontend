import React from "react";
import moment from "moment";

import "./mybubble.css";

const MyBubble = (props) => {
	const setTime = (timestamp) => {
		return moment.utc(timestamp).local().format("LT");
	};
	return (
		<>
			<div className="my-bubble-container">
				<div className="my-text">{props.text}</div>
			</div>
			<div className="other">
				<span className="text-status">{setTime(props.timestamp)}</span>
			</div>
		</>
	);
};

export default MyBubble;
