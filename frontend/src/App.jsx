import Home from './Pages/Home';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import ProductDetails from './Pages/ProductDetails';
import Products from './Pages/Products';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path='/products' element={<Products />} />
      </Routes>
    </Router>
  )
}

export default App;