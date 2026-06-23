import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartProductCard from '../components/CartProductCard';
import { QRCodeSVG } from 'qrcode.react';

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { user } = useAuth();

  const [finished, setFinished] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  
  // 1. Novo estado para sabermos se o frete ainda está sendo calculado
  const [loadingShipping, setLoadingShipping] = useState(false);

  const [orderTotals, setOrderTotals] = useState({
    itemsSubtotal: 0,
    shippingFee: 0,
    finalTotal: 0
  });

  const parsePrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal;
    if (!priceVal) return 0;
    const cleanStr = String(priceVal).replace('R$', '').trim().replace(',', '.');
    return parseFloat(cleanStr) || 0;
  };

  const calcTransferFee = async () => {
    if (!user || !user.city) {
      return { success: false, error: "Usuário não logado ou sem cidade definida." };
    }

    const originCity = "São Carlos, SP";
    const destinationCity = user.city;
    const pricePerKm = 0.40;

    try {
      const responseOrigin = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(originCity)}&format=json`,
        { headers: { 'User-Agent': 'MeuAppFrete/1.0' } }
      );
      const dataOrigin = await responseOrigin.json();

      const responseDest = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destinationCity)}&format=json`,
        { headers: { 'User-Agent': 'MeuAppFrete/1.0' } }
      );
      const dataDest = await responseDest.json();

      if (dataOrigin.length === 0 || dataDest.length === 0) {
        throw new Error('Não foi possível localizar a cidade de origem ou destino.');
      }

      const lat1 = dataOrigin[0].lat;
      const lon1 = dataOrigin[0].lon;
      const lat2 = dataDest[0].lat;
      const lon2 = dataDest[0].lon;

      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
      
      const responseRoute = await fetch(osrmUrl);
      const routeData = await responseRoute.json();

      if (!routeData.routes || routeData.routes.length === 0) {
        throw new Error('Não foi possível calcular a rota rodoviária entre as cidades.');
      }

      const distanceInMeters = routeData.routes[0].distance;
      const distanceInKm = distanceInMeters / 1000;
      const totalFee = distanceInKm * pricePerKm;

      return {
        success: true,
        fee: Number(totalFee.toFixed(2))
      };

    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      return { success: false, error: error.message };
    }
  }

  const calculateOrderTotal = async () => {
    try {
      const itemsSubtotal = cart.reduce((sum, item) => {
        return sum + (parsePrice(item.price) * item.quantity);
      }, 0);
      
      const transferData = await calcTransferFee();

      if (transferData && transferData.success) {
        const finalTotal = itemsSubtotal + transferData.fee;
        return {
          itemsSubtotal,
          shippingFee: transferData.fee,
          finalTotal
        };
      } else {
        return {
          itemsSubtotal,
          shippingFee: 0,
          finalTotal: itemsSubtotal
        };
      }

    } catch (error) {
      console.error("Erro ao calcular o total do pedido:", error);
    }
  };

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

  useEffect(() => {
    const updateTotals = async () => {
      setLoadingShipping(true); // Ativa o loading antes da requisição
      const totals = await calculateOrderTotal();
      
      if (totals) {
        setOrderTotals({
          itemsSubtotal: totals.itemsSubtotal,
          shippingFee: totals.shippingFee,
          finalTotal: totals.finalTotal
        });
      }
      setLoadingShipping(false);
    };

    updateTotals();
  }, [cart, user?.City]);

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
                onUpdateQuantity={updateQuantity} 
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E8B864]/40 rounded-3xl p-8 sticky top-24 shadow-xl">
              <h3 className="font-bold text-xs uppercase text-[#4A7C96] mb-6 pb-4 border-b border-gray-100">
                Resumo da Compra
              </h3>

              <div className="space-y-4 mb-8 text-sm text-[#423E37]">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal dos itens:</span>
                  <span className="font-bold">R$ {orderTotals.itemsSubtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Frete:</span>
                  <span className="font-bold">
                    {!user || !user.city 
                      ? 'Faça login para calcular' 
                      : loadingShipping 
                        ? 'Calculando...' 
                        : `R$ ${orderTotals.shippingFee.toFixed(2)}`
                    }
                  </span>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="font-bold uppercase text-xs">Total Geral</span>
                  <span className="font-black text-3xl text-[#B15E4B] leading-none">
                    R$ {orderTotals.finalTotal.toFixed(2)}
                  </span>
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