import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  // States with SessionStorage initialization
  const [modelo, setModelo] = useState(() => sessionStorage.getItem('@draft:modelo') || '');
  const [descricao, setDescricao] = useState(() => sessionStorage.getItem('@draft:descricao') || '');

  // Auto-save drats to ensure user doesn't lose text when navigating to Login
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

    // Sucesso verdadeiro
    sessionStorage.removeItem('@draft:modelo');
    sessionStorage.removeItem('@draft:descricao');
    setSubmitted(true);
    setShowAuthWarning(false);
  };

  return (
    <div className="w-full px-6 md:px-16 lg:px-48 xl:px-80 py-12 md:py-24 flex-grow">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Faça sua Encomenda</h2>
        <p className="text-gray-600 text-lg">
          Sonhou com uma roupinha específica para sua boneca? Preencha os detalhes abaixo, anexe imagens de referência, e nós daremos vida a essa ideia!
        </p>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center text-green-800">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-2xl font-bold mb-2">Sua encomenda foi recebida!</h3>
          <p>
            Analisaremos as especificações e as fotos de referência e entraremos em contato através do e-mail fornecido em breve.
          </p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setModelo('');
              setDescricao('');
            }}
            className="mt-6 font-semibold text-green-700 hover:text-green-900 underline"
          >
            Fazer nova encomenda
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 space-y-6">
          
          {user && (
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl text-emerald-900 text-sm mb-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">✅</span> 
                <strong className="text-base">Perfil de envio confirmado</strong>
              </div>
              <p className="ml-7"><strong>Nome:</strong> {user.name} <br />
              <strong>Endereço:</strong> {
                typeof user.address === 'object' 
                  ? `${user.address.rua}, ${user.address.numero} - ${user.address.bairro}, ${user.address.cidade}/${user.address.estado} (CEP: ${user.address.cep})`
                  : user.address
              }</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Qual o modelo da boneca? *</label>
            <input 
              type="text" 
              required 
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
              placeholder="Ex: Blythe, Barbie Curvy, Monster High, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descreva como deseja a roupinha *</label>
            <textarea 
              required 
              rows="4"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors resize-y"
              placeholder="Detalhe cores, estilo, tipo de tecido preferencial, etc."
            />
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Foto de Referência</label>
             <p className="text-xs text-gray-500 mb-2">Anexe imagens para me ajudar a entender melhor o estilo e os detalhes da peça desejada.</p>
             <input 
               type="file" 
               accept="image/png, image/jpeg, image/webp"
               multiple
               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-colors"
             />
          </div>

          {showAuthWarning && (
            <div className="bg-amber-50 text-amber-800 p-5 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div>
                <strong className="block mb-1 text-base">⚠️ Falta preencher seus dados!</strong>
                <p className="text-sm">Por favor, preencha onde devemos entregar sua encomenda clicando ao lado.</p>
              </div>
              <Link to="/login" className="bg-amber-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition whitespace-nowrap shadow-md">
                Preencher Dados
              </Link>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-bold text-lg py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
          >
            Enviar Solicitação
          </button>
        </form>
      )}

    </div>
  );
}
