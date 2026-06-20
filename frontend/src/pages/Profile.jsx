import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { usePopup } from '../contexts/PopupContext';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { clearCart } = useCart();
  const { showPopup } = usePopup();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCpf(user.cpf || '');
      setCep(user.cep || '');
      setRua(user.street || '');
      setNumero(user.number ? String(user.number) : '');
      setBairro(user.additional_info || '');
      setCidade(user.city || '');
      setEstado(user.state || '');
      setPassword(''); // Password is not loaded

      // Fetch user orders
      const fetchOrders = async () => {
        try {
          const res = await api.get('/orders');
          setOrders(res.data || []);
        } catch (error) {
          console.error("Erro ao carregar pedidos:", error);
        }
      };
      fetchOrders();
    }
  }, [user, isEditing]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 w-full flex-grow text-center">
        <h2 className="text-3xl font-extrabold text-[#B15E4B] mb-4">Nenhum Perfil Encontrado</h2>
        <p className="text-gray-600 text-lg mb-8">
          Você não está logado ou a sessão expirou.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#4A7C96] text-[#F7E9D0] font-bold text-lg px-8 py-3 rounded-full hover:bg-[#B15E4B] transition-all inline-block shadow-lg"
        >
          Fazer Login
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/profile');
      showPopup('Conta excluída com sucesso.', 'success');
      logout();
      clearCart();
      navigate('/');
    } catch (error) {
      showPopup(error.response?.data?.error || 'Erro ao excluir conta.', 'error');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleCepChange = async (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 5) formatted = value.replace(/^(\d{5})(\d)/, '$1-$2');
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
      } catch (err) {
        console.error('Erro ao buscar o CEP:', err);
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email || !cpf || !cep || !rua || !numero || !bairro || !cidade || !estado) {
      showPopup('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password: password || undefined,
        cpf,
        cep,
        street: rua,
        number: parseInt(numero) || 0,
        additional_info: bairro,
        city: cidade,
        state: estado,
      };

      const response = await api.put('/profile', payload);
      updateUser(response.data.user);
      showPopup('Perfil atualizado com sucesso!', 'success');
      setIsEditing(false);
    } catch (error) {
      showPopup(error.response?.data?.error || 'Erro ao atualizar perfil.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getFirstName = (fullName) => fullName?.split(' ')[0] || '';
  const formattedAddress = user.street
    ? `${user.street}, ${user.number} - ${user.additional_info}, ${user.city}/${user.state} (CEP: ${user.cep || 'N/A'})`
    : 'Endereço não cadastrado ou em formato antigo.';

  return (
    <div className="w-full px-6 md:px-12 lg:px-24 xl:px-48 py-12 md:py-16 flex flex-col bg-[#F7E9D0]/30 min-h-screen">
      
      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all text-center">
            <h3 className="text-2xl font-black text-[#B15E4B] mb-4 uppercase tracking-tight">Cuidado!</h3>
            <p className="text-gray-600 mb-8 font-medium">
              Você tem certeza que deseja excluir permanentemente sua conta? Esta ação não poderá ser desfeita, e você perderá o acesso aos seus pedidos anteriores.
            </p>
            <div className="flex flex-col gap-3">
              <button
                disabled={loading}
                onClick={handleDeleteAccount}
                className="w-full bg-[#B15E4B] text-white font-bold py-4 rounded-full shadow-lg hover:bg-red-700 transition-all uppercase tracking-widest text-sm"
              >
                {loading ? 'Excluindo...' : 'Sim, Excluir Minha Conta'}
              </button>
              <button
                disabled={loading}
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-gray-100 text-gray-500 font-bold py-4 rounded-full hover:bg-gray-200 transition-all uppercase tracking-widest text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold text-[#B15E4B] mb-2">
          Olá, {getFirstName(user.name)}!
        </h2>
        <p className="text-[#4A7C96] text-lg font-medium">
          {isEditing ? 'Edite os seus dados abaixo e clique em Salvar.' : 'Esses são os seus dados de envio salvos. Você pode revisá-los ou editá-los a qualquer momento.'}
        </p>
      </div>

      {!isEditing ? (
        <>
          <div className="grid grid-cols-1 gap-8 mb-10">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#F7E9D0] flex flex-col items-center md:items-start text-center md:text-left transition-all hover:shadow-md">
              <h3 className="text-xl font-bold text-[#423E37] mb-2 uppercase tracking-tight text-xs opacity-60">Dados de Contato</h3>
              <p className="text-[#4A7C96] font-bold text-lg">{user.name}</p>
              <p className="text-gray-500 mt-1">{user.email}</p>
              {user.cpf && <p className="text-gray-400 mt-1 text-sm font-medium">CPF: {user.cpf}</p>}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#F7E9D0] flex flex-col items-center md:items-start text-center md:text-left transition-all hover:shadow-md">
              <h3 className="text-xl font-bold text-[#423E37] mb-2 uppercase tracking-tight text-xs opacity-60">Endereço de Entrega</h3>
              <p className="text-gray-700 leading-relaxed font-medium">
                {formattedAddress}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#F7E9D0] mb-10 transition-all hover:shadow-md">
            <h3 className="text-xl font-bold text-[#423E37] mb-6 uppercase tracking-tight text-xs opacity-60">Meus Pedidos</h3>
            {orders.length === 0 ? (
              <p className="text-gray-400 italic text-sm">Você ainda não tem pedidos.</p>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.code} className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                      <div>
                        <span className="text-xs font-bold bg-[#4A7C96] text-white px-3 py-1 rounded-full mr-3 uppercase">#{order.code}</span>
                        <span className="text-sm font-bold text-gray-500">{new Date(order.order_time).toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === 'paid' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'paid' ? 'Pago' : order.status === 'cancelled' ? 'Cancelado' : 'Pendente Pix'}
                        </span>
                        <span className="font-black text-xl text-[#B15E4B]">
                          {order.total_amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    </div>

                    <ul className="text-sm space-y-2 mb-4">
                      {order.items?.map(item => (
                        <li key={item.id} className="flex justify-between items-center text-gray-600">
                          <span>{item.quantity}x {item.product?.name || `Produto #${item.product_code}`}</span>
                        </li>
                      ))}
                    </ul>

                    {order.status !== 'paid' && order.status !== 'cancelled' && order.pix_qrcode && (
                      <div className="mt-4 bg-white border border-gray-200 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-center">
                        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 shrink-0">
                          <QRCodeSVG value={order.pix_qrcode} size={120} level="M" />
                        </div>
                        <div className="flex-grow w-full">
                          <p className="text-xs font-bold text-[#4A7C96] uppercase mb-2">Aguardando Pagamento via PIX</p>
                          <code className="block w-full bg-gray-50 p-3 rounded-lg text-[10px] break-all border border-gray-100 text-gray-500 mb-3">
                            {order.pix_qrcode}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(order.pix_qrcode);
                              alert("Código PIX copiado!");
                            }}
                            className="w-full bg-[#B15E4B] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#4A7C96] transition-all text-xs uppercase"
                          >
                            Copiar PIX Copia e Cola
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 border-t border-[#F7E9D0] pt-10">
            <button
              onClick={() => setIsEditing(true)}
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
              onClick={() => setShowDeleteModal(true)}
              className="w-full max-w-xs px-8 py-4 bg-transparent text-gray-400 rounded-full font-bold hover:text-red-600 transition-all text-center text-xs underline decoration-dotted"
            >
              Excluir Perfil
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleUpdateProfile} className="bg-white rounded-3xl p-8 shadow-md border border-[#F7E9D0] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#4A7C96] uppercase mb-1 ml-1">Nome Completo</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A7C96] uppercase mb-1 ml-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A7C96] uppercase mb-1 ml-1">CPF</label>
              <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'))} maxLength="14" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-[#4A7C96] uppercase mb-1 ml-1">Nova Senha (opcional)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Deixe em branco para manter a mesma" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all" />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-bold text-[#B15E4B] mb-4 uppercase tracking-wide">Endereço</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              <div className="col-span-2 md:col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">CEP</label>
                <input type="text" value={cep} onChange={handleCepChange} maxLength="9" placeholder="00000-000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">UF</label>
                <input type="text" maxLength="2" value={estado} onChange={(e) => setEstado(e.target.value.toUpperCase())} placeholder="SP" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all uppercase" />
              </div>
              <div className="col-span-4 md:col-span-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Cidade</label>
                <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all" />
              </div>
              <div className="col-span-3 md:col-span-4">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Rua / Logradouro</label>
                <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Nº</label>
                <input type="text" value={numero} onChange={(e) => setNumero(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all" />
              </div>
              <div className="col-span-4">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Bairro</label>
                <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-8 pt-4">
            <button type="submit" disabled={loading} className="w-full md:w-2/3 bg-[#B15E4B] text-white font-bold py-4 rounded-full shadow-lg hover:bg-[#4A7C96] transition-all uppercase tracking-widest text-sm disabled:opacity-50">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="w-full md:w-1/3 bg-gray-100 text-gray-600 font-bold py-4 rounded-full hover:bg-gray-200 transition-all uppercase tracking-widest text-sm">
              Cancelar
            </button>
          </div>
        </form>
      )}

    </div>
  );
}