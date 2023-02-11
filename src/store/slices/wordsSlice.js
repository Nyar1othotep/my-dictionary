import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   wordsID: null,
   title: null,
   wordsArray: null,
};

const wordsSlice = createSlice({
   name: "words",
   initialState,
   reducers: {
      setWords(state, action) {
         state.wordsID = action.payload.wordsID;
         state.title = action.payload.title;
         state.wordsArray = action.payload.wordsArray;
      },
   },
});

export const { setWords } = wordsSlice.actions;
export default wordsSlice.reducer;
