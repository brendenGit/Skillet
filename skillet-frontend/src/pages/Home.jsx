import * as React from 'react';
import BubbleSection from '../components/BubbleSection';
import SkilletApi from '../utils/SkilletApi.cjs';
import FeaturedRecipe from '../components/FeaturedRecipe';
import MobileFeaturedRecipe from '../components/MobileFeaturedRecipe';
import useMediaQuery from '@mui/material/useMediaQuery';
import RecipeRow from '../components/RecipeRow';
import Seperator from '../components/Seperator';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import LoadingModal from '../components/LoadingModal';


export default function Home() {
    const mealTypes = ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'fingerfood', 'snack', 'drink']
    const cuisineTypes = ['asian', 'american', 'british', 'cajun', 'chinese', 'eastern european', 'european', 'french', 'german', 'greek', 
                          'indian', 'irish', 'italian', 'japanese','korean', 'latin american', 'mediterranean', 'mexican', 'middle eastern', 
                          'southern', 'spanish', 'thai']
    const dietsTypes = ['gluten free', 'ketogenic', 'vegetarian', 'lacto vegetarian', 'ovo vegetarian', 'vegan', 'pescetarian'];

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
                const randMealtype = getRandomItem(mealTypes);
                const randCuisineType = getRandomItem(cuisineTypes);
                const randDietType = getRandomItem(dietsTypes);

                //get featured data
                homeDataObj.featuredRecipe = await skilletApi.getFeatured();

                //get random meal type recipes
                const randMealTypeRecipes = await skilletApi.getRandom({ type: randMealtype })
                homeDataObj.randMealtype = { type: randMealtype, recipes: randMealTypeRecipes.recipes }

                //get random cuisine type recipes
                const randCuisineTypeRecipes = await skilletApi.getRandom({ type: randCuisineType })
                homeDataObj.randCuisineType = { type: randCuisineType, recipes: randCuisineTypeRecipes.recipes }

                //get random diet type recipes
                const randDietTypeRecipes = await skilletApi.getRandom({ type: randDietType })
                homeDataObj.randDietType = { type: randDietType, recipes: randDietTypeRecipes.recipes }

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
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: '0 auto',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '1280px'
        }}>
            {isLoading ? (
                <LoadingModal />
            ) : (
                <>
                    <BubbleSection />
                    {!isBiggerThanExtraSmall && <MobileFeaturedRecipe recipeData={homeData.featuredRecipe} />}
                    {!isBiggerThanExtraSmall && <Seperator />}
                    {isBiggerThanExtraSmall && <FeaturedRecipe recipeData={homeData.featuredRecipe} />}
                    <RecipeRow recipes={homeData.randMealtype} />
                    {!isBiggerThanExtraSmall && <Seperator />}
                    <RecipeRow recipes={homeData.randCuisineType} />
                    {!isBiggerThanExtraSmall && <Seperator />}
                    <RecipeRow recipes={homeData.randDietType} />
                    {!isBiggerThanExtraSmall && <Seperator />}
                </>
            )}
        </Box>
    );
}
