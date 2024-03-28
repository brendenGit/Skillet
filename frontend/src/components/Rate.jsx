import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import SkilletApi from '../utils/SkilletApi.cjs';
import LoginRequiredModal from './LoginRequiredModal';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { updateRatedRecipes, setIsFetching } from '../features/user/userSlice';


export default function Rate({ recipeId }) {
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  // state to manage modal if user is not signed in
  const [open, setOpen] = useState(false);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  let rated;

  console.log(user);
  useEffect(() => {
    if (user.username) {
      const rated = user.ratedRecipes.find(recipe => recipe.id === recipeId);
      if (rated !== undefined) {
        setIsRated(true);
        setRating(rated.rating);
      }
    }
  }, [user, recipeId]);

  const rate = async (rating) => {
    if (!user.username) {
      setOpen(true);
    } else {
      const skilletApi = new SkilletApi(user.token);
      try {
        dispatch(setIsFetching(true));
        const ratedRecipe = await skilletApi.rateRecipe(user.username, recipeId, rating);
        dispatch(updateRatedRecipes([...user.ratedRecipes, ratedRecipe]));
        setRating(rating);
        setIsRated(true);
      } catch (error) {
        console.log(error);
      };
    };
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ marginTop: 1 }}>
      <Rating
        disabled={isRated}
        name="simple-controlled"
        value={rating}
        onChange={(event, rating) => {
          rate(rating);
        }}
      />
      <LoginRequiredModal open={open} handleClose={handleClose} />
    </Box>
  );
}