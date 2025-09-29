import Home from './Pages/Home';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import ProductDetails from './Pages/ProductDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  )
}

export default App;