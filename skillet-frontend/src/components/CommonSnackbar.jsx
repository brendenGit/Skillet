import Snackbar from '@mui/material/Snackbar';


export default function CommonSnackbar({ open, message, onClose, autoHideDuration }) {
    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={autoHideDuration}
                onClose={onClose}
                message={message}
            />
        </div>
    );
}