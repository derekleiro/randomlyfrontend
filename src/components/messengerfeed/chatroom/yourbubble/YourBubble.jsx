import React from "react";
import {Link} from "react-router-dom";
import moment from "moment";

import "./yourbubble.css";

const YourBubble = (props) => {
	const setTime = (timestamp) => {
		return moment.utc(timestamp).local().format("LT");
	};
	return (
		<>
			<div className="your-bubble-container">
				{props.photoURL ? (
					<Link to={`/u/${props.uid}`}>
						<span className="your-profile-image">
							<img src={props.photoURL} alt={props.name} />
						</span>
					</Link>
				) : null}

				{props.photoURL ? (
					<span>
						<div className="your-text-profile">{props.text}</div>
						<div className="your-text-status-profile">{setTime(props.timestamp)}</div>
					</span>
				) : (
					<span>
						<div className="your-text">{props.text}</div>
						<div className="your-text-status">{setTime(props.timestamp)}</div>
					</span>
				)}
			</div>
		</>
	);
};

export default YourBubble;
