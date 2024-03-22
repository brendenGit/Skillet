import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import SignUpForm from './SignUpForm';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90vw', sm: 400 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function LoginRequiredModal({ open, handleClose }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <SignUpForm />
            </Box>
        </Modal>
    );
}
