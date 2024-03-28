import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import CommonSnackbar from './CommonSnackbar';
import Avatar from '@mui/material/Avatar';
import { updateUserOnLogout, setJustLoggedIn } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { styled } from '@mui/material/styles';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    width: '40%',
    border: '1px solid black'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    width: '100%',
    color: 'black',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: '100%',
    },
}));

export default function Navbar() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const user = useSelector(state => state.user);

    const navigateTo = useNavigate();
    const dispatch = useDispatch();

    if (user.justLoggedIn) {
        setSnackbarMessage(`Welcome back ${user.username}`);
        setSnackbarOpen(true);
        dispatch(setJustLoggedIn(false));
    }

    const handleLogout = () => {
        dispatch(updateUserOnLogout());
        setSnackbarMessage(`You have successfully logged out.`);
        navigateTo('/');
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const pages = {
        noUser: [
            { key: 'loginModal', component: <LoginModal /> },
            { key: 'signUpModal', component: <SignUpModal /> }
        ],
        loggedIn: [
            { key: 'savedRecipes', label: 'Saved Recipes', path: '/saved-recipes' },
            { key: 'logout', label: 'Log Out', onClick: handleLogout }
        ]
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const linkStyle = {
        textDecoration: 'none',
        color: 'inherit', // Optional: to inherit text color from parent
    };

    let renderPages = user.username ? pages.loggedIn : pages.noUser;
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {renderPages.map((item) => (
                <MenuItem key={item.key} onClick={handleMenuClose}>
                    {item.component || <Link to={item.path} onClick={item.onClick} style={linkStyle}>{item.label}</Link>}
                </MenuItem>
            ))}
        </Menu>
    );

    return (
        <AppBar position="static" elevation={0} sx={{ background: 'white' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: { xs: 'space-between', sm: 'center' } }}>
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
                <Search sx={{ marginLeft: { sm: '100px' }, marginRight: { sm: '100px' } }}>
                    <SearchIconWrapper>
                        <SearchIcon sx={{ color: 'black' }} />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                navigateTo(`/search/${e.target.value}`);
                            }
                        }}
                    />
                </Search>
                <Box>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        {!user.username && <AccountCircle sx={{ color: 'black', fontSize: '2rem' }} />}
                        {user.username && <Avatar alt="avatar">{user.username[0]}</Avatar>
                        }
                    </IconButton>
                </Box>
            </Toolbar>
            {renderMenu}
            <CommonSnackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                message={snackbarMessage}
                onClose={handleSnackbarClose}
            />
        </AppBar>
    );
}