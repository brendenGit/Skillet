import * as React from 'react';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LoginRequiredModal from './LoginRequiredModal';
import SkilletApi from '../utils/SkilletApi.cjs';
import { ButtonBase, Button, Typography } from '@mui/material';
import { updateSavedRecipes } from '../features/user/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';


export default function SaveRecipeBtn({ saved, saveCount, isRecipe, recipeId }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [open, setOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(saved);
    const [currSaveCount, setCurrSaveCount] = useState(saveCount);

    const handleOpen = async () => {
        console.log(typeof recipeId);
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
                    console.log('inside save recipe client side button')
                    await skilletApi.saveRecipe(user.username, recipeId);
                    setIsSaved(true);
                    setCurrSaveCount(currSaveCount + 1);
                    const updatedRecipes = [...user.savedRecipes, recipedId];
                    console.log(updatedRecipes);
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
