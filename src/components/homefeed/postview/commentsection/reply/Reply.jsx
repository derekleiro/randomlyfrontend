import React, { useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";

import { handleReplies } from "../../../../../actions/postViewActions";

import missing from "../../../../../assets/icons/missing.png";
import like from "../../../../../assets/icons/like.png";
import liked from "../../../../../assets/icons/liked.png";
import menu from "../../../../../assets/icons/menu.png";

const Reply = (props) => {
	const pid = window.location.href.substring(
		window.location.href.lastIndexOf("/") + 1
	);
	const dispatch = useDispatch();
	const [isLiked, setLike] = useState(0);

	const setTime = (timestamp) => {
		if (moment.utc(timestamp).local().calendar().includes("Today")) {
			return moment.utc(timestamp).local().calendar();
		} else {
			return moment.utc(timestamp).local().format("M/DD/YYYY, h:mm a");
		}
	};

	const handleLikedPost = () => {
		setLike(true);
	};

	const handleUnLikedPost = () => {
		setLike(false);
	};

	const handleReply = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				return dispatch(
					handleReplies({
						authorUID: user.uid,
						authorName: user.displayName,
						replyingToUID: props.authorUID,
						replyingToName: props.authorName,
						cid: props.cid,
						pid: props.pid || pid,
						authorProfileURL: user.photoURL,
						replyType: "reply-reply",
						replyCounter: props.replyCounter ? props.replyCounter : 0,
						id: props.id
					})
				);
			}
		});
	};

	return (
		<div className="post-container" style={{ margin: "25px 0" }}>
			<Link to={`/u/${props.authorUID}`}>
				<div className="profile-picture">
					<img src={props.authorProfileURL || missing} alt={props.authorName} />
				</div>
			</Link>

			<div className="post-content-container">
				<Link to={`/u/${props.authorUID}`}>
					<span className="profile-name">{props.authorName}</span>
				</Link>
				<span
					style={{ margin: `0 5px` }}
					dangerouslySetInnerHTML={{ __html: `&#8226;` }}
				></span>
				<span className="post-date">{setTime(props.timestamp)}</span>
				<div className="post-content">
					<span style={{ color: "#29303b", fontWeight: "700" }}>
						{props.replyType === "reply-reply" ? `@${props.replyingToName} ` : ""}
					</span>
					{props.replyText}
				</div>
				<div className="post-icons">
					<span className="post-icon-container">
						{isLiked ? (
							<>
								<img src={liked} alt="like" onClick={handleUnLikedPost} />
								{props.likeCount === 0
									? null
									: props.likeCount || isLiked
									? props.likeCount + 1
									: null}
							</>
						) : (
							<>
								<img src={like} alt="like" onClick={handleLikedPost} />
								{props.likeCount === 0 ? null : props.likeCount}
							</>
						)}
					</span>

					<span className="post-icon-container">
						<span onClick={handleReply}>reply</span>
					</span>

					<span className="post-menu-options-icon">
						<img src={menu} alt="post menu options" />
					</span>
				</div>
			</div>
		</div>
	);
};

export default Reply;
