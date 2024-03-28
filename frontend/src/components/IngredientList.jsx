import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Fraction from 'fraction.js';

function decimalToFraction(decimal) {
    return new Fraction(decimal).toFraction(true);
}

export default function IngredientList({ ingredients }) {
    return (
        <Box sx={{ width: '100%', marginBottom: 3 }}>
            <List>
                {ingredients.map(ingreient => {
                    return (
                        <ListItem disablePadding key={ingreient.ingredientId}>
                                <ListItemText 
                                    primary={`${decimalToFraction(ingreient.amount)} ${ingreient.unit} ${ingreient.ingredientName}`}
                                    primaryTypographyProps={{ sx: { fontSize: '1.25rem', fontWeight: 'medium' } }}
                                />
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    );
}