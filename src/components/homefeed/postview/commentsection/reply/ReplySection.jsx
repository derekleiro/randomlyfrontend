import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";

import Reply from "./Reply";

const ReplySection = (props) => {
	const [replies, setReplies] = useState([]);

	useEffect(() => {
		let unmounted = false;
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				user
					.getIdToken(true)
					.then(async (token) => {
						try {
							const response = await fetch(
								`http://localhost:5000/replies?token=${token}&uid=${user.uid}&cid=${props.cid}`
							);
							if (response.ok) {
								const JSONreponse = await response.json();
								if (JSONreponse.replies) {
									if (!unmounted) {
										setReplies(JSONreponse.replies);
									}
								}
							} else {
								console.log("An error occured");
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
		return () => {
			unmounted = true;
		};
	}, [props.cid]);

	return (
		<>
			{replies.map((data, index) => {
				return (
					<div key={index}>
						<Reply
							replyText={data.replyText}
							timestamp={data.timestamp}
							pid={data.pid}
							cid={props.cid}
							authorUID={data.authorUID}
							authorName={data.authorName}
							authorProfileURL={data.authorPhotoURL}
							likeCount={data.likeCount}
							id={data._id}
							replyingToName={data.replyToName}
							replyingToUID={data.replyToUID}
							replyCounter={data.replyCounter}
							replyType={data.replyType}
						/>
					</div>
				);
			})}
		</>
	);
};

export default ReplySection;
