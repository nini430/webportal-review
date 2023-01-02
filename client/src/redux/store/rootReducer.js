import {combineReducers} from "@reduxjs/toolkit"
import {persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage"


import themeReducer from "../slices/theme"
import authReducer from "../slices/auth"
import reviewReducer from "../slices/review"
import profileReducer from "../slices/profile"
import searchReducer from "../slices/search"




const themeConfig={
    key:"theme",
    storage
}
const authConfig={
    key:"auth",
    storage,
    whitelist:["currentUser"]
}




const rootReducer=combineReducers({
    theme:persistReducer(themeConfig,themeReducer),
    auth:persistReducer(authConfig,authReducer),
    review:reviewReducer,
    profile:profileReducer,
    search:searchReducer
    

})

export default rootReducer;