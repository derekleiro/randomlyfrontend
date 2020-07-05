const discoverReducer = (state = null, action) => {
	switch (action.type) {
		case "HOLD_DISCOVER_DATA":
			return (state = action.payload);
		default:
			return state;
	}
};

export default discoverReducer;
