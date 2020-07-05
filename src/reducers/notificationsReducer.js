const notificationsReducer = (state = null, action) => {
	switch (action.type) {
		case "HOLD_NOTIFICATION_DATA":
			return (state = action.payload);
		default:
			return state;
	}
};

export default notificationsReducer;
