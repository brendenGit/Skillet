import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import parse from 'html-react-parser';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import RatingStars from './RatingStars';
import SaveRecipeBtn from './SaveRecipeBtn';
import { useNavigate } from 'react-router-dom';
import { ButtonBase, CardActionArea } from '@mui/material';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';


export default function FeaturedRecipe({ recipeData }) {
    const navigateTo = useNavigate();
    const username = useSelector((state) => state.user.username);

    useEffect(() => {
        // This effect will run whenever username changes, triggering a rerender
    }, [username]);

    function goToRecipe() {
        navigateTo(`/recipes/${recipeData.title}`, { state: { recipeData } });
    }

    function minimizeSummary(str, maxLength) {
        return str.slice(0, maxLength);
    }

    const reducedRecipeSummary = parse(minimizeSummary(recipeData.summary, 850)); // truncate at 200 characters

    return (
        <Box sx={{ display: 'flex', marginTop: '3%', flexDirection: 'column', maxWidth: '90%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography
                    variant='h5'
                    sx={{ fontWeight: 'bolder', fontSize: '2rem', marginBottom: 1 }}
                >
                    Featured Recipe
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <ButtonBase sx={{ borderRadius: '5px' }} onClick={goToRecipe}>
                        <Typography
                            sx={{ marginRight: '5px', fontWeight: 'bold' }}
                        >
                            Go to Recipe
                        </Typography>
                        <ArrowCircleRightIcon sx={{ fontSize: '1.5rem' }} />
                    </ButtonBase>
                </Box>
            </Box>
            <Card elevation={0} sx={{ display: 'flex' }}>
                <CardActionArea onClick={goToRecipe}>
                    <CardMedia
                        component="img"
                        sx={{ width: '500px', height: 'auto', borderRadius: '5%' }}
                        image={recipeData.image}
                        alt={`Image of ${recipeData.title}`}
                    />
                </CardActionArea>
                <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: "2%" }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h5" sx={{ fontWeight: 'bold' }}>
                            {recipeData.title}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '3%' }}>
                            <RatingStars rating={recipeData.rating} />
                            <Box sx={{ marginLeft: '5%', display: 'flex', flexDirection: 'row' }}>
                                <SaveRecipeBtn saveCount={recipeData.saveCount} recipeId={recipeData.id} />
                            </Box>
                        </Box>
                        <Typography variant="p" color="text.secondary" component="div" sx={{ lineHeight: '1.33' }}>
                            {reducedRecipeSummary}{'...'}
                        </Typography>
                    </CardContent>
                </Box>
            </Card >
        </Box >
    );
}

// <Card sx={{ display: 'flex' }}>
// <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//   <CardContent sx={{ flex: '1 0 auto' }}>
//     <Typography component="div" variant="h5">
//       Live From Space
//     </Typography>
//     <Typography variant="subtitle1" color="text.secondary" component="div">
//       Mac Miller
//     </Typography>
//   </CardContent>
//   <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
//     <IconButton aria-label="previous">
//       {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
//     </IconButton>
//     <IconButton aria-label="play/pause">
//       <PlayArrowIcon sx={{ height: 38, width: 38 }} />
//     </IconButton>
//     <IconButton aria-label="next">
//       {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
//     </IconButton>
//   </Box>
// </Box>
// <CardMedia
//   component="img"
//   sx={{ width: 151 }}
//   image="/static/images/cards/live-from-space.jpg"
//   alt="Live from space album cover"
// />
// </Card>
