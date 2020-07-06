import React, { useState } from "react";
import autosize from "autosize";
import { useSelector, useDispatch } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";

import {
	handleReplyData,
	handleReplies,
} from "../../../../actions/postViewActions";

import cancel from "../../../../assets/icons/back2.png";

import "./commentbar.css";

const CommentBar = (props) => {
	const commentData = useSelector((state) => state.handleReplies);
	const dispatch = useDispatch();
	const id = window.location.href.substring(
		window.location.href.lastIndexOf("/") + 1
	);
	const [c, setC] = useState(false);
	const [count, setCount] = useState(0);
	const [remainingCount, setRemainingCount] = useState(50);

	const [commentText, setText] = useState("");
	const [postUnsent, setState] = useState(true);

	const textCount = (e) => {
		setC(false);
		setCount(e.target.value.length);
		setText(e.target.value);

		if (e.target.value.length > 270) {
			setRemainingCount(320 - e.target.value.length);
		}
	};

	const textarea = (c) => {
		if (c) {
			c.focus();
			autosize(c);
		}
	};

	const cancelReply = () => {
		dispatch(handleReplies({}));
	};

	const sendComment = async () => {
		setState(false);
		setText("");
		setC(true);
		setCount(0);

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				user
					.getIdToken(true)
					.then(async (token) => {
						if (commentData ? commentData.authorName : false) {
							try {
								const response = await fetch(`http://localhost:5000/replies`, {
									method: "POST",
									body: JSON.stringify({
										replyText: commentText,
										authorUID: commentData.authorUID,
										replyingToUID: commentData.replyingToUID,
										pid: commentData.pid || id,
										cid: commentData.cid,
										token: token,
										replyType: commentData.replyType,
										id: commentData.id
									}),
									headers: { "Content-Type": "application/json" },
								});

								if (response.ok) {
									const JSONresponse = await response.json();
									if (JSONresponse.sent) {
										dispatch(
											handleReplyData({
												replyText: commentText,
												timestamp: Date.now(),
												authorUID: commentData.authorUID,
												pid: commentData.pid || id,
												cid: commentData.cid,
												authorName: commentData.authorName,
												authorProfileURL: commentData.profileURL,
												replyingToUID: commentData.replyingToUID,
												replyingToName: commentData.replyingToName,
												likeCount: 0,
												replyCounter: commentData.replyCounter + 1,
												replyType: commentData.replyType,
												id: JSONresponse.reply._id
											})
										);
										setState(true);
										return dispatch(handleReplies({}));
									} else {
										console.log("An error occurred");
									}
								}
							} catch (e) {
								console.log(e);
							}
						} else {
							try {
								const response = await fetch(`http://localhost:5000/comments`, {
									method: "POST",
									body: JSON.stringify({
										commentText,
										pid: props.id,
										uid: props.user.uid,
										token: token,
										postUID: props.postUID
									}),
									headers: { "Content-Type": "application/json" },
								});

								if (response.ok) {
									const JSONresponse = await response.json();
									if (JSONresponse.sent) {
										props.comment({
											content: commentText,
											author: props.user.displayName,
											profileURL: props.user.photoURL,
											timestamp: Date.now(),
											commentCount: 0,
											likeCount: 0,
											_id: JSONresponse.comment._id,
										});
										setState(true);
									} else {
										console.log("An error occurred");
									}
								}
							} catch (e) {
								console.log(e);
							}
						}
					})
					.catch((e) => console.log(e));
			}
		});
	};

	return (
		<div className="comment-bar" style={{ marginLeft: "-10px" }}>
			{commentData ? (
				commentData.authorName ? (
					<img
						src={cancel}
						alt={`cancel reply to ${
							commentData
								? commentData.replyingToName
								: "" || props.repOfRepData
								? props.repOfRepData.replyingToName
								: ""
						}`}
						id="cancel-reply"
						onClick={cancelReply}
					></img>
				) : null
			) : props.repOfRepData ? (
				<img
					src={cancel}
					alt={`cancel reply to ${
						commentData
							? commentData.replyingToName
							: "" || props.repOfRepData
							? props.repOfRepData.replyingToName
							: ""
					}`}
					id="cancel-reply"
					onClick={cancelReply}
				></img>
			) : null}
			<textarea
				ref={(c) => textarea(c)}
				value={commentText}
				onChange={textCount}
				placeholder={
					commentData
						? commentData.authorName
							? `responding to @${commentData.replyingToName}`
							: "Be nice"
						: props.repOfRepData
						? `responding to @${props.repOfRepData.replyingToName}`
						: "Be nice"
				}
				style={{
					maxHeight: c ? "42px" : "200px",
					padding: commentData
						? commentData.authorName
							? "10px 60px 10px 35px"
							: "10px 60px 10px 11.5px"
						: props.repOfRepData
						? "10px 60px 10px 35px"
						: "10px 60px 10px 11.5px",
				}}
			></textarea>
			{count > 0 && count < 321 && postUnsent && commentText.trim() !== "" ? (
				<span onClick={sendComment} className="send-comment-text">
					POST
				</span>
			) : (
				<span style={{ opacity: 0.6 }} className="send-comment-text">
					POST
				</span>
			)}
			{count > 270 && count < 321 ? (
				<span className="comment-text-limit">{remainingCount}</span>
			) : null}
			{count > 320 ? (
				<span style={{ color: "#fc0060" }} className="comment-text-limit">
					{remainingCount}
				</span>
			) : null}
		</div>
	);
};

export default CommentBar;
