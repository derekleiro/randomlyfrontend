const handleReplyDataReducer = (state = { replyData: [] }, action) => {
	switch (action.type) {
		case "HANDLE_REPLY_DATA":
			return state = {
				...state,
				replyData: state.replyData.concat({
					replyText: action.payload.replyText,
					timestamp: action.payload.timestamp,
					authorUID: action.payload.authorUID,
					pid: action.payload.pid,
					cid: action.payload.cid,
					authorName: action.payload.authorName,
					authorProfileURL: action.payload.authorProfileURL,
					replyingToUID: action.payload.replyingToUID,
					replyingToName: action.payload.replyingToName,
					likeCount: action.payload.likeCount,
					replyCounter: action.payload.replyCounter,
					replyType: action.payload.replyType,
					id: action.payload.id
				}),
			};
		default:
			return state;
	}
};

export default handleReplyDataReducer;
