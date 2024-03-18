import { ButtonBase, Typography, Box, CardActionArea } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useRef, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ViewMoreCard from './ViewMoreCard';
import RecipeCard from './RecipeCard';


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

const SearchItemContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '30px',
    [theme.breakpoints.up('sm')]: {
        marginRight: '40px',
    }
}));


export default function RecipeRow(recipeData) {
    const recipesData = recipeData.recipes;
    const scrollContainerRef = useRef(null);
    const theme = useTheme();
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

    return (
        <Box sx={{ display: 'flex', marginTop: '3%', flexDirection: 'column', maxWidth: '90%' }}>
            <Typography
                variant='h5'
                sx={{ fontWeight: 'bolder', fontSize: '1.75rem', marginBottom: '0px', padding: '0px' }}
            >
                {`${recipesData.type.charAt(0).toUpperCase() + recipesData.type.slice(1)} recipes`}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '0px' }}>
                {isBiggerThanExtraSmall && <ButtonBase onClick={scrollToLeft}><ArrowCircleLeftIcon sx={{ fontSize: '2rem', marginRight: '20px' }} /></ButtonBase>}
                <ScrollContainer ref={scrollContainerRef}>
                    {recipesData.recipes.map(recipe => {
                        return <RecipeCard recipeData={recipe} key={recipe.id} />
                    })}
                    <ViewMoreCard type={recipesData.type} />
                </ScrollContainer>
                {isBiggerThanExtraSmall && <ButtonBase onClick={scrollToRight}><ArrowCircleRightIcon sx={{ fontSize: '2rem', marginLeft: '20px' }} /></ButtonBase>}
            </Box>
        </Box>
    );
}
