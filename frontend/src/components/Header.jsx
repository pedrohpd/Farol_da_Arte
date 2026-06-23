import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { UserIcon, CartIcon } from '../components/Icons'
import Logo from '../assets/logo.png';

export default function Header() {
  const { user } = useAuth();
  const { cart } = useCart();

  const getInitials = (name) => {
    if (!name) return null;
    const splitName = name.trim().split(' ');
    if (splitName.length === 1) return splitName[0].substring(0, 1).toUpperCase();
    const firstInitial = splitName[0].substring(0, 1).toUpperCase();
    const lastInitial = splitName[splitName.length - 1].substring(0, 1).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const totalCartItems = cart.length;

  return (
    <header className="bg-[#4A7C96] border-b border-[#E8B864] sticky top-0 z-50" id="inicio">
      <div className="w-full mx-auto px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={Logo} className="w-10 h-10" alt="Logo" />
          <h1 className="text-2xl font-bold text-[#F7E9D0] tracking-tighter">
            Farol das Artes
          </h1>
        </Link>

        <div className="flex items-center gap-6 md:gap-10">

          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link to="/catalogo" className="text-[#F7E9D0] hover:text-[#E8B864] transition-colors">
              Catálogo
            </Link>
            <Link to="/encomendas" className="text-[#F7E9D0] hover:text-[#E8B864] transition-colors">
              Encomendas
            </Link>
            {user && user.is_admin && (
              <Link to="/admin" className="text-[#F7E9D0] font-bold hover:text-[#E8B864] transition-colors">
                Painel Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/carrinho" className="p-2 text-[#F7E9D0] hover:bg-white/10 rounded-full relative flex items-center justify-center transition-colors">
              <CartIcon />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B15E4B] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-[#4A7C96]">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                to="/perfil"
                className="ml-2 w-9 h-9 flex items-center justify-center bg-[#F7E9D0] text-[#4A7C96] font-bold rounded-full hover:bg-[#E8B864] transition-colors"
              >
                {getInitials(user.name)}
              </Link>
            ) : (
              <Link to="/login" className="p-2 text-[#F7E9D0] hover:bg-white/10 rounded-full transition-colors">
                <UserIcon />
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}