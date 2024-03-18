import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function Tags({ recipeData }) {
    return (
        <Stack direction="row" spacing={1} sx={{ marginTop: '1rem' }}>
            {recipeData.vegan && <Chip label="Vegan" size="small" color="success" variant='outlined' />}
            {recipeData.vegetarian && <Chip label="Vegetarian" size="small" color="success" variant='outlined' />}
            {recipeData.dairyFree && <Chip label="Dairy Free" size="small" color="success" variant='outlined' />}
            {recipeData.glutenFree && <Chip label="Gluten Free" size="small" color="success" variant='outlined' />}
        </Stack>
    );
}