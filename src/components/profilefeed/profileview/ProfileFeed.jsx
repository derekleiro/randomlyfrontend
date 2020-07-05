import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";

import Post from "../../homefeed/post/Post";
import Ad from "../../ad/Ad";
import SmallLoadingScreen from "../../loadingscreen/SmallLoadingScreen";

import natgeo from "../../../assets/imgs/natgeo.jpg";
import ad from "../../../assets/imgs/ad.jpg";

import "../profilefeed.css";

const ProfileFeed = () => {
	const uid = window.location.href.substring(
		window.location.href.lastIndexOf("/") + 1
	);
	const [isYou, setisYou] = useState(false);
	const [loadingState, setState] = useState(true);
	const [data, setData] = useState([]);

	useEffect(() => {
		let unmounted = false;

		const getUserPosts = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					if (user.uid === uid && !unmounted) {
						setisYou(true);
					}

					user.getIdToken(true).then(async (idToken) => {
						if (idToken) {
							try {
								const response = await fetch(
									`http://localhost:5000/posts_u?u=${uid}&token=${idToken}`
								);
								if (response.ok) {
									const JSONresponse = await response.json();

									if (JSONresponse.posts) {
										if (!unmounted) {
											setData(JSONresponse.posts);
											setState(false);
										}
									}

									if (JSONresponse.empty && !unmounted) {
										setData([]);
										setState(false);
									}
								} else {
									if (!unmounted) {
										setData([]);
									}
								}
							} catch (e) {
								console.log(e);
							}
						}
					});
				}
			});
		};

		getUserPosts();

		return () => {
			unmounted = true;
		};
	}, [uid]);

	return (
		<div id="profile-contain-feed">
			<SmallLoadingScreen loadingState={loadingState} />

			{data.length !== 0 ? (
				data.map((data, index) => {
					return (
						<div key={index}>
							<Post
								_id={data._id}
								profileURL={data.profileURL}
								author={data.author}
								content={data.content}
								timestamp={data.rawTime}
								likeCount={data.likeCount}
								commentCount={data.commentCount}
								uid={data.uid}
								noLinks={true}
								noDM={isYou ? true : false}
							/>
							{index % 4 === 0 ? (
								<Ad
									smallImage={natgeo}
									bigImage={ad}
									title={"Welcome to your shot"}
									desc={
										"Join National Geographic and be part of our photo community and learn from experts."
									}
									adCallText={"Join now"}
								/>
							) : null}
						</div>
					);
				})
			) : (
				<p id="no-posts">
					{isYou
						? "You do not have any posts yet"
						: "User does not have any posts yet"}
				</p>
			)}
		</div>
	);
};

export default ProfileFeed;
