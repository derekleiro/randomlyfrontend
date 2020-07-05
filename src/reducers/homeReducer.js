const homeReducer = (state = null, action) => {
	switch (action.type) {
		case "HOLD_HOME_DATA":
			return (state = action.payload);
		default:
			return state;
	}
};

export default homeReducer;
