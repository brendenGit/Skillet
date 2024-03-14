import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import parse from 'html-react-parser';
import RatingStars from './RatingStars';
import Box from '@mui/material/Box';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { CardActionArea, CardActions, ButtonBase, Button } from '@mui/material';

export default function MobileFeaturedRecipe({ recipeData }) {
    function minimizeSummary(str, maxLength) {
        return str.slice(0, maxLength);
    }

    const reducedRecipeSummary = parse(minimizeSummary(recipeData.summary, 250)); // truncate at 200 characters

    return (
        <>
            <Box sx={{ display: 'flex', marginTop: '6%', flexDirection: 'column', maxWidth: '90%', position: 'relative' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '3%' }}>
                    <Typography
                        variant='h5'
                        sx={{ fontWeight: 'bolder', fontSize: '1.45rem' }}
                    >
                        Featured Recipe
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <ButtonBase sx={{ borderRadius: '5px' }}>
                            <Typography
                                variant='p'
                                sx={{ marginRight: '5px' }}
                            >
                                Go to Recipe
                            </Typography>
                            <ArrowCircleRightIcon sx={{ fontSize: '1.5rem' }} />
                        </ButtonBase>
                    </Box>
                </Box>
                <Card sx={{ maxWidth: '100%' }} elevation={0}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            sx={{ width: '100%', height: 'auto', borderRadius: '5%' }}
                            image={recipeData.imageUrl}
                            alt={`Image of ${recipeData.title}`}
                        />
                    </CardActionArea>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {recipeData.title}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '3%' }}>
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
                        <Typography variant="body2" color="text.secondary" component="div" sx={{ lineHeight: '1.33' }}>
                            {reducedRecipeSummary}{'...'}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <Box
                sx={{
                    position: 'relative',
                    width: '100vw',
                    height: '5px',
                    backgroundColor: '#ccc'
                }}
            />
        </>
    );
}
