import * as React from 'react';
import Box from '@mui/material/Box';


export default function Seperator() {
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100vw',
                height: '5px',
                backgroundColor: '#ccc'
            }}
        />
    );
}
