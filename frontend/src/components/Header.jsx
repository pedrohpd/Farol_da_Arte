import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { user } = useAuth();
  const { cart } = useCart();
  
  const getInitials = (name) => {
    if (!name) return '👤';
    const splitName = name.trim().split(' ');
    if (splitName.length === 1) return splitName[0].substring(0, 1).toUpperCase();
    const firstInitial = splitName[0].substring(0, 1).toUpperCase();
    const lastInitial = splitName[splitName.length - 1].substring(0, 1).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50" id="inicio">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-500 tracking-tighter">Farol da Arte</h1>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-indigo-500">Início</Link>
          <Link to="/Catalogo" className="hover:text-indigo-500">Catálogo</Link>
          <Link to="/encomendas" className="hover:text-indigo-500">Encomendas</Link>
        </nav>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">🔍</button>
          
          <Link to="/carrinho" className="p-2 hover:bg-gray-100 rounded-full relative flex items-center justify-center transition-colors">
            🛒
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-xs border-2 border-white">
                {totalCartItems}
              </span>
            )}
          </Link>

          {user ? (
            <Link 
              to="/perfil"
              title="Meu Perfil" 
              className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold rounded-full hover:bg-indigo-200 transition-colors"
            >
              {getInitials(user.name)}
            </Link>
          ) : (
            <Link to="/login" className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors w-10 h-10">
              👤
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}