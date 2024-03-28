import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Typography } from '@mui/material';


export default function PreperationList({ instructions }) {
    console.log(instructions);
    return (
        <Box sx={{ width: '100%' }}>
            <List>
                {instructions.map(instruction => {
                    return (
                        <ListItem disablePadding key={instruction.instruction}>
                            <ListItemText
                                primary={`Step ${instruction.number}`}
                                secondary={instruction.instruction}
                                primaryTypographyProps={{ sx: { fontSize: '1.5rem', fontWeight: 'bold' } }}
                                secondaryTypographyProps={{ sx: { fontSize: '1.4rem', color: '#414a4c' } }} 
                            />
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    );
}