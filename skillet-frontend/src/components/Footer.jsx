import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Footer() {
  return (
    <BottomNavigation sx={{minHeight: '200px'}}>
      <BottomNavigationAction component={Link} to="/" label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction component={Link} to="/favorites" label="Favorites" icon={<FavoriteIcon />} />
      <BottomNavigationAction component={Link} to="/location" label="Location" icon={<LocationOnIcon />} />
    </BottomNavigation>
  );
}
