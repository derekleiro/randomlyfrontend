import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";

import LoadingScreen from "../../loadingscreen/LoadingScreen";
import CommentBar from "./commentbar/CommentBar";
import { changeBottomNavStateToHome } from "../../../actions/bottomNavActions.js";

import like from "../../../assets/icons/like.png";
import liked from "../../../assets/icons/liked.png";
import message from "../../../assets/icons/send.png";
import save from "../../../assets/icons/save.png";
import saved from "../../../assets/icons/saved.png";
import menu from "../../../assets/icons/menu.png";
import missing from "../../../assets/icons/missing.png";
import return_icon from "../../../assets/icons/back2.png";

import CommentSection from "./commentsection/CommentSection";

import "./postview.css";

const PostView = (props) => {
	const dispatch = useDispatch();

	const id = window.location.href.substring(
		window.location.href.lastIndexOf("/") + 1
	);
	const [loadingState, setState] = useState(true);
	const [user, setUser] = useState(true);
	const [myComments, setComment] = useState([]);
	const [post, setPost] = useState(0);
	const [isLiked, setLike] = useState(0);
	const [isSaved, setSave] = useState(0);
	const [timestamp, setTimestamp] = useState("");
	const [disabled, setDisabled] = useState(false);
	const [disabled_save, setDisabledSave] = useState(false);

	const [fade, setFade] = useState(false);
	useEffect(() => {
		setTimeout(() => setFade(true), 200);
	}, []);

	useEffect(() => {
		let unmounted = false;

		dispatch(changeBottomNavStateToHome);
		const getPost = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user && !unmounted) {
					setUser(user);
					user.getIdToken(true).then(async (token) => {
						try {
							const response = await fetch(
								`http://localhost:5000/post?pid=${id}&token=${token}`
							);
							if (response.ok) {
								const JSONresponse = await response.json();
								if (JSONresponse) {
									if (!unmounted) {
										setPost(JSONresponse);
										setState(false);
									}
								}
							}

							if (response.status === 404) {
								return props.history.replace("/");
							}

							if (response.status === 500) {
								return props.history.replace("/");
							}
						} catch (e) {
							console.log(e);
						}
					});
				}
			});
		};

		getPost();
		return () => {
			unmounted = true;
		};
	}, [id, props.history, dispatch]);

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
								pid: post._id,
								uid: user.uid,
								token: token,
								post_uid: post.uid,
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
								pid: post._id,
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

	const getComment = (e) => {
		setComment((current) => [].concat(e, ...current));
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

	const setTime = () => {
		if (moment.utc(post.rawTime).local().calendar().includes("Today")) {
			return setTimestamp(moment.utc(post.rawTime).local().calendar());
		} else {
			return setTimestamp(
				moment.utc(post.rawTime).local().format("M/DD/YYYY, h:mm a")
			);
		}
	};

	return (
		<div id="postview-container" onLoad={setTime} style={{ opacity: fade ? 1 : 0 }}>
			<LoadingScreen loadingState={loadingState} />
			<div id="post-view">
				<div className="top-nav">
					<span id="return">
						<img
							onClick={() => window.history.back()}
							src={return_icon}
							alt="Go back"
						/>
					</span>
				</div>

				<div id="profile-view-info">
					<Link to={`/u/${post.uid}`}>
						<span id="profile-picture-postview">
							<img src={post.profileURL || missing} alt={post.author} />
						</span>
					</Link>

					<span>
						<Link to={`/u/${post.uid}`}>
							<span className="profile-name">{post.author}</span>
						</Link>
						<span
							style={{ margin: `0 5px` }}
							dangerouslySetInnerHTML={{ __html: `&#8226;` }}
						></span>
						<span className="post-date">{timestamp}</span>
					</span>
				</div>

				<div className="post-content-container">
					<div
						className="post-content"
						dangerouslySetInnerHTML={{ __html: post.content }}
					></div>
					<div className="post-icons">
						<span className="post-icon-container">
							{isLiked ? (
								<>
									{disabled ? (
										<>
											<img src={liked} alt="like" />
											{post.likeCount === 0
												? null
												: post.likeCount || isLiked
												? post.likeCount + 1
												: null}
										</>
									) : (
										<>
											<img src={liked} onClick={removeLike} alt="like" />
											{post.likeCount === 0
												? null
												: post.likeCount || isLiked
												? post.likeCount + 1
												: null}
										</>
									)}
								</>
							) : (
								<>
									{disabled ? (
										<>
											<img src={like} alt="like" />
											{post.likeCount === 0 ? null : post.likeCount}
										</>
									) : (
										<>
											<img src={like} onClick={saveLike} alt="like" />
											{post.likeCount === 0 ? null : post.likeCount}
										</>
									)}
								</>
							)}
						</span>
						<span className="post-icon-container">
							{user.uid !== post.uid ? (
								<Link to={`/chat/${post.uid}`}>
									<img
										src={message}
										alt={`send a message to ${props.author}`}
									/>
								</Link>
							) : null}
						</span>
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
				<CommentSection data={myComments} pid={id} />
				<CommentBar
					postUID={post.uid}
					user={user}
					comment={getComment}
					id={id}
				/>
			</div>
		</div>
	);
};

export default PostView;
