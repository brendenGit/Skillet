import { ButtonBase, Typography, Box, CardActionArea } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useRef, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import RecipeCard from './RecipeCard';
import { useNavigate } from 'react-router-dom';


const ScrollContainer = styled('div')(({ theme }) => ({
    maxWidth: '95vw',
    display: 'flex',
    overflowX: 'auto',
    marginTop: '3%',
    whiteSpace: 'nowrap',
    WebkitOverflowScrolling: 'touch',
    '& > *': {
        display: 'inline-block',
    },
    [theme.breakpoints.up('sm')]: {
        maxWidth: '80vw',
        display: 'flex',
        marginTop: '3%',
        overflowX: 'hidden',
        '& > *': {
            display: 'inline-block',
        },
    }
}));

export default function RecipeRow(recipeData) {
    const recipesData = recipeData.recipes;
    const scrollContainerRef = useRef(null);
    const theme = useTheme();
    const navigateTo = useNavigate();
    const isBiggerThanExtraSmall = useMediaQuery(theme.breakpoints.up('sm'));

    const scrollToRight = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const maxScrollLeft = scrollWidth - clientWidth;
            if (scrollLeft < maxScrollLeft) {
                scrollContainerRef.current.scrollBy({ left: 500, behavior: 'smooth' });
            }
        }
    };

    const scrollToLeft = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft } = scrollContainerRef.current;
            if (scrollLeft > 0) {
                scrollContainerRef.current.scrollBy({ left: -500, behavior: 'smooth' });
            }
        }
    };

    function searchRcipes() {
        navigateTo(`/search/${recipesData.type}`);
    }

    return (
        <Box sx={{ display: 'flex', marginTop: '2rem', marginBottom: '2rem', flexDirection: 'column', maxWidth: '90%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography
                    variant='h5'
                    sx={{ fontWeight: 'bolder', fontSize: { xs: '1.66rem', sm: '1.75rem' }, marginBottom: '0px', padding: '0px' }}
                >
                    {`${recipesData.type.charAt(0).toUpperCase() + recipesData.type.slice(1)} recipes`}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <ButtonBase onClick={searchRcipes} sx={{ borderRadius: '5px' }}>
                        <Typography
                            sx={{ marginRight: '5px', fontWeight: 'bold' }}
                        >
                            View more
                        </Typography>
                    </ButtonBase>
                    {isBiggerThanExtraSmall && <ButtonBase onClick={scrollToLeft}><ArrowCircleLeftIcon sx={{ fontSize: '1.48rem' }} /></ButtonBase>}
                    {isBiggerThanExtraSmall && <ButtonBase onClick={scrollToRight}><ArrowCircleRightIcon sx={{ fontSize: '1.5rem' }} /></ButtonBase>}
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '0px' }}>
                <ScrollContainer ref={scrollContainerRef}>
                    {recipesData.recipes.map(recipe => {
                        return <RecipeCard recipeData={recipe} key={recipe.id} />
                    })}
                </ScrollContainer>
            </Box>
        </Box>
    );
}
