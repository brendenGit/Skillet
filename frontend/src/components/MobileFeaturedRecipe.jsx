import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import parse from 'html-react-parser';
import RatingStars from './RatingStars';
import Box from '@mui/material/Box';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import SaveRecipeBtn from './SaveRecipeBtn';
import { useSelector } from 'react-redux';
import { CardActionArea, ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


export default function MobileFeaturedRecipe({ recipeData }) {
    const navigateTo = useNavigate();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        // This effect will run whenever username changes, triggering a rerender
    }, [user.username]);

    function goToRecipe() {
        navigateTo(`/recipes/${recipeData.title}`, { state: { recipeData } });
    }

    function minimizeSummary(str, maxLength) {
        return str.slice(0, maxLength);
    }

    const reducedRecipeSummary = parse(minimizeSummary(recipeData.summary, 250));

    return (
        <>
            <Box sx={{ display: 'flex', marginTop: '6%', flexDirection: 'column', maxWidth: '90%', position: 'relative' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '3%' }}>
                    <Typography
                        variant='h3'
                        sx={{ fontWeight: 'bolder', fontSize: '1.6rem' }}
                    >
                        Featured Recipe
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <ButtonBase sx={{ borderRadius: '5px' }} onClick={goToRecipe}>
                            <Typography
                                variant='p'
                                sx={{ marginRight: '5px', fontWeight: 'bold' }}
                            >
                                Go to Recipe
                            </Typography>
                            <ArrowCircleRightIcon sx={{ fontSize: '1.5rem' }} />
                        </ButtonBase>
                    </Box>
                </Box>
                <Card sx={{ maxWidth: '100%' }} elevation={0}>
                    <CardActionArea onClick={goToRecipe}>
                        <CardMedia
                            component="img"
                            sx={{ width: '100%', height: 'auto', borderRadius: '5%' }}
                            image={recipeData.image}
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
                                <SaveRecipeBtn saved={false} saveCount={recipeData.saveCount} recipeId={recipeData.id} />
                            </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" component="div" sx={{ lineHeight: '1.33' }}>
                            {reducedRecipeSummary}{'...'}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}
