import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import RatingStars from './RatingStars';
import Box from '@mui/material/Box';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Tags from './Tags';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { CardActionArea, ButtonBase, } from '@mui/material';

export default function RecipeCard({ recipeData, isOnSearchPage }) {
    const theme = useTheme();
    const isBiggerThanExtraSmall = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <Card sx={{ minWidth: '350px', marginRight: isOnSearchPage && !isBiggerThanExtraSmall ? '0' : '2rem' }} elevation={0}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    sx={{ width: '100%', height: '177px', objectFit: 'cover', borderRadius: '2%' }}
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
                        <ButtonBase sx={{ marginTop: '-30%' }}>
                            <BookmarkBorderIcon />
                            <Typography variant='h7'>
                                {recipeData.saveCount}
                            </Typography>
                        </ButtonBase>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
