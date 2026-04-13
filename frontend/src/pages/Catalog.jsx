import { useCart } from '../contexts/CartContext';

export default function Catalog() {
  const { addToCart } = useCart();
  const products = [
    {
      id: 1,
      name: "Vestido Floral Vintage",
      description: "Tamanho Padrão",
      price: "R$ 45,00",
      image: "/images/dress.png",
    },
    {
      id: 2,
      name: "Suéter de Tricô Rosa",
      description: "Feito à mão com muito carinho",
      price: "R$ 60,00",
      image: "/images/sweater.png",
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 flex-grow w-full">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Nosso Catálogo</h2>
        <p className="text-gray-500 text-lg">Deixe suas bonecas ainda mais lindas com nossas peças exclusivas.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <h4 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h4>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center mt-auto">
              <span className="font-bold text-xl text-indigo-600">{product.price}</span>
              <button 
                onClick={() => addToCart(product)}
                title="Adicionar à sacola"
                className="bg-indigo-50 text-indigo-600 p-2 rounded-full hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center w-10 h-10 shadow-sm active:scale-90"
              >
                🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
