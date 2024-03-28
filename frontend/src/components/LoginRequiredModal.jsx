import SignUpForm from './SignUpForm';
import { Modal, Box } from '@mui/material';


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
