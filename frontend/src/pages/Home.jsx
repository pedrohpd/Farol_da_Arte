import { useNavigate } from 'react-router-dom';
import Principal from '../assets/foto_main.jpeg';
import Colecao from '../assets/foto_colecao.jpeg';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div>
          <span className="text-[#4A7C96] font-semibold tracking-wider uppercase text-sm mb-4 block">Nossos Produtos</span>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-[#B15E4B]">Moda para suas bonecas e bichinhos sob encomenda</h2>
          <p className="text-lg text-[#4A7C96] mb-8 leading-relaxed">
            Descubra peças exclusivas, feitas à mão com muito amor e carinho!
          </p>
          <button className="bg-[#4A7C96] text-white font-bold px-8 py-3 rounded-full hover:bg-[#B15E4B] transition shadow"
          onClick={() => navigate("/catalogo")}>
            Ver Catálogo
          </button>
        </div>
        <div className="aspect-[4/5] md:aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-2xl relative">
          <img 
            src={Colecao} 
            alt="Várias fotos de roupas de bonecas" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      
      <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div className="aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
          <img 
            src={Principal} 
            alt="Foto da artesã responsável pelo farol em sua barraca" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className='text-[#B15E4B] font-extrabold'>Nossa história</h1>
          <p className='whitespace-pre-line'>
          O Farol das Artes iniciou suas atividades em 2001, na feira de Barão, 
          que naquela época acontecia no bairro Guará em Campinas SP, 
          quinzenalmente aos domingos. Os produtos na época eram flores de meia de seda e imãs de geladeira. 
          Em 2001, fomos convidados a fazer parte do grupo de expositores 
          do Espaço Castelo das Artes, no bairro Castelo, e lá ficamos até 2010. 
          <br/>
          Com o passar do tempo, modificamos nosso portfólio passando a consertar 
          bonecas e fazer roupas e sapatos, devolvendo a muitas crianças o sorriso 
          e em alguns adultos, suas lembranças. Já em 2011, voltamos às nossas raízes e voltamos
          a fazer parte do grupo de expositores da Feira de Barão agora instalada 
          na Praça do Côco em Barão Geraldo.
          <br/>
          Temos uma estrada de mais de 25 anos com produtos voltados ao universo 
          infantil, com conserto e confecção de bonecas, roupas e acessórios 
          para bonecas assim como bichinhos de pano. Sempre procurando despertar o lúdico no universo infantil!
          </p>
        </div>
      </section>
    </>
  );
}
