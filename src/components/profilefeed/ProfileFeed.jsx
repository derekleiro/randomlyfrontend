import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";

import Post from "../homefeed/post/Post";
import Ad from "../ad/Ad";
import SmallLoadingScreen from "../loadingscreen/SmallLoadingScreen";

import natgeo from "../../assets/imgs/natgeo.jpg";
import ad from "../../assets/imgs/ad.jpg";

import {
	profileData,
	profileDataCount,
	profileSaves,
	profileSavesCount,
} from "../../actions/profileActions";

import "./profilefeed.css";

const ProfileFeed = () => {
	const dispatch = useDispatch();
	const dataHome = useSelector((state) => state.profileData);
	const dataSaved = useSelector((state) => state.profileSaves);
	const postCount = useSelector((state) => state.profileDataCount);
	const savedCount = useSelector((state) => state.profileSavesCount);
	const [isActive, setID] = useState("/m");
	const [isYou, setIsYou] = useState("");
	const [loadingState, setState] = useState(true);

	const [data, setData] = useState(dataHome);

	const switcher = [
		{
			text: "Your posts",
			id: "/m",
			count: postCount ? postCount : null,
		},
		{
			text: "Saved posts",
			id: "/p",
			count: savedCount ? savedCount : null,
		},
	];
	const handleClick = (id) => {
		setID(id);
		if (id === "/p") {
			setData(dataSaved);
		} else {
			setData(dataHome);
		}
	};

	useEffect(() => {
		let unmounted = false;
		const getUID = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user && !unmounted) {
					setIsYou(user.uid);
				}
			});
		};
		const getUserPosts = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user && !unmounted) {
					user.getIdToken(true).then(async (idToken) => {
						if (idToken) {
							try {
								const response = await fetch(
									`http://localhost:5000/posts?u=${user.uid}&token=${idToken}`
								);
								if (response.ok) {
									const JSONresponse = await response.json();

									if (JSONresponse.posts && !unmounted) {
										dispatch(profileData(JSONresponse.posts));
										dispatch(profileDataCount(JSONresponse.postCount));

										setState(false);
										setData(JSONresponse.posts);
									}

									if (JSONresponse.empty) {
										setState(false);
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

		if (dataHome.length === 0) {
			getUserPosts();
		}

		getUID();

		return () => {
			unmounted = true;
		};
	}, [dataHome.length, dispatch]);

	const fetchedSavedPosts = () => {
		setState(true);

		handleClick("/p");
		if (dataSaved.length === 0) {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					user.getIdToken(true).then(async (idToken) => {
						if (idToken) {
							try {
								const response = await fetch(
									`http://localhost:5000/save?uid=${user.uid}&token=${idToken}`
								);
								if (response.ok) {
									const JSONresponse = await response.json();

									if (JSONresponse.savedPosts) {
										dispatch(profileSaves(JSONresponse.savedPosts));
										dispatch(profileSavesCount(JSONresponse.savedPostsCount));
										setData(JSONresponse.savedPosts);
										setState(false);
									}

									if (JSONresponse.empty) {
										setState(false);
									}
								}
							} catch (e) {
								console.log(e);
							}
						}
					});
				}
			});
		}
	};

	return (
		<div id="profile-contain-feed">
			<div id="profile-contain-text">
				{switcher.map((data, index) => {
					return (
						<span
							key={index}
							className="profile-text"
							onClick={
								data.id === "/m"
									? handleClick.bind(this, "/m")
									: fetchedSavedPosts
							}
							style={{
								color: isActive === data.id ? "#29303b" : "grey",
								fontWeight: isActive === data.id ? "700" : "500",
							}}
						>
							{data.text}
							{data.count > 0 ? (
								<React.Fragment>
									<span
										style={{ margin: `0 5px` }}
										dangerouslySetInnerHTML={{ __html: `&#8226;` }}
									></span>
									{data.count}
								</React.Fragment>
							) : null}
						</span>
					);
				})}
			</div>
			<SmallLoadingScreen loadingState={loadingState} />

			<div onLoad={() => setState(false)}>
				{data.length !== 0 ? (
					data.map((data, index) => {
						return (
							<div key={index}>
								{isActive === "/m" ? (
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
										noDM={true}
									/>
								) : (
									<Post
										_id={data._id}
										profileURL={data.profileURL}
										author={data.author}
										content={data.content}
										timestamp={data.rawTime}
										likeCount={data.likeCount}
										commentCount={data.commentCount}
										uid={data.uid}
										noLinks={false}
										noDM={isYou === data.uid ? true : false}
									/>
								)}

								{isActive === "/p" ? (
									index % 4 === 0 ? (
										<Ad
											smallImage={natgeo}
											bigImage={ad}
											title={"Welcome to your shot"}
											desc={
												"Join National Geographic and be part of our photo community and learn from experts."
											}
											adCallText={"Join now"}
										/>
									) : null
								) : null}
							</div>
						);
					})
				) : (
					<p id="no-posts">You do not have any posts yet</p>
				)}
			</div>
		</div>
	);
};

export default ProfileFeed;
