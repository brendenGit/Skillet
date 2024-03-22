import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Recipe from './pages/Recipe';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const user = useSelector((state) => state.user);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/recipes/:recipeTitle" element={<Recipe />} />
      </Routes>
    </Router>
  );
}

export default App;
