import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [finished, setFinished] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  // Helper para calculo matematico sobre as strings (ex: "R$ 45,00")
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
    // Como pedimos um frontend-only, fechamos a compra e desvaziamos o carrinho localmente.
    clearCart();
    setFinished(true);
    setShowAuthWarning(false);
  };

  if (finished) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 w-full flex-grow text-center">
        <div className="bg-green-50 border border-green-200 rounded-3xl p-10">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-extrabold text-green-900 mb-4">Compra Confirmada!</h2>
          <p className="text-green-800 text-xl mb-8">
            Tudo certo! As roupinhas incríveis serão enviadas para as mãos de <strong>{user?.name}</strong>.
          </p>
          <Link 
            to="/Catalogo"
            className="font-bold border-2 border-green-600 text-green-700 px-10 py-4 rounded-full hover:bg-green-600 hover:text-white transition-colors inline-block text-lg shadow-sm"
          >
            Voltar ao Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16 flex-grow">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-10 flex items-center gap-3">
        Sua Sacola <span>🛍️</span>
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <p className="text-gray-500 text-xl mb-6">Sua sacola está vazia...</p>
          <Link 
            to="/Catalogo"
            className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-full hover:bg-indigo-700 transition shadow"
          >
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-5 flex gap-6 items-center shadow-sm relative transition-shadow hover:shadow-md">
                <div className="w-28 h-28 shrink-0 relative rounded-2xl overflow-hidden bg-gray-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow pr-10">
                  <h4 className="font-bold text-gray-900 text-xl leading-tight mb-2">{item.name}</h4>
                  <p className="text-indigo-600 font-bold text-lg mb-3">{item.price}</p>
                  <span className="text-sm text-gray-600 font-semibold bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                    Qtd: {item.quantity}
                  </span>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  title="Remover Item"
                  className="w-12 h-12 flex items-center justify-center text-red-400 bg-red-50 hover:bg-red-500 hover:text-white rounded-full transition-colors absolute top-5 right-5"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-8 sticky top-24 shadow-sm">
              <h3 className="font-bold text-2xl text-gray-900 mb-6 pb-6 border-b border-indigo-100/50">Resumo da Compra</h3>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-600 font-medium text-lg">Subtotal</span>
                <span className="font-bold text-3xl text-indigo-700">{formattedSubtotal}</span>
              </div>

              {showAuthWarning && (
                <div className="bg-amber-100 text-amber-800 p-5 rounded-2xl border border-amber-200 mb-6">
                  <strong className="block text-base mb-1">⚠️ Quase lá!</strong>
                  <p className="text-sm mb-4">Identificamos que seu destino não está preenchido no sistema.</p>
                  <Link to="/login" className="block text-center bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition shadow-sm text-base">
                    Ir para Meu Perfil
                  </Link>
                </div>
              )}

              <button 
                onClick={handleCheckout}
                className="w-full bg-indigo-600 text-white font-extrabold text-xl py-5 rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Finalizar Compra
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
