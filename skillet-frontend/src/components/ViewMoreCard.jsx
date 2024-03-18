import * as React from 'react';
import { Button, Box } from '@mui/material';

export default function ViewMoreCard({ type }) {
    return (
        <Box sx={{ minWidth: '150px', display: 'flex', marginBottom: '20px' }} elevation={0}>
            <Button variant="outlined" size="large">
                View More
            </Button>
        </Box >

    );
}
