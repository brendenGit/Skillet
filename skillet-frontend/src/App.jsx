import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Recipe from './pages/Recipe';
import SavedRecipes from './pages/SavedRecipes';
import GroceryLists from './pages/GroceryLists';
import { useSelector } from 'react-redux';


function App() {
  const user = useSelector((state) => state.user);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/recipes/:recipeTitle" element={<Recipe />} />
        <Route path="/saved-recipes" element={<SavedRecipes />} />
        <Route path="/grocery-lists" element={<GroceryLists />} />
      </Routes>
    </Router>
  );
}

export default App;
