import React, { useState, useEffect } from "react";

import callGoogleSignIn from "../../util/login";
import MainLoadingScreen from "../../components/loadingscreen/MainLoadingScreen";

import G from "../../assets/icons/g.png";

import "./login.css";

const Login = () => {
	const [loadingState, setState] = useState(true);

	const [fade, setFade] = useState(false);
	useEffect(() => {
		setTimeout(() => setFade(true), 200);
	}, []);

	return (
		<div
			id="login"
			onLoad={() => setTimeout(() => setState(false), 2000)}
			style={{ opacity: fade ? 1 : 0 }}
		>
			<MainLoadingScreen loadingState={loadingState} />
			<div id="login-container">
				<div id="logo-container">random-ly</div>
				<div id="app-description">
					Welcome to random-ly! A fun and simple way to share thoughts and chat
					with people around the world.
				</div>

				<div className="login-button" onClick={callGoogleSignIn}>
					<span>
						<img id="G-logo" src={G} alt="google logo" />
					</span>
					<span>Login with Google</span>
				</div>
			</div>
		</div>
	);
};

export default Login;
