import Grid from '@mui/material/Grid';
import BubbleSection from '../components/BubbleSection';
import SkilletApi from '../utils/SkilletApi.cjs';
import LoadingModal from '../components/LoadingModal';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';


export default function GroceryLists() {
    const user = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const [groceryListData, setGroceryListData] = useState(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const skilletApi = new SkilletApi();
    //             const recipe = await skilletApi.getRecipe(location.state.recipeData.id);
    //             setSummary(parse(recipe.summary));
    //             setRecipeData(recipe);
    //         } catch (error) {
    //             setIsLoading(false)
    //             console.error("Error fetching data: ", error);
    //         }
    //         setIsLoading(false);
    //     }
    //     fetchRecipeData();
    // }, []);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: '0 auto',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginBottom: 10
        }}>
            {isLoading ? (
                <LoadingModal />
            ) : (
                <>
                    <BubbleSection />
                    <Box sx={{ display: 'flex', marginTop: 8, width: '90%' }}>
                        <Grid container columnSpacing={1}>
                            <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', border: { sm: 'solid black 1px' } }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                                    <Typography variant="h1" sx={{ fontWeight: 'bolder', fontSize: '2rem' }}>
                                        {`${user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s grocery lists`}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Box>
                                    <Typography variant="h1" sx={{ fontWeight: 'bolder', fontSize: '2rem' }}>
                                        Ingredients
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}
        </Box >
    );
}
