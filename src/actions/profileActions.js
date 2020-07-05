export const profileData = (data) => {
	return {
		type: "HOLD_PROFILE_DATA",
		payload: data,
	};
};

export const profileDataCount = (data) => {
	return {
		type: "HOLD_PROFILE_DATA_COUNT",
		payload: data,
	};
};

export const profileSaves = (data) => {
	return {
		type: "HOLD_PROFILE_SAVES_DATA",
		payload: data,
	};
};

export const profileSavesCount = (data) => {
	return {
		type: "HOLD_PROFILE_SAVES_COUNT",
		payload: data,
	};
};
