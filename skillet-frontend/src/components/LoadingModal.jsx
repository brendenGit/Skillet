import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '100px',
    overflow: 'visible',
    marginTop: '0px',
    padding: '0px',
    textAlign: 'center'
};

const typographyStyle = {
    whiteSpace: 'nowrap',
    margin: '0px',
    padding: '0px',
    fontWeight: 'bold'
};

export default function LoadingModal() {
    return (
        <Box sx={style}>
            <Typography variant='h6' sx={typographyStyle}>
                Loading Delicious Recipes
            </Typography>
            <img src="/skillet_loading.gif" alt="Loading" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </Box>
    );
}
