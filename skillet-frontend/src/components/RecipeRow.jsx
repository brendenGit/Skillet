import { ButtonBase, Typography, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useRef, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import RecipeCard from './RecipeCard';


const ScrollContainer = styled('div')(({ theme }) => ({
    maxWidth: '95vw',
    overflowX: 'auto',
    marginTop: '3%',
    whiteSpace: 'nowrap',
    '-webkit-overflow-scrolling': 'touch',
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


export default function RecipeRow({ recipes }) {
    const scrollContainerRef = useRef(null);
    const [showScrollLeft, setShowScrollLeft] = useState(false);
    const [showScrollRight, setShowScrollReft] = useState(true);
    const theme = useTheme();
    const isBiggerThanExtraSmall = useMediaQuery(theme.breakpoints.up('sm'));


    const scrollToRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 500, behavior: 'smooth' });
        }
        setShowScrollReft(false);
        setShowScrollLeft(true);
    };

    const scrollToLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -500, behavior: 'smooth' });
        }
        setShowScrollReft(true);
        setShowScrollLeft(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            {showScrollLeft && isBiggerThanExtraSmall && <ButtonBase onClick={scrollToLeft}><ArrowCircleLeftIcon sx={{ fontSize: '2rem' }} /></ButtonBase>}
            <ScrollContainer ref={scrollContainerRef}>
                {recipes.map(recipe => {
                    <RecipeCard recipeData={recipe} key={recipe.id} />
                })}
            </ScrollContainer>
            {showScrollRight && isBiggerThanExtraSmall && <ButtonBase onClick={scrollToRight}><ArrowCircleRightIcon sx={{ fontSize: '2rem' }} /></ButtonBase>}
        </Box>
    );
}