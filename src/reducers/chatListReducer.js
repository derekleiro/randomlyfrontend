const chatListReducer = (state = [], action) => {
	switch (action.type) {
		case "HOLD_CHATLIST_DATA":
			return (state = action.payload);
		default:
			return state;
	}
};

export default chatListReducer;

