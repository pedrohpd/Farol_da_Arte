import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* Seção Hero */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-indigo-500 font-semibold tracking-wider uppercase text-sm mb-4 block">Nova Coleção</span>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900">Moda em miniatura para suas bonecas.</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Descubra peças exclusivas, feitas à mão com muito amor e detalhes encantadores. Renove o guarda-roupa da sua boneca com nossa nova coleção.
          </p>
          <button className="bg-indigo-500 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200"
          onClick={() => navigate("/Catalogo")}>
            Ver Catálogo
          </button>
        </div>
        <div className="aspect-[4/5] md:aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-2xl relative">
          <img 
            src="/images/hero.png" 
            alt="Arara de roupas de boneca" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      
      {/* Seção  Sobre */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/5] md:aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-2xl relative">
          <img 
            src="/images/hero.png" 
            alt="Arara de roupas de boneca" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p>Sobre mim bla bla bla</p>
          <p>Foto do lado é a mãe do perez</p>
        </div>
      </section>

      {/* Seção de Destaques */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Destaques da Loja</h3>
            <p className="text-gray-500 max-w-2xl mx-auto">As roupinhas mais queridas e procuradas no momento.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Produto 1 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img src="/images/dress.png" alt="Vestido Floral Vintage" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h4 className="font-semibold text-lg text-gray-900 mb-1">Vestido Floral Vintage</h4>
              <p className="text-gray-500 text-sm mb-3">Tamanho Padrão</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-xl text-indigo-600">R$ 45,00</span>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-indigo-500 hover:text-white transition-colors flex items-center justify-center w-10 h-10">🛒</button>
              </div>
            </div>

            {/* Produto 2 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img src="/images/sweater.png" alt="Suéter de Tricô Rosa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h4 className="font-semibold text-lg text-gray-900 mb-1">Suéter de Tricô Rosa</h4>
              <p className="text-gray-500 text-sm mb-3">Feito à mão</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-xl text-indigo-600">R$ 60,00</span>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-indigo-500 hover:text-white transition-colors flex items-center justify-center w-10 h-10">🛒</button>
              </div>
            </div>

          </div>
          <div className="text-center mt-12">
            <button className="bg-indigo-500 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200"
            onClick={() => navigate("/Catalogo")}>
              Ver Catálogo Completo
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
