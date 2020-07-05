const profileReducer = (state = [], action) => {
	switch (action.type) {
		case "HOLD_PROFILE_DATA":
			return (state = action.payload);
		default:
			return state;
	}
};

export default profileReducer;
