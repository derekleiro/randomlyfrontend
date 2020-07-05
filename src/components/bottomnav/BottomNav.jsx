import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
	changeBottomNavStateToHome,
	changeBottomNavStateToDiscover,
	changeBottomNavStateToMessenger,
	changeBottomNavStateToNotifications,
	changeBottomNavStateToProfile,
} from "../../actions/bottomNavActions";

import missing from "../../assets/icons/missing.png";

import home from "../../assets/icons/home.png";
import discover from "../../assets/icons/discover.png";
import messenger from "../../assets/icons/messenger.png";
import notification from "../../assets/icons/not.png";

import home_active from "../../assets/icons/home_active.png";
import discover_active from "../../assets/icons/discover_active.png";
import messenger_active from "../../assets/icons/messenger_active.png";
import notification_active from "../../assets/icons/not_active.png";

import "./bottomnav.css";

const BottomNav = () => {
	const url = window.location.pathname.replace(/[/]/g, "");
	const state = useSelector((state) => state.bottomNav);
	const notificationCount = useSelector((state) => state.notificationCount);
	const dispatch = useDispatch();

	useEffect(() => {
		const switchState = () => {
			switch (url) {
				case "":
					return dispatch(changeBottomNavStateToHome);
				case "discover":
					return dispatch(changeBottomNavStateToDiscover);
				case "messenger":
					return dispatch(changeBottomNavStateToMessenger);
				case "notifications":
					return dispatch(changeBottomNavStateToNotifications);
				case "profile":
					return dispatch(changeBottomNavStateToProfile);
				default:
					return dispatch(changeBottomNavStateToHome);
			}
		};
		switchState();
	}, [dispatch, url]);

	const photoURL = JSON.parse(localStorage.getItem("user"))
		? JSON.parse(localStorage.getItem("user")).photoURL
		: "";

	const handleClick = (state) => {
		switch (state) {
			case "home":
				return dispatch(changeBottomNavStateToHome);
			case "discover":
				return dispatch(changeBottomNavStateToDiscover);
			case "messenger":
				return dispatch(changeBottomNavStateToMessenger);
			case "notifications":
				return dispatch(changeBottomNavStateToNotifications);
			case "profile":
				return dispatch(changeBottomNavStateToProfile);
			default:
				return dispatch(changeBottomNavStateToHome);
		}
	};
	return (
		<div id="bottom-nav">
			<span className="bottom-nav-image-holder">
				<Link to="/" onClick={handleClick.bind(this, "home")}>
					<img
						src={state === "home" ? home_active : home}
						alt="Homepage"
						title="Homepage"
					/>
				</Link>
			</span>
			<span className="bottom-nav-image-holder">
				<Link to="/discover" onClick={handleClick.bind(this, "discover")}>
					<img
						src={state === "discover" ? discover_active : discover}
						alt="Discover page"
						title="Discover page"
					/>
				</Link>
			</span>
			<span className="bottom-nav-image-holder">
				<Link to="/messenger" onClick={handleClick.bind(this, "messenger")}>
					<img
						src={state === "messenger" ? messenger_active : messenger}
						alt="Messenger"
						title="Messenger"
					/>
				</Link>
				
			</span>
			<span className="bottom-nav-image-holder">
				<Link
					to="/notifications"
					onClick={handleClick.bind(this, "notifications")}
				>
					<img
						src={state === "notifications" ? notification_active : notification}
						alt="Notifications page"
						title="Notifications page"
					/>
				</Link>
				{notificationCount > 0 ? (
					<>
						<span
							style={{ margin: `0 5px` }}
							dangerouslySetInnerHTML={{ __html: `&#8226;` }}
						></span>
						<span id="notification_indicater">{notificationCount}</span>
					</>
				) : null}
			</span>
			<span className="bottom-nav-image-holder">
				<Link to="/profile" onClick={handleClick.bind(this, "profile")}>
					<img
						id={
							state === "profile"
								? "bottom-nav-profile-pic-active"
								: "bottom-nav-profile-pic"
						}
						src={photoURL || missing}
						alt={`Profile page`}
						title="Profile page"
					/>
				</Link>
			</span>
		</div>
	);
};

export default BottomNav;
