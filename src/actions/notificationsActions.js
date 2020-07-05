export const holdNotifications = (data) => {
	return {
		type: "HOLD_NOTIFICATION_DATA",
		payload: data,
	};
};
