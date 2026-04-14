import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 w-full flex-grow text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Nenhum Perfil Encontrado</h2>
        <p className="text-gray-600 text-lg mb-8">
          Você não configurou seus dados de envio nesta máquina ainda.
        </p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-indigo-600 text-white font-bold text-lg px-8 py-3 rounded-full hover:bg-indigo-700 transition-colors inline-block shadow-lg"
        >
          Configurar Perfil
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  const formattedAddress = typeof user.address === 'object' 
    ? `${user.address.rua}, ${user.address.numero} - ${user.address.bairro}, ${user.address.cidade}/${user.address.estado} (CEP: ${user.address.cep})`
    : user.address;

  return (
    <div className="w-full px-6 md:px-12 lg:px-24 xl:px-48 py-12 md:py-16 flex-grow">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
          Olá, {getFirstName(user.name)}! 👋
        </h2>
        <p className="text-gray-500 text-lg">
          Aqui estão seus dados de envio salvos. Você pode revisá-los ou editá-los a qualquer momento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        
        {/* Card Contato */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center md:items-start text-center md:text-left transition-shadow hover:shadow-md">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center text-2xl mb-6">
            👤
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Dados de Contato</h3>
          <p className="text-gray-700 font-medium">{user.name}</p>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>

        {/* Card Endereço */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center md:items-start text-center md:text-left transition-shadow hover:shadow-md">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-2xl mb-6">
            📦
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Seu Endereço Padrão</h3>
          <p className="text-gray-700 leading-relaxed max-w-sm">
            {formattedAddress}
          </p>
        </div>

      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-gray-100 pt-10">
        <button 
          onClick={() => navigate('/login')}
          className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all text-center"
        >
          ✏️ Editar Dados Cadastrais
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full sm:w-auto px-8 py-4 bg-red-50 text-red-600 rounded-full font-bold hover:bg-red-100 hover:text-red-700 transition-all text-center"
        >
          Sair Excluir Perfil Desta Máquina
        </button>
      </div>

    </div>
  );
}
