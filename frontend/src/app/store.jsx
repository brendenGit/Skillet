import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from 'redux-persist';
import persistedUserReducer from "../features/user/userSlice";


export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
});

export const persistor = persistStore(store);
