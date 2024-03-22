import { createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';


const initialState = {
    username: null,
    isFetching: false,
    justLoggedIn: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setIsFetching(state, action) {
            state.isFetching = action.payload;
        },
        setJustLoggedIn(state, action) {
            state.justLoggedIn = action.payload
        },
        updateUserOnLogin(state, action) {
            state.userId = action.payload.id
            state.username = action.payload.username;
            state.admin = action.payload.isAdmin
            state.token = action.payload.token;
            state.ratedRecipes = action.payload.ratedRecipes;
            state.savedRecipes = action.payload.savedRecipes;
        },
        updateUserOnLogout(state) {
            return initialState;
        },
        updateRatedRecipes(state, action) {
            state.ratedRecipes = action.payload.ratedRecipes;
        },
        updateSavedRecipes(state, action) {
            state.savedRecipes = action.payload.savedRecipes;
        }
    }
})

const userPersistConfig = {
    key: 'user',
    storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userSlice.reducer);

export const { 
    updateUserOnLogin, 
    setIsFetching, 
    updateRatedRecipes, 
    updateSavedRecipes, 
    updateUserOnLogout,
    setJustLoggedIn,
} = userSlice.actions;

export default persistedUserReducer;
