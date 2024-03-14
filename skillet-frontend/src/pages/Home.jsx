import * as React from 'react';
import BubbleSection from '../components/BubbleSection';
import SkilletApi from '../utils/SkilletApi.cjs';
import FeaturedRecipe from '../components/FeaturedRecipe';
import MobileFeaturedRecipe from '../components/MobileFeaturedRecipe';
import useMediaQuery from '@mui/material/useMediaQuery';
import RecipeRow from '../components/RecipeRow';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';


export default function Home() {
    const mealTypes = ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'fingerfood', 'snack', 'drink']
    const cuisineTypes = ['African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian',
        'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai']

    const [homeData, setHomeData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const theme = useTheme();
    const isBiggerThanExtraSmall = useMediaQuery(theme.breakpoints.up('sm'));

    const getRandomItem = (array) => {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    };

    useEffect(() => {
        setIsLoading(true)

        //get data
        const fetchHomeData = async () => {
            try {
                const homeDataObj = {};
                const skilletApi = new SkilletApi();
                homeDataObj.featuredRecipe = await skilletApi.getFeatured();
                const randMealType1 = getRandomItem(mealTypes);
                const randMealType2 = getRandomItem(mealTypes);
                homeDataObj.randMealtype1 = await skilletApi.getRecipes({ type: randMealType1 })
                console.log(homeDataObj.randMealtype1);
                setHomeData(homeDataObj);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                console.error("Error fetching data: ", error);
            }
        }
        fetchHomeData();
    }, []);

    return (
        <Box id="test" sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: '0 auto',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '1280px'
        }}>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <BubbleSection />
                    {!isBiggerThanExtraSmall && <MobileFeaturedRecipe recipeData={homeData.featuredRecipe} />}
                    {isBiggerThanExtraSmall && <FeaturedRecipe recipeData={homeData.featuredRecipe} />}
                    <RecipeRow />
                </>
            )}
        </Box>
    );
}
