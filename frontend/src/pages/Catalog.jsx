import { useCart } from '../contexts/CartContext';
import { ProductCard } from '../components/ProductCard';
import Roupao from "../assets/roupao_rosa_babyalive.png";
import Vestido from "../assets/vestido_estrelado_barbie.png";

export default function Catalog() {
  const { addToCart } = useCart();
  
  const products = [
    {
      id: 1,
      name: "Roupão Rosa Baby-Alive",
      description: "Não sei o tipo de tecido",
      price: "R$ 30,00",
      image: Roupao,
    },
    {
      id: 2,
      name: "Suéter de Tricô Rosa",
      description: "Tambem nao sei o tipo de tecido",
      price: "R$ 40,00",
      image: Vestido,
    }
  ];

  return (
    <div className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-[#F7E9D0]/50 min-h-screen">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-4xl font-extrabold mb-2 text-[#B15E4B]">
          Nosso Catálogo
        </h2>
        <p className="text-[#4A7C96] text-lg font-medium">
          Deixe suas bonecas ainda mais lindas com nossas peças exclusivas.
        </p>
        <div className="h-1 w-20 bg-[#E8B864] mt-4 mx-auto md:mx-0 rounded-full" />
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={addToCart} 
          />
        ))}
      </div>
    </div>
  );
}