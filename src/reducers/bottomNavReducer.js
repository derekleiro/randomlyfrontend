const bottomNavReducers = (state = "home", action) => {
	switch (action.type) {
		case "CHANGE_TO_HOME":
			return (state = "home");
		case "CHANGE_TO_DISCOVER":
			return (state = "discover");
		case "CHANGE_TO_MESSENGER":
			return (state = "messenger");
		case "CHANGE_TO_NOTIFICATIONS":
			return (state = "notifications");
		case "CHANGE_TO_PROFILE":
			return (state = "profile");
		default:
			return state;
	}
};

export default bottomNavReducers;
