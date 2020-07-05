import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";

import Post from "./post/Post";
import Ad from "../ad/Ad";
import LoadingScreen from "../loadingscreen/LoadingScreen";
import { holdHomeData } from "../../actions/homeActions";

import natgeo from "../../assets/imgs/natgeo.jpg";
import ad from "../../assets/imgs/ad.jpg";

import { notificationCount } from "../../actions/notificationCount";

import "./homefeed.css";

const HomeFeed = () => {
	const dispatch = useDispatch();
	const data = useSelector((state) => state.homeData);
	const [loadingState, setState] = useState(true);
	const [isYou, setisYou] = useState(false);

	useEffect(() => {
		let unmounted = false;

		const getUid = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					setisYou(user.uid);
				}
			});
		};
		const fetchdata = async () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					setisYou(user.uid);

					user.getIdToken(true).then(async (token) => {
						try {
							const response = await fetch(
								`http://localhost:5000/feed?token=${token}`
							);
							if (response.ok) {
								const JSONresponse = await response.json();
								if (JSONresponse) {
									dispatch(holdHomeData(JSONresponse.feedPosts));
									dispatch(notificationCount(JSONresponse.notificationCount));
									if (!unmounted) {
										setState(false);
									}
								}
							}
						} catch (e) {
							console.log(e);
						}
					});
				}
			});
		};
		if (!data) {
			fetchdata();
		}
		getUid();

		return () => {
			unmounted = true;
		};
	}, [data, dispatch]);

	return (
		<React.Fragment>
			<LoadingScreen loadingState={loadingState} />
			<div className="home-feed" onLoad={() => setState(false)}>
				{data
					? data.map((data, index) => {
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
										noLinks={false}
										noDM={data.uid === isYou ? true : false}
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
					: null}
			</div>
		</React.Fragment>
	);
};

export default HomeFeed;
