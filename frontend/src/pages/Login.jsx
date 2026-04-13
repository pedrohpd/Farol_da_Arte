import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { user, saveProfile } = useAuth();
  const navigate = useNavigate();

  // Estados dos campos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [error, setError] = useState('');

  // Se o usuário já tem um perfil salvo na máquina, preenchemos os campos como cortesia
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      if (user.address) {
        setCep(user.address.cep || '');
        setRua(user.address.rua || '');
        setNumero(user.address.numero || '');
        setBairro(user.address.bairro || '');
        setCidade(user.address.cidade || '');
        setEstado(user.address.estado || '');
      }
    }
  }, [user]);

  const fetchCep = async (cepValue) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    setCep(cleanCep);
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setRua(data.logradouro || '');
          setBairro(data.bairro || '');
          setCidade(data.localidade || '');
          setEstado(data.uf || '');
        }
      } catch (err) {
        console.error("Erro ao buscar CEP", err);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !cep || !rua || !numero || !bairro || !cidade || !estado) {
      setError('Por favor, preencha todos os campos do endereço.');
      return;
    }
    
    // Salva globalmente como um App Frontend puro
    saveProfile({
      name,
      email,
      address: { cep, rua, numero, bairro, cidade, estado }
    });

    // Redireciona logo após salvar. Se der sucesso, vai direto pro Perfil visualizar
    navigate('/perfil'); 
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-16 flex-grow w-full">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Seus Dados Mágicos</h2>
            <p className="text-gray-500">
              Configure seu perfil de envio aqui para não precisar redigitar sempre que fizer uma encomenda!
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Ex: Lídia Dias"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="seuemail@exemplo.com"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Endereço de Entrega</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 border-r border-transparent md:border-transparent">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">CEP</label>
                  <input 
                    type="text" 
                    maxLength="8"
                    value={cep}
                    onChange={(e) => fetchCep(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 transition-colors"
                    placeholder="Somente números"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Rua / Logradouro</label>
                  <input 
                    type="text" 
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Número</label>
                  <input 
                    type="text" 
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bairro</label>
                  <input 
                    type="text" 
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cidade</label>
                  <input 
                    type="text" 
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Estado (UF)</label>
                  <input 
                    type="text" 
                    maxLength="2"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors uppercase"
                  />
                </div>

              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white font-bold text-lg mt-6 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Salvar Perfil de Envio
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
