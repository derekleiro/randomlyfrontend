const profileSavesCountReducer = (state = 0, action) => {
	switch (action.type) {
		case "HOLD_PROFILE_SAVES_COUNT":
			return (state = action.payload);
		default:
			return state;
	}
};

export default profileSavesCountReducer;