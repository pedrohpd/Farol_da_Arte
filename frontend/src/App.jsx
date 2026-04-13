import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Cart from './pages/Cart';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <Header />
      
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Catalogo" element={<Catalog />} />
          <Route path="/encomendas" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/carrinho" element={<Cart />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}