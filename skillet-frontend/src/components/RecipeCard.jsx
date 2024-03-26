import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import RatingStars from './RatingStars';
import Box from '@mui/material/Box';
import Tags from './Tags';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useMediaQuery from '@mui/material/useMediaQuery';
import SaveRecipeBtn from './SaveRecipeBtn';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { CardActionArea, ButtonBase, } from '@mui/material';
import { useState } from 'react';

export default function RecipeCard({ recipeData, isOnSearchPage }) {
    const [saveCount, setSaveCount] = useState(null)
    const [saved, setSaved] = useState(null)
    const navigateTo = useNavigate();
    const theme = useTheme();
    const isBiggerThanExtraSmall = useMediaQuery(theme.breakpoints.up('sm'));

    function goToRecipe() {
        navigateTo(`/recipes/${recipeData.title}`, { state: { recipeData } });
    }

    console.log(recipeData);

    return (
        <Card sx={{ minWidth: '350px', maxWidth: '350px', marginRight: isOnSearchPage && !isBiggerThanExtraSmall ? '0' : '2rem' }} elevation={0}>
            <CardActionArea onClick={goToRecipe}>
                <CardMedia
                    component="img"
                    sx={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '2%'
                    }}
                    image={recipeData.image}
                    alt={`Image of ${recipeData.title}`}
                />
            </CardActionArea>
            <CardContent>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', fontSize: '1.25rem', letterSpacing: '-1px' }}>
                    {recipeData.title}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1rem', color: "#555555", display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ marginRight: '0.5rem' }} />{`${recipeData.readyInMinutes} minutes | ${recipeData.servings} servings`}
                </Typography>
                <Tags recipeData={recipeData} />
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '3%' }}>
                    <RatingStars rating={recipeData.rating} />
                    <Box sx={{ marginLeft: '5%', display: 'flex', flexDirection: 'row' }}>
                        <SaveRecipeBtn saved={false} saveCount={recipeData.saveCount} recipeId={recipeData.id} />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
