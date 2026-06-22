import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartIcon } from './Icons';

export function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = (e) => {
    e.preventDefault();
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    setQuantity(q => q + 1);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    onAddToCart(product, quantity);
    setQuantity(1); // reset after adding
  };
  const imageUrl = product.image_url || (product.image_data
    ? `data:${product.img_type};base64,${product.image_data}`
    : null);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#F7E9D0] hover:shadow-md hover:border-[#E8B864] transition-all group flex flex-col h-full">
      <Link to={`/produto/${product.code}`} className="cursor-pointer block flex-grow">
        <div className="aspect-square bg-[#F7E9D0]/30 rounded-xl overflow-hidden mb-4 relative">
          <img
            src={imageUrl || ''}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-[#4A7C96]/0 group-hover:bg-[#4A7C96]/5 transition-colors duration-300" />
        </div>

        <h4 className="font-bold text-lg text-[#B15E4B] mb-1 leading-tight">
          {product.name}
        </h4>
        <span className="text-xl text-[#B15E4B]">
          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </Link>

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center bg-gray-50 text-[#423E37] border border-gray-200 rounded-lg font-bold transition-all hover:bg-[#B15E4B]/10 hover:text-[#B15E4B] hover:border-[#B15E4B]/30"
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-bold text-[#423E37]">
            {quantity}
          </span>
          <button 
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center bg-gray-50 text-[#423E37] border border-gray-200 rounded-lg font-bold transition-all hover:bg-[#B15E4B]/10 hover:text-[#B15E4B] hover:border-[#B15E4B]/30"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          title="Adicionar ao carrinho"
          className="bg-[#4A7C96] text-[#F7E9D0] p-2 rounded-xl hover:bg-[#B15E4B] transition-all flex items-center justify-center w-12 h-10 shadow-sm active:scale-95 group/btn"
        >
          <CartIcon className="group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}