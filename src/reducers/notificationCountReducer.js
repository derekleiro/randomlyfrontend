const notificationCountReducer = (state = 0, action) => {
	switch (action.type) {
		case "SET_NOTIFICATION_COUNT":
			return (state = action.payload);
		default:
			return state;
	}
};

export default notificationCountReducer;
