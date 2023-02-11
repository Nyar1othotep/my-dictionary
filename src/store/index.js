import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import wordsReducer from "./slices/wordsSlice";

export const store = configureStore({
   reducer: {
      user: userReducer,
      words: wordsReducer,
   },
});
