import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { user, saveProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegistering, setIsRegistering] = useState(location.state?.registering || false);

  // Estados dos campos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [error, setError] = useState('');

  const handleCepChange = async (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 5) {
      formatted = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    setCep(formatted);

    if (value.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setRua(data.logradouro || '');
          setBairro(data.bairro || '');
          setCidade(data.localidade || '');
          setEstado(data.uf || '');
        }
      } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (!name || !email || !password || !cep || !rua || !numero || !bairro || !cidade || !estado) {
        setError('Por favor, preencha todos os campos para o cadastro.');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Email e senha são obrigatórios.');
        return;
      }
    }
    
    saveProfile({
      name: isRegistering ? name : (user?.name || 'Usuario'),
      email,
      address: isRegistering ? { cep, rua, numero, bairro, cidade, estado } : user?.address
    });

    navigate('/perfil'); 
  };

  return (
    <div className="w-full px-6 py-12 md:py-20 flex-grow bg-[#F7E9D0]/30 min-h-screen font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-[#F7E9D0] overflow-hidden">
        
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#B15E4B] mb-2 uppercase tracking-tight">
              {isRegistering ? 'Criar Nova Conta' : 'Bem-vindo ao Farol!'}
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-[#B15E4B] rounded-xl text-sm text-center font-bold border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 gap-5">
              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold text-[#4A7C96] uppercase mb-1 ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Ex: João Silva"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#4A7C96] uppercase mb-1 ml-1">email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="seuemail@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A7C96] uppercase mb-1 ml-1">Senha</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegistering && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-[#B15E4B] mb-4 uppercase tracking-wide">Endereço de Entrega</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                  
                  {/* CEP */}
                  <div className="col-span-2 md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">CEP</label>
                    <input 
                      type="text" 
                      value={cep}
                      onChange={handleCepChange}
                      maxLength="9"
                      placeholder="00000-000"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all"
                    />
                  </div>

                  {/* ESTADO (UF) */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">UF</label>
                    <input 
                      type="text" 
                      maxLength="2"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value.toUpperCase())}
                      placeholder="SP"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all uppercase"
                    />
                  </div>

                  {/* CIDADE */}
                  <div className="col-span-4 md:col-span-3">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Cidade</label>
                    <input 
                      type="text" 
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all"
                    />
                  </div>

                  {/* RUA */}
                  <div className="col-span-3 md:col-span-4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Rua / Logradouro</label>
                    <input 
                      type="text" 
                      value={rua}
                      onChange={(e) => setRua(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all"
                    />
                  </div>

                  {/* NÚMERO */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Nº</label>
                    <input 
                      type="text" 
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all"
                    />
                  </div>

                  {/* BAIRRO */}
                  <div className="col-span-4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Bairro</label>
                    <input 
                      type="text" 
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all"
                    />
                  </div>

                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#B15E4B] text-white font-bold text-lg mt-6 py-4 rounded-full shadow-lg hover:bg-[#4A7C96] transition-all transform active:scale-95 shadow-[#B15E4B]/20"
            >
              {isRegistering ? 'Finalizar Cadastro' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[#4A7C96] font-bold text-sm hover:text-[#B15E4B] transition-colors uppercase tracking-widest"
            >
              {isRegistering 
                ? '← Já tem conta? Faça login' 
                : 'Ainda não tem conta? Cadastre-se aqui →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}