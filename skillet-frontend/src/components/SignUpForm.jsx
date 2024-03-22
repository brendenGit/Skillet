import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SkilletApi from '../utils/SkilletApi.cjs';
import { updateUserOnLogin, setIsFetching } from '../features/user/userSlice';
import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useDispatch } from 'react-redux';


export default function SignUpForm({ handleClose }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // if logged in redirect to home page - do not allow SignUpForm to be viewed 
    //   if (user.firstName) {
    //     return <Navigate to="/" replace={true} />;
    //   }

    // handle submit - registration attempt - redirect and sign in if successful
    async function handleSubmit(event) {
        event.preventDefault();
        console.log('testing sign up');
        const data = new FormData(event.currentTarget);
        const skilletApi = new SkilletApi();
        try {
            setErrorMessage('');
            dispatch(setIsFetching(true));
            const { token, username, id, isAdmin } = await skilletApi.register({
                username: data.get('username'),
                password: data.get('password'),
                firstName: data.get('firstName'),
                lastName: data.get('lastName'),
                email: data.get('email'),
            });
            dispatch(updateUserOnLogin({
                token,
                username,
                id,
                isAdmin,
                ratedRecipes: [],
                savedRecipes: [],
            }))
            dispatch(setIsFetching(false));
            handleClose(); // close modal
            navigate("/");

        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    return (
        <Container>
            < CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography
                    variant="h4"
                    component="a"
                    noWrap
                    href='/'
                    fontWeight="bolder"
                    sx={{ color: '#ff4242', letterSpacing: '-2px', textDecoration: 'none' }}
                >
                    Skillet
                </Typography>
                <Avatar sx={{ m: 1, bgcolor: '#FDFD96', border: 'solid black 1px' }}>
                    <AccountCircleIcon sx={{ color: 'black' }} />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create an account!
                </Typography>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        autoComplete="firstName"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="lastName"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Email"
                        type="email"
                        id="email"
                        autoComplete="current-email"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            bgcolor: '#FDFD96',
                            color: 'black',
                            '&:hover': {
                                bgcolor: '#FDFD96', // Set the same background color on hover
                                color: 'black'
                            }
                        }}
                    >
                        Create your account
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
