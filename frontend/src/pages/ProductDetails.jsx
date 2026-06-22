import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-24 text-[#4A7C96] font-bold">Carregando...</div>;
  }

  if (notFound || !product) {
    return <div className="text-center py-24">Produto não encontrado.</div>;
  }

  const imageUrl = product.image_url || (product.image_data
    ? `data:${product.img_type};base64,${product.image_data}`
    : null);

  return (
    <div className="w-full px-6 md:px-12 lg:px-24 py-10 md:py-14 bg-[#F7E9D0]/30">
      <Link to="/catalogo" className="text-[#4A7C96] font-bold hover:underline mb-8 inline-block">
        ← Voltar ao catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl border border-[#F7E9D0] shadow-sm">
        <div className="aspect-square rounded-2xl overflow-hidden bg-[#F7E9D0]/20 border border-gray-100">
          <img src={imageUrl || ''} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{product.type}</span>
          <h2 className="text-3xl font-extrabold text-[#423E37] mb-2">{product.name}</h2>
          <p className="text-[#B15E4B] font-black text-2xl mb-6">
            R$ {Number(product.price).toFixed(2).replace('.', ',')}
          </p>

          <div className="mb-8">
            <h4 className="font-bold text-[#423E37] mb-2">Descrição:</h4>
            <p className="text-gray-600 italic">{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full h-14">
              <button 
                onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                className="w-12 h-full flex items-center justify-center text-[#423E37] font-bold hover:text-[#B15E4B] transition-colors"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-[#423E37]">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-12 h-full flex items-center justify-center text-[#423E37] font-bold hover:text-[#B15E4B] transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(product, quantity);
                setQuantity(1);
              }}
              className="flex-grow bg-[#4A7C96] hover:bg-[#B15E4B] text-white font-bold py-4 px-8 rounded-full transition-all uppercase text-sm tracking-widest shadow-md text-center"
            >
              Adicionar à Sacola
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}