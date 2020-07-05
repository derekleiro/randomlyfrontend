const profilSavesReducer = (state = [], action) => {
	switch (action.type) {
		case "HOLD_PROFILE_SAVES_DATA":
			return (state = action.payload);
		default:
			return state;
	}
};

export default profilSavesReducer;