import * as React from 'react';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LoginRequiredModal from './LoginRequiredModal';
import SkilletApi from '../utils/SkilletApi.cjs';
import { ButtonBase, Button, Typography } from '@mui/material';
import { updateSavedRecipes } from '../features/user/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';


export default function SaveRecipeBtn({ saveCount, isRecipe, recipeId }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const saved = user.username ? user.savedRecipes.includes(recipeId) : false;
    const [isSaved, setIsSaved] = useState(saved);
    const [currSaveCount, setCurrSaveCount] = useState(saveCount);

    // state to manage modal if user is not signed in
    const [open, setOpen] = useState(false);

    const handleOpen = async () => {
        if (!user.username) {
            setOpen(true);
        } else {
            const skilletApi = new SkilletApi(user.token)
            if (isSaved) {
                try {
                    await skilletApi.removeSavedRecipe(user.username, recipeId);
                    setIsSaved(false);
                    setCurrSaveCount(currSaveCount - 1);
                    dispatch(updateSavedRecipes(user.savedRecipes.filter(recipe => recipe !== recipeId)));
                } catch (error) {
                    throw new Error(`Failed to remove saved recipe`);
                };
            } else {
                try {
                    await skilletApi.saveRecipe(user.username, recipeId);
                    setIsSaved(true);
                    setCurrSaveCount(currSaveCount + 1);
                    dispatch(updateSavedRecipes([...user.savedRecipes, recipeId]));
                } catch (error) {
                    throw new Error(`Failed to save recipe`);
                };
            };
        };
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {isRecipe && <Button variant="contained" onClick={handleOpen} sx={{ maxWidth: '10rem', marginTop: 3 }}>
                {isSaved && <BookmarkIcon />}
                {!isSaved && <BookmarkBorderIcon />}
                Save
            </Button>}
            {!isRecipe && <ButtonBase onClick={handleOpen}>
                {isSaved && <BookmarkIcon />}
                {!isSaved && <BookmarkBorderIcon />}
            </ButtonBase>}
            <LoginRequiredModal open={open} handleClose={handleClose} />
            {!isRecipe && <Typography variant='h7'>
                {currSaveCount}
            </Typography>}
        </>
    );
}
