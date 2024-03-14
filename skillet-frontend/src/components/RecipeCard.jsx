import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import RatingStars from './RatingStars';
import Box from '@mui/material/Box';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { CardActionArea, CardActions, ButtonBase, Button } from '@mui/material';

export default function RecipeCard({ recipeData }) {
    return (
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
            </CardContent>
        </Card>
    );
}
