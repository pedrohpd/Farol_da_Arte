import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartProductCard from '../components/CartProductCard';
import { QRCodeSVG } from 'qrcode.react';

export default function Cart() {
  // 1. Adicione o "updateQuantity" vindo do useCart
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { user } = useAuth();

  const [finished, setFinished] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const parsePrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal;
    if (!priceVal) return 0;
    const cleanStr = String(priceVal).replace('R$', '').trim().replace(',', '.');
    return parseFloat(cleanStr) || 0;
  };

  const subtotal = cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);
  const formattedSubtotal = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

  const handleCheckout = async () => {
    if (!user) {
      setShowAuthWarning(true);
      return;
    }

    try {
      const itemsPayload = cart.map(item => ({
        product_code: item.code || item.id,
        quantity: item.quantity
      }));

      // In a real scenario we use api.post
      const { default: api } = await import('../services/api');
      const response = await api.post('/orders', { items: itemsPayload });

      clearCart();
      setPaymentData(response.data);
      setFinished(true);
      setShowAuthWarning(false);
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      alert("Houve um erro ao processar seu pedido. Tente novamente.");
    }
  };

  if (finished && paymentData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 w-full flex-grow text-center bg-[#F7E9D0]/30 min-h-screen">
        <div className="bg-white border-2 border-[#E8B864] rounded-3xl p-10 shadow-xl max-w-lg mx-auto">
          <h2 className="text-4xl font-extrabold text-[#B15E4B] mb-4 uppercase tracking-tighter">Pedido Realizado!</h2>
          <p className="text-gray-600 text-sm mb-8 font-medium">Seu pedido foi registrado. Faça o pagamento via PIX para aprová-lo.</p>
          
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-8 flex flex-col items-center">
            <h3 className="font-bold text-[#4A7C96] uppercase text-xs tracking-widest mb-4 w-full text-left">Pague com o QR Code</h3>
            
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-6 w-fit mx-auto">
              <QRCodeSVG value={paymentData.pix_qrcode} size={180} level="M" />
            </div>

            <h3 className="font-bold text-[#4A7C96] uppercase text-xs tracking-widest mb-2 w-full text-left">Ou PIX Copia e Cola</h3>
            <div className="bg-white border border-gray-300 p-4 rounded-xl break-all font-mono text-xs text-left mb-4 shadow-inner text-gray-600 w-full">
              {paymentData.pix_qrcode}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(paymentData.pix_qrcode);
                alert("Código PIX copiado para a área de transferência!");
              }}
              className="w-full bg-[#4A7C96] text-white font-bold px-6 py-3 rounded-full hover:bg-[#B15E4B] transition-all text-xs uppercase tracking-widest shadow-md"
            >
              Copiar Código
            </button>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-4">Expira em 30 minutos</p>
          </div>

          <Link
            to="/perfil"
            className="font-bold text-gray-500 underline text-sm hover:text-[#B15E4B] transition-all"
          >
            Acompanhar Meus Pedidos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 md:px-12 lg:px-24 py-12 md:py-16 flex-grow bg-[#F7E9D0]/30 min-h-screen">
      <div className="flex items-center justify-between mb-10 border-b border-[#E8B864]/30 pb-6">
        <h2 className="text-4xl text-[#B15E4B] font-extrabold uppercase tracking-tight">Seu Carrinho</h2>
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
                key={item.code || item.id}
                item={item}
                onRemove={removeFromCart}
                // 2. Passe a função do contexto para o componente filho aqui:
                onUpdateQuantity={updateQuantity} 
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