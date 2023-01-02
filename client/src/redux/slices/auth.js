import {createSlice} from "@reduxjs/toolkit"


const initialState={
    isLoading:false,
    currentUser:null,
    errors:{}
}
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        getUser:(state,action)=>{
            state.currentUser=action.payload;
        },
        authStart:(state)=>{
            state.isLoading=true;
        },
    
        authSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.isLoading=false;
            state.errors={};
        },
        authError:(state,action)=>{
            state.isLoading=false;
            state.errors=action.payload;
        },
        cleanupErrors:(state)=>{
            state.errors={}
        },
        logout:(state)=>{
            state.currentUser=null;
        }
    }

})

export const {authStart,authSuccess,authError,cleanupErrors,getUser,logout}=authSlice.actions;

export default authSlice.reducer;