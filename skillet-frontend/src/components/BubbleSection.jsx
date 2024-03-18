import { ButtonBase, Typography, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useRef, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';


const ScrollContainer = styled('div')(({ theme }) => ({
    maxWidth: '95vw',
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
        marginRight: '30px',
    }
}));

const ItemImg = styled('img')({
    maxWidth: '75px',
    height: 'auto%'
});

export default function BubbleSection() {
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
                <ButtonBase>
                    <SearchItemContainer>
                        <ItemImg src="/icons8-cherry-cheesecake-100.png" alt="icons 8 pcherry-cheesecake-100" />
                        <Typography
                            variant="p"
                            sx={{ fontSize: ".85rem", fontWeight: "bold" }}
                        >
                            Desserts
                        </Typography>
                    </SearchItemContainer>
                </ButtonBase>
                <ButtonBase>
                    <SearchItemContainer>
                        <ItemImg src="/icons8-hamburger-100.png" alt="icons 8 hamburger-100" />
                        <Typography
                            variant="p"
                            sx={{ fontSize: ".85rem", fontWeight: "bold" }}
                        >
                            Burgers
                        </Typography>
                    </SearchItemContainer>
                </ButtonBase>
                <ButtonBase>
                    <SearchItemContainer>
                        <ItemImg src="/icons8-natural-food-100.png" alt="icons 8 natrual-food-100" />
                        <Typography
                            variant="p"
                            sx={{ fontSize: ".85rem", fontWeight: "bold" }}
                        >
                            Vegetarian
                        </Typography>
                    </SearchItemContainer>
                </ButtonBase>
                <ButtonBase>
                    <SearchItemContainer>
                        <ItemImg src="/icons8-pizza-100.png" alt="icons 8 piza-100" />
                        <Typography
                            variant="p"
                            sx={{ fontSize: ".85rem", fontWeight: "bold" }}
                        >
                            Pizza
                        </Typography>
                    </SearchItemContainer>
                </ButtonBase>
                <ButtonBase>
                    <SearchItemContainer>
                        <ItemImg src="/icons8-rice-bowl-100.png" alt="icons 8 rice-bowl-100" />
                        <Typography
                            variant="p"
                            sx={{ fontSize: ".85rem", fontWeight: "bold" }}
                        >
                            Asian
                        </Typography>
                    </SearchItemContainer>
                </ButtonBase>
                <ButtonBase>
                    <SearchItemContainer>
                        <ItemImg src="/icons8-sandwich-100.png" alt="icons 8 sandwhich-100" />
                        <Typography
                            variant="p"
                            sx={{ fontSize: ".85rem", fontWeight: "bold" }}
                        >
                            Sandwhiches
                        </Typography>
                    </SearchItemContainer>
                </ButtonBase>
                <ButtonBase>
                    <SearchItemContainer>
                        <ItemImg src="/icons8-steak-100.png" alt="icons 8 steak-100" />
                        <Typography
                            variant="p"
                            sx={{ fontSize: ".85rem", fontWeight: "bold" }}
                        >
                            Steak
                        </Typography>
                    </SearchItemContainer>
                </ButtonBase>
                <ButtonBase>
                    <SearchItemContainer>
                        <ItemImg src="/icons8-sunny-side-up-eggs-100.png" alt="icons 8 sunny-side-up-eggs-100" />
                        <Typography
                            variant="p"
                            sx={{ fontSize: ".85rem", fontWeight: "bold" }}
                        >
                            Breakfast
                        </Typography>
                    </SearchItemContainer>
                </ButtonBase>
                <ButtonBase>
                    <SearchItemContainer>
                        <ItemImg src="/icons8-sushi-100.png" alt="icons 8 sushi-100" />
                        <Typography
                            variant="p"
                            sx={{ fontSize: ".85rem", fontWeight: "bold" }}
                        >
                            Japanese
                        </Typography>
                    </SearchItemContainer>
                </ButtonBase>
                <ButtonBase>
                    <SearchItemContainer>
                        <ItemImg src="/icons8-taco-100.png" alt="icons 8 taco-100" />
                        <Typography
                            variant="p"
                            sx={{ fontSize: ".85rem", fontWeight: "bold" }}
                        >
                            Mexican
                        </Typography>
                    </SearchItemContainer>
                </ButtonBase>
            </ScrollContainer>
            {showScrollRight && isBiggerThanExtraSmall && <ButtonBase onClick={scrollToRight}><ArrowCircleRightIcon sx={{ fontSize: '2rem' }} /></ButtonBase>}
        </Box>
    );
}