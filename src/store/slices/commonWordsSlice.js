import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   en: null,
   ru: null,
};

const userSlice = createSlice({
   name: "commonWords",
   initialState,
   reducers: {
      setUser(state, action) {
         state.en = action.payload.en;
         state.ru = action.payload.ru;
      }
   },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
