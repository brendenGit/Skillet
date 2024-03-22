import Grid from '@mui/material/Grid';
import RatingStars from '../components/RatingStars';
import BubbleSection from '../components/BubbleSection';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import parse from 'html-react-parser';
import Tags from '../components/Tags';
import SkilletApi from '../utils/SkilletApi.cjs';
import IngredientList from '../components/IngredientList';
import PreperationList from '../components/PreperationList';
import Rate from '../components/Rate';
import LoadingModal from '../components/LoadingModal';
import SaveRecipeBtn from '../components/SaveRecipeBtn';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';


export default function Recipe() {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [recipeData, setRecipeData] = useState(null);
    const [summary, setSummary] = useState(null);
    const user = useSelector((state) => state.user);


    useEffect(() => {
        const fetchRecipeData = async () => {
            console.log(location.state.recipeData.id)
            try {
                const skilletApi = new SkilletApi();
                const recipe = await skilletApi.getRecipe(location.state.recipeData.id);
                setSummary(parse(recipe.summary));
                setRecipeData(recipe);
            } catch (error) {
                setIsLoading(false)
                console.error("Error fetching data: ", error);
            }
            setIsLoading(false);
        }
        fetchRecipeData();
    }, []);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: '0 auto',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: { xs: '85vw', sm: "1280px" },
            marginBottom: 10
        }}>
            {isLoading ? (
                <LoadingModal />
            ) : (
                <>
                    {console.log(recipeData)}
                    <BubbleSection />
                    <Box sx={{ display: 'flex', marginTop: 8 }}>
                        <Grid container rowSpacing={5} columnSpacing={1}>
                            <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center', borderBottom: { sm: 'solid black 1px' } }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', paddingRight: 10 }}>
                                    <Typography variant="h1" sx={{ fontWeight: 'bolder', fontSize: '2rem' }}>
                                        {recipeData.title}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 'bold', marginTop: 3 }}>
                                        <span>Source: <a href={recipeData.sourceUrl}>{recipeData.sourceName}</a></span>
                                    </Typography>
                                    <Tags recipeData={recipeData} />
                                </Box>
                            </Grid>
                            <Grid item xs={0} sm={1} />
                            <Grid item xs={12} sm={8}>
                                <Box
                                    component="img"
                                    sx={{
                                        height: 'auto',
                                        width: "100%",
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
                                    }}
                                    alt={`Image of ${recipeData.title}`}
                                    src={`${recipeData.imageUrl}`}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3} sx={{ borderBottom: 'solid black 1px', paddingBottom: 5 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                                        <Typography variant='div' sx={{ marginRight: 2, fontWeight: 'bold', fontSize: '1.4rem' }}>
                                            Cook time:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1.2rem', color: "#555555", display: 'flex', alignItems: 'center' }}>
                                            <AccessTimeIcon sx={{ marginRight: '0.5rem' }} />{`${recipeData.readyInMinutes} minutes`}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                                        <Typography variant='div' sx={{ marginRight: 2, fontWeight: 'bold', fontSize: '1.4rem' }}>
                                            Rating:
                                        </Typography>
                                        <RatingStars rating={recipeData.rating} />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant='div' sx={{ marginRight: 2, fontWeight: 'bold', fontSize: '1.4rem' }}>
                                            Your Rating
                                        </Typography>
                                        <Rate />
                                    </Box>
                                    <SaveRecipeBtn saved={false} saveCount={recipeData.saveCount} isRecipe={true} />
                                </Box>
                            </Grid>
                            <Grid item xs={0} sm={1} />
                            <Grid item xs={12} sm={8} sx={{ borderBottom: 'solid black 1px', paddingBottom: 5 }}>
                                <Typography component='div' variant='body1' sx={{ fontSize: '1.25rem', lineHeight: 1.77 }}>
                                    {summary}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bolder' }}>
                                        Ingredients
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.4rem', color: "#555555", display: 'flex', alignItems: 'center', marginTop: 3, marginBottom: 3 }}>
                                        Yields {recipeData.servings} servings
                                    </Typography>
                                    <IngredientList ingredients={recipeData.ingredients} />
                                    <Button variant="outlined" sx={{ color: 'black', maxWidth: '20rem', border: 'solid 1px black', borderRadius: '40px' }}>
                                        Add to a Grocery List
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bolder' }}>
                                    Preparation
                                </Typography>
                                <PreperationList instructions={recipeData.instructions} />
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}
        </Box >
    );
}
