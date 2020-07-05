const profileCountReducer = (state = 0, action) => {
	switch (action.type) {
		case "HOLD_PROFILE_DATA_COUNT":
			return (state = action.payload);
		default:
			return state;
	}
};

export default profileCountReducer;