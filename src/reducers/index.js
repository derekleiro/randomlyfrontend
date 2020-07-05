import { combineReducers } from "redux";

import bottomNavReducers from "./bottomNavReducer";
import handleRepliesReducer from "./handleRepliesReducer";
import handleReplyDataReducer from "./handleReplyDataReducer";
import notificationsReducer from "./notificationsReducer";
import homeReducer from "./homeReducer";
import discoverReducer from "./discoverReducer";
import profileReducer from "./profileReducer";
import profileCountReducer from "./profileCountReducer";
import notificationCountReducer from "./notificationCountReducer";
import profilSavesReducer from "./profileSavesReducer";
import profileSavesCountReducer from "./profileSavesCountReducer";
import chatListReducer from "./chatListReducer";

const allReducers = combineReducers({
    homeData: homeReducer,
    discoverData: discoverReducer,
    notificationsData: notificationsReducer,
    notificationCount: notificationCountReducer,
    profileData: profileReducer, 
    profileDataCount: profileCountReducer,
    bottomNav: bottomNavReducers,
    handleReplies: handleRepliesReducer,
    handleReplyData: handleReplyDataReducer,
    profileSaves: profilSavesReducer,
    profileSavesCount: profileSavesCountReducer,
    chatList: chatListReducer
});

export default allReducers;
