import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";

import Ad from "../ad/Ad";
import LoadingScreen from "../loadingscreen/LoadingScreen";

import ad from "../../assets/imgs/ad.jpg";
import natgeo from "../../assets/imgs/natgeo.jpg";
import MessageIcon from "../../assets/icons/send.png";

import { holdDiscoverData } from "../../actions/discoverActions";
import { notificationCount } from "../../actions/notificationCount";

import "./discover-feed.css";

const DiscoverFeed = () => {
	const dispatch = useDispatch();
	const data = useSelector((state) => state.discoverData);
	const [loading, setLoadingState] = useState(true);

	useEffect(() => {
		let unmounted = false;

		const fetchdata = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					user
						.getIdToken(true)
						.then(async (token) => {
							try {
								const response = await fetch(
									`http://localhost:5000/discover?token=${token}`
								);
								if (response.ok) {
									const JSONresponse = await response.json();
									if (JSONresponse) {
										dispatch(holdDiscoverData(JSONresponse.users));
										dispatch(notificationCount(JSONresponse.notificationCount));
										if (!unmounted) {
											setLoadingState(false);
										}
									}
								} else {
									throw new Error("An Error occurred");
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

		if (!data) {
			fetchdata();
		}

		return () => {
			unmounted = true;
		};
	}, [data, dispatch]);

	return (
		<React.Fragment>
			<LoadingScreen loadingState={loading} />
			<div id="suggestedprofiles" onLoad={() => setLoadingState(false)}>
				{data
					? data.map((data, index) => {
							return (
								<div key={index}>
									<div className="suggested-profiles-container">
										<span className="profile-info">
											<Link to={`/u/${data.uid}`}>
												<span className="profile-image">
													<img src={data.photoURL} alt={data.name} />
												</span>
											</Link>

											<span>
												<Link to={`/u/${data.uid}`}>
													<span className="profile-name">{data.name}</span>
												</Link>
												<span
													style={{ margin: `0 5px` }}
													dangerouslySetInnerHTML={{ __html: `&#8226;` }}
												></span>
												<span className="profile-interest">
													{data.interests === ""
														? "No interests"
														: `${data.interests}`}
												</span>
												<span className="profile-message-button">
													<Link to={`/chat/${data.uid}`}>
														<img
															src={MessageIcon}
															alt={`send a message to ${data.name}`}
														/>
													</Link>
												</span>
												<div className="profile-bio">{data.bio}</div>
											</span>
										</span>
									</div>
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

export default DiscoverFeed;
