import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";

import Comment from "./comment/Comment";
import SmallLoadingScreen from "../../../loadingscreen/SmallLoadingScreen";

import "./commentsection.css";

const CommentSection = (props) => {
	const prop_comments = props.data;
	const [comments, setComments] = useState([]);
	const [commentCount, setCommentCount] = useState([]);
	const [user, setUser] = useState(null);
	const [laodingState, setLoadingState] = useState(true);

	useEffect(() => {
		let unmounted = false;

		const getComments = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user && !unmounted) {
					setUser(user);
					user
						.getIdToken(true)
						.then(async (idToken) => {
							try {
								const response = await fetch(
									`http://localhost:5000/comments?pid=${props.pid}&token=${idToken}&uid=${user.uid}`
								);
								if (response.ok) {
									const JSONresponse = await response.json();
									if (JSONresponse) {
										if (!unmounted) {
											setComments(JSONresponse.comments);
											setCommentCount(JSONresponse.commentCount);
										}
									}
								}
							} catch (e) {
								console.log(e);
							}
						})
						.catch((e) => {
							console.log(e);
						});
				}
			});
		};
		getComments();

		return () => {
			unmounted = true;
		};
	}, [props.pid]);

	return (
		<div id="comment-section" onLoad={() => setLoadingState(false)}>
			<SmallLoadingScreen loadingState={laodingState} />
			<div id="comments-in-thread">
				{comments.length !== 0
					? commentCount + prop_comments.length > 1
						? `${commentCount + prop_comments.length} comments`
						: `${commentCount} comment`
					: prop_comments.length === 0
					? "Be the first to comment"
					: prop_comments.length > 1
					? `${prop_comments.length} comments`
					: `${prop_comments.length} comment`}
			</div>
			{comments.length !== 0 ? (
				<>
					{prop_comments.length !== 0 ? (
						<>
							{prop_comments.map((data, index) => {
								return (
									<div key={index}>
										<Comment
											author={data.author}
											authorProfileURL={data.profileURL}
											timestamp={data.timestamp}
											content={data.content}
											commentCount={data.commentCount}
											likeCount={data.likeCount}
											authorUID={user.uid}
											cid={data._id}
											pid={data.pid}
										/>
									</div>
								);
							})}
						</>
					) : null}
					{comments.map((data, index) => {
						return (
							<div key={index}>
								<Comment
									author={data.authorName}
									authorProfileURL={data.authorPhotoURL}
									timestamp={data.timestamp}
									content={data.commentText}
									commentCount={data.replyCount}
									likeCount={data.likeCount}
									hasReplies={data.hasReplies}
									authorUID={data.authorUID}
									cid={data._id}
									pid={data.pid}
								/>
							</div>
						);
					})}
				</>
			) : (
				<>
					{prop_comments.map((data, index) => {
						return (
							<div key={index}>
								<Comment
									author={data.author}
									authorProfileURL={data.profileURL}
									timestamp={data.timestamp}
									content={data.content}
									commentCount={data.commentCount}
									likeCount={data.likeCount}
									authorUID={user.uid}
									cid={data._id}
									pid={data.pid}
								/>
							</div>
						);
					})}
				</>
			)}
		</div>
	);
};

export default CommentSection;
