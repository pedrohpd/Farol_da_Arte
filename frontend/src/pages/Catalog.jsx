import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from '../components/ProductCard';
import { products } from '../mock_data/products';

export default function Catalog() {
  const { addToCart } = useCart();
  
  const [selectedType, setSelectedType] = useState("Todos");

  const categories = ["Todos", ...new Set(products.map(product => product.type))];

  const filteredProducts = selectedType === "Todos"
    ? products
    : products.filter(product => product.type === selectedType);

  return (
    <div className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-[#F7E9D0]/50 min-h-screen">
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold mb-2 text-[#B15E4B]">
            Nosso Catálogo
          </h2>
          <p className="text-[#4A7C96] text-lg font-medium">
            Deixe suas bonecas ainda mais lindas com nossas peças exclusivas.
          </p>
          <div className="h-1 w-20 bg-[#E8B864] mt-4 mx-auto md:mx-0 rounded-full" />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm transition-all border
                ${selectedType === type
                  ? 'bg-[#B15E4B] text-white border-[#B15E4B]' 
                  : 'bg-white text-[#423E37] border-gray-200 hover:border-[#E8B864]/60 hover:bg-[#F7E9D0]/20'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={addToCart} 
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-400 mt-12 italic">Nenhum produto encontrado nessa categoria.</p>
      )}
    </div>
  );
}