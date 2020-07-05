const handleRepliesReducer = (state = null, action) => {
	switch (action.type) {
		case "HANDLE_REPLIES":
			return state = Object.assign({}, state, {
                authorUID: action.payload.authorUID,
                authorName: action.payload.authorName,
                replyingToUID: action.payload.replyingToUID,
                replyingToName: action.payload.replyingToName,
                cid: action.payload.cid,
                pid: action.payload.pid,
                profileURL: action.payload.profileURL,
                replyType: action.payload.replyType,
                replyCounter: action.payload.replyCounter,
                id: action.payload.id
            });
		default:
			return state;
	}
};

export default handleRepliesReducer;
