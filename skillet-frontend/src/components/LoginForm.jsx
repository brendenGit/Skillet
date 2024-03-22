import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SkilletApi from '../utils/SkilletApi.cjs';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useState } from "react";
import { useDispatch } from 'react-redux';


export default function LoginForm({ user }) {
    // component prep
    const [errorMessage, setErrorMessage] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // if logged in redirect to home page - do not allow LoginForm to be viewed 
    //   if (user.firstName) {
    //     return <Navigate to="/" replace={true} />;
    //   }

    // handle submit - login request
    async function handleSubmit(event) {
        event.preventDefault();
        console.log('test')
        const data = new FormData(event.currentTarget);
        try {
          setErrorMessage('');
          dispatch(setIsFetching(true));
          const { token, user } = await joblyApi.login({
            username: data.get('username'),
            password: data.get('password'),
          });

          dispatch(setUserDataOnLogin({
            token,
            user,
          }))
          dispatch(setIsFetching(false));
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
                                bgcolor: '#FDFD96', // Set the same background color on hover
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