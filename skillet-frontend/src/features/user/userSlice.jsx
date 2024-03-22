import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: null,
    isFetching: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setIsFetching(state, action) {
            state.isFetching = action.payload;
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

export const { updateUserOnLogin, setIsFetching, updateRatedRecipes, updateSavedRecipes } = userSlice.actions;
export default userSlice.reducer;
