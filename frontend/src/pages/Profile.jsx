import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Profile() {
  const { user, logout, deleteAccount } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 w-full flex-grow text-center">
        <h2 className="text-3xl font-extrabold text-[#B15E4B] mb-4">Nenhum Perfil Encontrado</h2>
        <p className="text-gray-600 text-lg mb-8">
          Você não configurou seus dados de envio nesta máquina ainda.
        </p>
        <button
          onClick={() => navigate('/login', { state: { registering: true } })}
          className="bg-[#4A7C96] text-[#F7E9D0] font-bold text-lg px-8 py-3 rounded-full hover:bg-[#B15E4B] transition-all inline-block shadow-lg"
        >
          Configurar Perfil
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    clearCart();
    navigate('/');
  }

  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  const formattedAddress = typeof user.address === 'object'
    ? `${user.address.rua}, ${user.address.numero} - ${user.address.bairro}, ${user.address.cidade}/${user.address.estado} (CEP: ${user.address.cep})`
    : user.address;

  return (
    <div className="w-full px-6 md:px-12 lg:px-24 xl:px-48 py-12 md:py-16 flex flex-col bg-[#F7E9D0]/30 min-h-screen">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold text-[#B15E4B] mb-2">
          Olá, {getFirstName(user.name)}!
        </h2>
        <p className="text-[#4A7C96] text-lg font-medium">
          Esses são os seus dados de envio salvos. Você pode revisá-los ou editá-los a qualquer momento.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-10">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#F7E9D0] flex flex-col items-center md:items-start text-center md:text-left transition-all hover:shadow-md">
          <h3 className="text-xl font-bold text-[#423E37] mb-2 uppercase tracking-tight text-xs opacity-60">Dados de Contato</h3>
          <p className="text-[#4A7C96] font-bold text-lg">{user.name}</p>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#F7E9D0] flex flex-col items-center md:items-start text-center md:text-left transition-all hover:shadow-md">
          <h3 className="text-xl font-bold text-[#423E37] mb-2 uppercase tracking-tight text-xs opacity-60">Endereço de Entrega</h3>
          <p className="text-gray-700 leading-relaxed font-medium">
            {formattedAddress}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 border-t border-[#F7E9D0] pt-10">

        <button
          onClick={() => navigate('/login', { state: { registering: true } })}
          className="w-full max-w-xs px-8 py-4 bg-[#4A7C96] text-white rounded-full font-bold shadow-md hover:bg-[#B15E4B] transition-all text-center uppercase tracking-widest text-sm"
        >
          Editar Dados
        </button>

        <button
          onClick={handleLogout}
          className="w-full max-w-xs px-8 py-4 bg-white text-[#B15E4B] border-2 border-[#B15E4B] rounded-full font-bold hover:bg-[#B15E4B] hover:text-white transition-all text-center uppercase tracking-widest text-sm"
        >
          Sair da Conta
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-full max-w-xs px-8 py-4 bg-transparent text-gray-400 rounded-full font-bold hover:text-red-600 transition-all text-center text-xs underline decoration-dotted"
        >
          Excluir Perfil
        </button>

      </div>
    </div>
  );
}