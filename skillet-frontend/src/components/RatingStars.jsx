import * as React from 'react';
import Box from '@mui/material/Box';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { Typography } from '@mui/material';


export default function RatingStars({ rating }) {
    const ratingStars = [];
    for (let i = 1; i <= 5; i++) {
        i <= rating ? ratingStars.push(<StarIcon sx={{ fontSize: '1rem' }} key={i} />) : ratingStars.push(<StarBorderIcon sx={{ fontSize: '1rem' }} key={i} />);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            {ratingStars}
            <Box sx={{ marginLeft: '5%' }}>
                <Typography variant='h7'>
                    {rating}
                </Typography>
            </Box>
        </Box >
    );
}