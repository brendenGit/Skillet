import * as React from 'react';
import SkilletApi from '../utils/SkilletApi.cjs';
import useMediaQuery from '@mui/material/useMediaQuery';
import BubbleSection from '../components/BubbleSection';
import RecipeCard from '../components/RecipeCard';
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


export default function Search() {
    const { query } = useParams();
    const [searchData, setSearchData] = useState(null);
    const [viewingRecipes, setViewingRecipes] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [buttonDisable, setButtonDisable] = useState(false);
    

    useEffect(() => {
        setIsLoading(true)

        //get data
        const fetchHomeData = async () => {
            try {
                const skilletApi = new SkilletApi();

                //get search data
                const data = await skilletApi.getSearch({ query: query })
                setSearchData(data);
                setViewingRecipes(data.slice(0, 9))
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                console.error("Error fetching data: ", error);
            }
        }
        fetchHomeData();
    }, []);

    const loadMore = () => {
        setViewingRecipes([...viewingRecipes, ...searchData.slice(9)]);
        setButtonDisable(true);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: '0 auto',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <BubbleSection />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ marginLeft: { sm: '5rem', xs: '1rem' }, display: 'flex', justifyContent: 'flex-start', marginTop: '2rem', marginBottom: '2rem' }}>
                            <Typography variant='h4' sx={{ letterSpacing: '-1px', fontWeight: 'bold' }}>
                                {`${query.charAt(0).toUpperCase() + query.slice(1)} recipes`}
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
