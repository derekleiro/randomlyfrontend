export const handleReplies = (data) => {
	return {
		type: "HANDLE_REPLIES",
		payload: {
			authorUID: data.authorUID,
			authorName: data.authorName,
			replyingToUID: data.replyingToUID,
			replyingToName: data.replyingToName,
			cid: data.cid,
			pid: data.pid,
			profileURL: data.authorProfileURL,
			replyType: data.replyType,
            replyCounter: data.replyCounter,
            id: data.id
		},
	};
};

export const handleReplyData = (data) => {
	return {
		type: "HANDLE_REPLY_DATA",
		payload: {
			replyText: data.replyText,
			timestamp: Date.now(),
			authorUID: data.authorUID,
			pid: data.pid,
			cid: data.cid,
			authorName: data.authorName,
			authorProfileURL: data.authorProfileURL,
			replyingToUID: data.replyingToUID,
			replyingToName: data.replyingToName,
			likeCount: data.likeCount,
			replyCounter: data.replyCounter,
            replyType: data.replyType,
			id: data.id
		},
	};
};
