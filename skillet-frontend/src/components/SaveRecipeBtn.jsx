import * as React from 'react';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LoginRequiredModal from './LoginRequiredModal';
import { ButtonBase, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useState } from 'react';


export default function SaveRecipeBtn({ saved, saveCount, isRecipe }) {
    const user = useSelector((state) => state.user);
    const [open, setOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(saved);
    const [currSaveCount, setCurrSaveCount] = useState(saveCount);

    const handleOpen = () => {
        if (!user.username) {
            setOpen(true);
        } else {
            if (isSaved) {
                setIsSaved(false);
                setCurrSaveCount(currSaveCount - 1);
                //make API call
                console.log('api call to remove saved recipe');
            } else {
                setIsSaved(true);
                setCurrSaveCount(currSaveCount + 1);
                //makeAPI call
                console.log('api call to save recipe');
            }
        }
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
