import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Footer from './components/Footer';
import Recipe from './pages/Recipe';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/recipes/:recipeTitle" element={<Recipe />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
