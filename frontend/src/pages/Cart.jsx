import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartProductCard from '../components/CartProductCard'; // Importação aqui

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  
  const [finished, setFinished] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace('R$', '').trim().replace(',', '.');
    return parseFloat(cleanStr) || 0;
  };

  const subtotal = cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);
  const formattedSubtotal = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

  const handleCheckout = () => {
    if (!user) {
      setShowAuthWarning(true);
      return;
    }
    clearCart();
    setFinished(true);
    setShowAuthWarning(false);
  };

  if (finished) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 w-full flex-grow text-center bg-[#F7E9D0]/30 min-h-screen">
        <div className="bg-white border-2 border-[#E8B864] rounded-3xl p-10 shadow-xl">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-extrabold text-[#B15E4B] mb-4 uppercase tracking-tighter">Compra Confirmada!</h2>
          <p className="text-gray-600 text-xl mb-8 italic">
            "As roupinhas mágicas já estão sendo preparadas para <strong>{user?.name}</strong>."
          </p>
          <Link 
            to="/catalogo"
            className="font-bold bg-[#B15E4B] text-white px-10 py-4 rounded-full hover:bg-[#4A7C96] transition-all inline-block text-sm uppercase tracking-widest shadow-lg"
          >
            Voltar ao Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 md:px-12 lg:px-24 py-12 md:py-16 flex-grow bg-[#F7E9D0]/30 min-h-screen">
      <div className="flex items-center justify-between mb-10 border-b border-[#E8B864]/30 pb-6">
        <h2 className="text-4xl text-[#B15E4B] font-extrabold uppercase tracking-tight">
          Seu Carrinho
        </h2>
        <span className="text-[#4A7C96] font-bold bg-white px-4 py-2 rounded-full border border-[#4A7C96]/20 shadow-sm">
          {cart.length} {cart.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-[#F7E9D0] shadow-sm">
          <p className="text-gray-400 text-xl mb-8 italic">Seu carrinho está vazio...</p>
          <Link 
            to="/catalogo"
            className="bg-[#4A7C96] text-white font-bold px-10 py-4 rounded-full hover:bg-[#B15E4B] transition-all shadow-lg uppercase text-sm tracking-widest"
          >
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <CartProductCard 
                key={item.id} 
                item={item} 
                onRemove={removeFromCart} 
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E8B864]/40 rounded-3xl p-8 sticky top-24 shadow-xl">
              <h3 className="font-bold text-xs uppercase text-[#4A7C96] mb-6 pb-4 border-b border-gray-100">
                Resumo da Compra
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="text-[#423E37] font-bold uppercase text-xs">Total</span>
                  <span className="font-black text-3xl text-[#B15E4B] leading-none">{formattedSubtotal}</span>
                </div>
              </div>

              {showAuthWarning && (
                <div className="bg-[#B15E4B]/5 text-[#B15E4B] p-5 rounded-2xl border border-[#B15E4B]/20 mb-6">
                  <strong className="block text-xs uppercase tracking-widest mb-2">Atenção</strong>
                  <p className="text-xs mb-4">Para finalizar, precisamos saber para onde enviar suas peças.</p>
                  <Link to="/login" className="block text-center bg-[#B15E4B] text-white font-bold py-3 rounded-full hover:bg-[#4A7C96] transition shadow-md text-xs uppercase tracking-tighter">
                    Completar Meu Perfil
                  </Link>
                </div>
              )}

              <button 
                onClick={handleCheckout}
                className="w-full bg-[#4A7C96] text-white font-bold text-sm uppercase tracking-[0.2em] py-5 rounded-full shadow-lg hover:bg-[#B15E4B] transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                Finalizar Compra
              </button>
              <button 
                onClick={clearCart}
                className="w-full mt-4 bg-transparent text-[#B15E4B] border-2 border-[#B15E4B] font-bold text-sm uppercase tracking-[0.1em] py-4 rounded-full hover:bg-[#B15E4B] hover:text-white transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                Limpar Carrinho
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}