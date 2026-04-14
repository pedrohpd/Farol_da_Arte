import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const [modelo, setModelo] = useState(() => sessionStorage.getItem('@draft:modelo') || '');
  const [descricao, setDescricao] = useState(() => sessionStorage.getItem('@draft:descricao') || '');

  useEffect(() => {
    sessionStorage.setItem('@draft:modelo', modelo);
    sessionStorage.setItem('@draft:descricao', descricao);
  }, [modelo, descricao]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuthWarning(true);
      return;
    }

    sessionStorage.removeItem('@draft:modelo');
    sessionStorage.removeItem('@draft:descricao');
    setSubmitted(true);
    setShowAuthWarning(false);
  };

  return (
    <div className="w-full px-6 md:px-16 lg:px-48 xl:px-80 py-12 md:py-24 flex-grow bg-[#F7E9D0]/30 min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-[#B15E4B] mb-4 uppercase tracking-tight">
          Faça a sua encomenda
        </h2>
      </div>

      {submitted ? (
        <div className="bg-white border-2 border-[#E8B864] rounded-3xl p-10 text-center shadow-xl">
          <div className="text-5xl mb-6">✨</div>
          <h3 className="text-2xl font-bold text-[#4A7C96] mb-4 uppercase">Pedido Enviado com Sucesso!</h3>
          <p className="text-gray-600 mb-8">
            Analisaremos cada detalhe com carinho. Fique atento ao seu e-mail, entraremos em contato em breve para combinar os próximos passos.
          </p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setModelo('');
              setDescricao('');
            }}
            className="bg-[#B15E4B] text-white px-8 py-3 rounded-full font-bold hover:bg-[#4A7C96] transition-all shadow-lg uppercase text-sm tracking-widest"
          >
            Fazer Nova Encomenda
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-[#F7E9D0] p-8 md:p-12 space-y-8">
          
          <div>
            <label className="block text-xs font-bold text-[#4A7C96] uppercase tracking-widest mb-2 ml-1">
              Modelo da sua Boneca
            </label>
            <input 
              type="text" 
              required 
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#4A7C96] focus:ring-0 outline-none bg-gray-50 focus:bg-white transition-all text-gray-700"
              placeholder="Ex: Baby Alive, Barbie, Monster High..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A7C96] uppercase tracking-widest mb-2 ml-1">
              Detalhes da Peça
            </label>
            <textarea 
              required 
              rows="5"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#4A7C96] focus:ring-0 outline-none bg-gray-50 focus:bg-white transition-all text-gray-700 resize-none"
              placeholder="Descreva a peça desejada (calça, vestido), o estilo, cores e tecidos que você imagina..."
            />
          </div>

          <div className="bg-[#4A7C96]/5 p-6 rounded-2xl border-2 border-dashed border-[#4A7C96]/20">
             <label className="block text-sm font-bold text-[#4A7C96] mb-1 uppercase tracking-tight">Fotos de Referência</label>
             <p className="text-xs text-gray-500 mb-4">Anexe imagens para inspiração</p>
             <input 
               type="file" 
               accept="image/*"
               multiple
               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:bg-[#4A7C96] file:text-white hover:file:bg-[#B15E4B] file:transition-all cursor-pointer"
             />
          </div>

          {showAuthWarning && (
            <div className="bg-[#B15E4B]/10 text-[#B15E4B] p-6 rounded-2xl border border-[#B15E4B]/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <strong className="block text-lg uppercase tracking-tight">Quase lá!</strong>
                <p className="text-sm opacity-80">Precisamos dos seus dados de entrega para processar a encomenda.</p>
              </div>
              <Link to="/login" className="bg-[#B15E4B] text-white font-bold px-8 py-3 rounded-full hover:bg-[#423E37] transition shadow-xl whitespace-nowrap uppercase text-xs tracking-widest">
                Entrar na sua conta 
              </Link>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-[#4A7C96] text-white font-bold px-8 py-5 rounded-full hover:bg-[#B15E4B] transition-all shadow-xl hover:shadow-[#B15E4B]/20 transform hover:-translate-y-1 active:translate-y-0 uppercase tracking-[0.2em] text-sm"
          >
            Enviar
          </button>
        </form>
      )}
    </div>
  );
}