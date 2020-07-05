import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import firebase from "firebase/app";
import "firebase/auth";

import like from "../../../assets/icons/like.png";
import liked from "../../../assets/icons/liked.png";
import comment from "../../../assets/icons/comment.png";
import message from "../../../assets/icons/send.png";
import save from "../../../assets/icons/save.png";
import saved from "../../../assets/icons/saved.png";
import menu from "../../../assets/icons/menu.png";
import missing from "../../../assets/icons/missing.png";

import "./post.css";

const Post = (props) => {
	const [isLiked, setLike] = useState(false);
	const [isSaved, setSave] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [disabled_save, setDisabledSave] = useState(false);

	const likeFunc = (action) => {
		setDisabled(true);
		if (action === "like") {
			setLike(true);
		} else {
			setLike(false);
		}
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				user.getIdToken(true).then(async (token) => {
					try {
						const response = await fetch(`http://localhost:5000/like`, {
							method: "POST",
							body: JSON.stringify({
								pid: props._id,
								uid: user.uid,
								token: token,
								post_uid: props.uid,
							}),
							headers: { "Content-Type": "application/json" },
						});
						if (response) {
							const JSONresponse = await response.json();
							if (JSONresponse.success) {
								if (action === "like") {
									setLike(true);
								} else {
									setLike(false);
								}
							} else {
								setLike(false);
							}
						}
					} catch (e) {
						console.log(e.message);
					}
				});
			}
		});

		setTimeout(() => setDisabled(false), 2000);
	};

	const saveFunc = (action) => {
		setDisabledSave(true);
		if (action === "save") {
			setSave(true);
		} else {
			setSave(false);
		}
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				user.getIdToken(true).then(async (token) => {
					try {
						const response = await fetch(`http://localhost:5000/save`, {
							method: "POST",
							body: JSON.stringify({
								pid: props._id,
								uid: user.uid,
								token: token,
							}),
							headers: { "Content-Type": "application/json" },
						});
						if (response) {
							const JSONresponse = await response.json();
							if (JSONresponse.success) {
								if (action === "save") {
									setSave(true);
								} else {
									setSave(false);
								}
							} else if (JSONresponse.removed) {
								setSave(false);
							}
						}
					} catch (e) {
						console.log(e);
					}
				});
			}
		});

		setTimeout(() => setDisabledSave(false), 2000);
	};

	const saveLike = () => {
		return likeFunc("like");
	};

	const removeLike = () => {
		return likeFunc("unlike");
	};

	const savePost = () => {
		return saveFunc("save");
	};

	const unSavePost = () => {
		return saveFunc("unsave");
	};

	const setTime = (timestamp) => {
		if (moment.utc(timestamp).local().calendar().includes("Today")) {
			return moment.utc(timestamp).local().calendar();
		} else {
			return moment.utc(timestamp).local().format("M/DD/YYYY, h:mm a");
		}
	};

	return (
		<div className="post-container">
			{props.noLinks ? (
				<div className="profile-picture">
					<img src={props.profileURL || missing} alt={props.author} />
				</div>
			) : (
				<Link to={`/u/${props.uid}`}>
					<div className="profile-picture">
						<img src={props.profileURL || missing} alt={props.author} />
					</div>
				</Link>
			)}

			<div className="post-content-container">
				{props.noLinks ? (
					<span className="profile-name">{props.author}</span>
				) : (
					<Link to={`/u/${props.uid}`}>
						<span className="profile-name">{props.author}</span>
					</Link>
				)}

				<span
					style={{ margin: `0 5px` }}
					dangerouslySetInnerHTML={{ __html: `&#8226;` }}
				></span>
				<span className="post-date">{setTime(props.timestamp)}</span>

				<Link to={`/post/${props._id}`}>
					<div className="post-content">{props.content}</div>
				</Link>
				<div className="post-icons">
					<span className="post-icon-container">
						{isLiked ? (
							<>
								{disabled ? (
									<>
										<img src={liked} alt="like" />
										{props.likeCount === 0
											? null
											: props.likeCount || isLiked
											? props.likeCount + 1
											: null}
									</>
								) : (
									<>
										<img src={liked} onClick={removeLike} alt="like" />
										{props.likeCount === 0
											? null
											: props.likeCount || isLiked
											? props.likeCount + 1
											: null}
									</>
								)}
							</>
						) : (
							<>
								{disabled ? (
									<>
										<img src={like} alt="like" />
										{props.likeCount === 0 ? null : props.likeCount}
									</>
								) : (
									<>
										<img src={like} onClick={saveLike} alt="like" />
										{props.likeCount === 0 ? null : props.likeCount}
									</>
								)}
							</>
						)}
					</span>
					<Link to={`/post/${props._id}`}>
						<span className="post-icon-container">
							<img src={comment} alt="comment" />
							{props.commentCount === 0 ? null : props.commentCount}
						</span>
					</Link>
					{props.noDM ? null : (
						<Link to={`/chat/${props.uid}`}>
							<span className="post-icon-container">
								<img src={message} alt={`send a message to ${props.author}`} />
							</span>
						</Link>
					)}

					<span className="post-icon-container">
						{isSaved ? (
							<>
								{disabled_save ? (
									<>
										<img src={saved} alt="unsave post" />
									</>
								) : (
									<>
										<img src={saved} onClick={unSavePost} alt="unsave post" />
									</>
								)}
							</>
						) : (
							<>
								{disabled_save ? (
									<>
										<img src={save} alt="save post for later" />
									</>
								) : (
									<>
										<img
											src={save}
											onClick={savePost}
											alt="save post for later"
										/>
									</>
								)}
							</>
						)}
					</span>
					<span className="post-menu-options-icon">
						<img src={menu} alt="post menu options" />
					</span>
				</div>
			</div>
		</div>
	);
};

export default Post;
