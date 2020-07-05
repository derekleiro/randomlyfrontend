import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";

import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Discover from "./pages/discover/Discover";
import Messenger from "./pages/messenger/Messenger";
import Notifications from "./pages/notifications/Notifications";
import Profile from "./pages/profile/Profile";
import Create from "./pages/create/Create";

import BottomNav from "./components/bottomnav/BottomNav";
import PostView from "./components/homefeed/postview/PostView";

import ProfileView from "./components/profilefeed/profileview/ProfileView";
import ChatRoom from "./components/messengerfeed/chatroom/ChatRoom";

import "./assets/fonts/fonts.css";
import "./App.css";

firebase.initializeApp({
	apiKey: "AIzaSyBpxsPF9TnG3EwHQ1QgoB_-s9AcMCdqjX8",
	authDomain: "random-ly.com",
});

const create_cookie = (name, value, days) => {
	let expires = "";
	if (days) {
		let date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toGMTString();
	}

	document.cookie = name + "=" + value + expires + "; path=/";
};

const readCookie = (name) => {
	let nameEQ = name + "=";
	let ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
};

const eraseCookie = (name) => {
	document.cookie = name + "=; Max-Age=-99999999;";
};

let cookieRegistry = [];

const listenCookieChange = (cookieName, callback) => {
	setInterval(() => {
		if (cookieRegistry[cookieName]) {
			if (readCookie(cookieName) !== cookieRegistry[cookieName]) {
				cookieRegistry[cookieName] = readCookie(cookieName);
				return callback();
			}
		} else {
			cookieRegistry[cookieName] = readCookie(cookieName);
		}
	}, 100);
};

const App = () => {
	const data = useState(JSON.parse(localStorage.getItem("userInfo")));
	const offline = data ? data.bio : null;
	const [auth, setAuth] = useState(readCookie("auth"));

	useEffect(() => {
		const fetch_details = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					user.getIdToken(true).then(async (token) => {
						try {
							const response = await fetch(
								`http://localhost:5000/user?u=${user.uid}&token=${token}`
							);

							if (response.ok) {
								const JSONresponse = await response.json();

								if (JSONresponse) {
									localStorage.setItem(
										"userInfo",
										JSON.stringify({
											bio: JSONresponse.user.bio,
											interests: JSONresponse.user.interests,
										})
									);
									localStorage.setItem(
										"user",
										JSON.stringify({
											photoURL: JSONresponse.user.photoURL,
											name: JSONresponse.user.name,
										})
									);
								}
							}
						} catch (e) {
							console.log(e);
						}
					});
				}
			});
		};

		if (!offline) {
			fetch_details();
		}
	}, [offline]);

	listenCookieChange("auth", () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				setAuth(null);
				eraseCookie("auth");
				localStorage.clear();
			})
			.catch((error) => {
				console.log(error);

				firebase.auth().onAuthStateChanged((user) => {
					if (user) {
						user
							.getIdToken(true)
							.then((token) => {
								if (token) {
									eraseCookie("auth");
									create_cookie("auth", token, 3000);
									setAuth(readCookie("auth"));
								} else {
									setAuth(null);
								}
							})
							.catch((e) => {
								setAuth(null);
								console.log(e);
							});
					} else {
						setAuth(null);
					}
				});
			});
	});

	const token = auth ? auth : null;

	const PrivateRoute = ({ component: Component, path, exact }) => {
		return (
			<Route
				path={path}
				exact={exact}
				render={(props) =>
					token ? <Component {...props} /> : <Redirect to="/login" />
				}
			/>
		);
	};

	const LoginRoute = ({ component: Component, path, exact }) => {
		return (
			<Route
				path={path}
				exact={exact}
				render={(props) =>
					!token ? <Component {...props} /> : <Redirect to="/" />
				}
			/>
		);
	};

	return (
		<div className="container">
			<Router>
				<Switch>
					<PrivateRoute path="/" exact={true} component={Home} />
					<PrivateRoute path="/post/:id" exact={true} component={PostView} />
					<PrivateRoute path="/u/:id" exact={true} component={ProfileView} />
					<PrivateRoute path="/chat/:id" exact={true} component={ChatRoom} />
					<PrivateRoute path="/create" exact={true} component={Create} />
					<PrivateRoute path="/discover" exact={true} component={Discover} />
					<PrivateRoute path="/messenger" exact={true} component={Messenger} />
					<PrivateRoute
						path="/notifications"
						exact={true}
						component={Notifications}
					/>
					<PrivateRoute path="/profile" exact={true} component={Profile} />
					<LoginRoute path="/login" exact component={Login} />
					<Redirect path="*" to="/" />
				</Switch>
				{!token ? null : <BottomNav />}
			</Router>
		</div>
	);
};

export default App;
