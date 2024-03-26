import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SkilletApi from '../utils/SkilletApi.cjs';
import { updateUserOnLogin, setIsFetching, setJustLoggedIn } from '../features/user/userSlice';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useState } from "react";
import { useDispatch } from 'react-redux';


export default function LoginForm() {
    const [errorMessage, setErrorMessage] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const skilletApi = new SkilletApi();
        try {
            setErrorMessage('');
            dispatch(setIsFetching(true));
            const { token, username, id, isAdmin } = await skilletApi.login({
                username: data.get('username'),
                password: data.get('password'),
            });

            const savedRecipes = await skilletApi.getSaved(username);
            const ratedRecipes = await skilletApi.getRated(username);

            dispatch(updateUserOnLogin({
                token,
                username,
                id,
                isAdmin,
                ratedRecipes: [...savedRecipes.savedRecipes],
                savedRecipes: [...ratedRecipes.ratedRecipes],
            }))
            dispatch(setIsFetching(false));
            dispatch(setJustLoggedIn(true));
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
                    <LockOutlinedIcon sx={{ color: 'black' }} />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
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
                                bgcolor: '#FDFD96',
                                color: 'black'
                            }
                        }}
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}