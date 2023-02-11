import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   email: null,
   token: null,
   userUID: null,
};

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setUser(state, action) {
         state.email = action.payload.email;
         state.token = action.payload.token;
         state.userUID = action.payload.userUID;
      },
      removeUser(state) {
         state.email = null;
         state.token = null;
         state.userUID = null;
      },
   },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
