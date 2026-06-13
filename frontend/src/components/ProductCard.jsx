import { useParams, Link } from 'react-router-dom';
import { CartIcon } from './Icons';

export function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#F7E9D0] hover:shadow-md hover:border-[#E8B864] transition-all group flex flex-col h-full">
      <Link to={`/produto/${product.id}`} className="cursor-pointer block flex-grow">
      <div className="aspect-square bg-[#F7E9D0]/30 rounded-xl overflow-hidden mb-4 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-[#4A7C96]/0 group-hover:bg-[#4A7C96]/5 transition-colors duration-300" />
      </div>

      <h4 className="font-bold text-lg text-[#B15E4B] mb-1 leading-tight">
        {product.name}
      </h4>
      <span className="text-xl text-[#B15E4B]">
          {product.price}
      </span>
      </Link>

      <div className="flex justify-between items-center mt-auto pt-2">
        <button
          onClick={() => onAddToCart(product)}
          title="Adicionar ao carrinho"
          className="bg-[#4A7C96] text-[#F7E9D0] p-2 rounded-full hover:bg-[#B15E4B] transition-all flex items-center justify-center w-10 h-10 shadow-sm active:scale-90"
        >
          <CartIcon />
        </button>
      </div>
    </div>
  );
}