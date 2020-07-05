import React, { useState } from "react";
import moment from "moment";
import firebase from "firebase/app";
import "firebase/auth";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ReplySection from "../reply/ReplySection";
import Reply from "../reply/Reply";
import { handleReplies } from "../../../../../actions/postViewActions";

import missing from "../../../../../assets/icons/missing.png";
import like from "../../../../../assets/icons/like.png";
import liked from "../../../../../assets/icons/liked.png";
import menu from "../../../../../assets/icons/menu.png";
import comment from "../../../../../assets/icons/comment.png";

import "./comment.css";

const Comment = (props) => {
	const replyData = useSelector((state) => state.handleReplyData.replyData);
	const dispatch = useDispatch();
	const [isLiked, setLike] = useState(0);
	const [showingReplies, setShowingReplies] = useState(true);
	const [showingSection, setShowingSection] = useState(false);
	const propReplyCount = props.commentCount;

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

	const showReplies = () => {
		setShowingSection(true);
		setShowingReplies(false);
	};
	const hideReplies = () => {
		setShowingSection(false);
		setShowingReplies(true);
	};

	const handleClick = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				return dispatch(
					handleReplies({
						authorUID: user.uid,
						authorName: user.displayName,
						replyingToUID: props.authorUID,
						replyingToName: props.author,
						cid: props.cid,
						pid: props.pid,
						authorProfileURL: user.photoURL,
						replyType: "comment-reply",
						replyCounter: props.commentCount ? props.commentCount : 0,
						id: props.cid
					})
				);
			}
		});
	};

	return (
		<div className="post-container" style={{ margin: "25px 0" }}>
			<Link to={`/u/${props.authorUID}`}>
				<div className="profile-picture">
					<img src={props.authorProfileURL || missing} alt={props.author} />
				</div>
			</Link>

			<div className="post-content-container">
				<Link to={`/u/${props.authorUID}`}>
					<span className="profile-name">{props.author}</span>
				</Link>
				<span
					style={{ margin: `0 5px` }}
					dangerouslySetInnerHTML={{ __html: `&#8226;` }}
				></span>
				<span className="post-date">{setTime(props.timestamp)}</span>
				<div className="post-content">{props.content}</div>
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
						<img src={comment} alt="comment" onClick={handleClick} />
						{propReplyCount === 0 ? null : propReplyCount}
					</span>

					<span className="post-menu-options-icon">
						<img src={menu} alt="post menu options" />
					</span>
				</div>

				<div className="reply-section">
					{showingSection ? (
						<ReplySection cid={props.cid} commentCount={props.commentCount} />
					) : null}
					<>
						{replyData.map((data, index) => {
							if (data.cid === props.cid) {
								return (
									<div key={index}>
										<Reply
											replyText={data.replyText}
											timestamp={data.timestamp}
											pid={data.pid}
											cid={props.cid}
											authorUID={data.authorUID}
											authorName={data.authorName}
											authorProfileURL={data.authorProfileURL}
											likeCount={data.likeCount}
											commentCount={props.commentCount}
											replyCounter={data.replyCounter}
											replyType={data.replyType}
											replyingToName={data.replyingToName}
											id={data.id}
										/>
									</div>
								);
							} else {
								return null;
							}
						})}
					</>
					{props.hasReplies ? (
						showingReplies ? (
							<div id="show-replies" onClick={showReplies}>
								{props.commentCount === 1 ? <>show reply</> : <>show replies</>}
							</div>
						) : (
							<div id="show-replies" onClick={hideReplies}>
								{props.commentCount === 1 ? <>hide reply</> : <>hide replies</>}
							</div>
						)
					) : null}
				</div>
			</div>
		</div>
	);
};

export default Comment;
