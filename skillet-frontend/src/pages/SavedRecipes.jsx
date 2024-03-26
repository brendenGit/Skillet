import SkilletApi from '../utils/SkilletApi.cjs';
import BubbleSection from '../components/BubbleSection';
import RecipeCard from '../components/RecipeCard';
import LoadingModal from '../components/LoadingModal';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


export default function SavedRecipes() {
    const user = useSelector((state) => state.user);
    const skilletApi = new SkilletApi(user.token);
    const [buttonDisable, setButtonDisable] = useState(user.savedRecipes.length < 9);
    const [viewingRecipes, setViewingRecipes] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(null);


    useEffect(() => {
        setIsLoading(true)

        //get data
        const fetchData = async () => {

            try {
                const data = await Promise.all(user.savedRecipes.slice(0, 9).map(recipeId => {
                    return skilletApi.getRecipe(recipeId);
                }));
                setViewingRecipes(data);
                setOffset(9);

                if (offset >= user.savedRecipes.length) setButtonDisable(true);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                console.error("Error fetching data: ", error);
            }
        }
        fetchData();
    }, []);

    const loadMore = async () => {
        if (offset !== null && offset !== undefined) {
            const data = await Promise.all(user.savedRecipes.slice(offset, (offset + 9)).map(recipeId => {
                return skilletApi.getRecipe(recipeId);
            }));
            setViewingRecipes([...viewingRecipes, ...data]);
            setOffset(offset + 9);
        };
        if (offset >= user.savedRecipes.length) {
            setButtonDisable(true)
        };
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: '0 auto',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10
        }}>
            {isLoading ? (
                <LoadingModal />
            ) : (
                <>
                    <BubbleSection />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ marginLeft: { sm: '5rem', xs: '1rem' }, display: 'flex', justifyContent: 'flex-start', marginTop: '2rem', marginBottom: '2rem' }}>
                            <Typography variant='h4' sx={{ letterSpacing: '-1px', fontWeight: 'bold' }}>
                                {`${user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s saved recipes`}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            margin: '0 auto',
                            alignItems: 'center',
                            justifyContent: 'center',
                            maxWidth: '1280px',
                            flexWrap: 'wrap',
                        }}>
                            {viewingRecipes.map(recipe => {
                                console.log(recipe);
                                return (
                                    <RecipeCard
                                        recipeData={recipe}
                                        key={recipe.id}
                                        isOnSearchPage={true}
                                    />
                                )
                            })}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button onClick={loadMore} variant="contained" sx={{ maxWidth: '10rem' }} disabled={buttonDisable}>Load More</Button>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
}
