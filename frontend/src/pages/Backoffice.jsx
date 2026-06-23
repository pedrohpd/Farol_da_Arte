import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePopup } from '../contexts/PopupContext';
import api from '../services/api';

export default function Backoffice() {
  const { user } = useAuth();
  const { showPopup } = usePopup();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);

  // Estados do formulário
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Roupa de Boneca');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  // Buscar dados
  const fetchData = async () => {
    try {
      const [prodRes, ordRes, custOrdRes] = await Promise.all([
        api.get('/admin/products'),
        api.get('/admin/orders'),
        api.get('/admin/custom-orders')
      ]);
      setProducts(prodRes.data || []);
      setOrders(ordRes.data || []);
      setCustomOrders(custOrdRes.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    if (user?.is_admin) {
      fetchData();
    }
  }, [user]);

  // Verificação de segurança
  if (!user || !user.is_admin) {
    return (
      <div className="w-full px-6 py-24 flex-grow bg-[#F7E9D0]/30 min-h-screen text-center">
        <h2 className="text-3xl font-extrabold text-[#B15E4B] uppercase">Acesso Negado</h2>
        <p className="mt-4 text-[#4A7C96]">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  // Calculated stats
  const activeOrders = orders.filter(order => order.status !== 'cancelled');
  const totalRevenue = activeOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalOrders = activeOrders.length + customOrders.length;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleResetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setType('Roupa de Boneca');
    setImageFile(null);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!name || !description || !price) {
      showPopup('Preencha os campos obrigatórios.', 'error');
      return;
    }
    if (!editingId && !imageFile) {
      showPopup('Anexe uma imagem para cadastrar um novo produto.', 'error');
      return;
    }

    setLoading(true);

    try {
      let base64String = "";
      let imgType = "";

      if (imageFile) {
        const base64DataUrl = await getBase64(imageFile);
        const [meta, data] = base64DataUrl.split(',');
        base64String = data;
        imgType = meta.split(':')[1].split(';')[0];
      }

      const payload = {
        name,
        description,
        type,
        price: parseFloat(price),
        img_type: imgType,
        image_base64: base64String,
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        showPopup('Produto atualizado com sucesso!', 'success');
      } else {
        await api.post('/products', payload);
        showPopup('Produto cadastrado com sucesso!', 'success');
      }

      handleResetForm();
      fetchData(); // Atualizar a lista de produtos
    } catch (error) {
      showPopup(error.response?.data?.error || 'Erro ao salvar produto.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.code);
    setName(product.name);
    setDescription(product.description);
    setType(product.type);
    setPrice(product.price);
    setImageFile(null);
    setActiveTab('add');
  };

  const handleToggleVisibility = async (id) => {
    try {
      const response = await api.patch(`/products/${id}/toggle`);
      setProducts(products.map(p =>
        p.code === id ? { ...p, is_active: response.data.is_active } : p
      ));
      showPopup('Visibilidade alterada!', 'success');
    } catch (error) {
      showPopup('Erro ao alterar status do produto.', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o.Code === orderId ? { ...o, status: newStatus } : o));
      showPopup('Status do pedido atualizado!', 'success');
    } catch (error) {
      showPopup('Erro ao atualizar status do pedido.', 'error');
    }
  };

  return (
    <div className="w-full px-6 py-12 md:py-16 flex-grow bg-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#B15E4B] mb-2 uppercase tracking-tight">Painel Admin</h1>
            <p className="text-[#4A7C96] font-bold">Visão Geral do Sistema</p>
          </div>
          <button onClick={() => navigate('/catalogo')} className="text-sm font-bold text-gray-500 hover:text-[#B15E4B] underline">
            Ver Catálogo na Loja
          </button>
        </div>

        {/* Navegação por Abas */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'add', label: editingId ? 'Editar Produto' : 'Adicionar Produto' },
            { id: 'catalog', label: 'Gerenciar Catálogo' },
            { id: 'orders', label: 'Pedidos Recentes' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== 'add') handleResetForm();
              }}
              className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all border ${activeTab === tab.id
                  ? 'bg-[#B15E4B] text-white border-[#B15E4B]'
                  : 'bg-white text-[#4A7C96] border-gray-200 hover:border-[#4A7C96]/50 hover:bg-[#F7E9D0]/20'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- ABA DO DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F7E9D0]/30 p-8 rounded-3xl border border-[#F7E9D0]">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total de Vendas</h3>
              <p className="text-4xl font-black text-[#B15E4B]">
                {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-sm text-[#4A7C96] mt-2 font-medium">Soma de todos os pedidos convencionais</p>
            </div>
            <div className="bg-[#F7E9D0]/30 p-8 rounded-3xl border border-[#F7E9D0]">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total de Pedidos</h3>
              <p className="text-4xl font-black text-[#4A7C96]">{totalOrders}</p>
              <p className="text-sm text-[#4A7C96] mt-2 font-medium">Incluindo sob medida</p>
            </div>
          </div>
        )}

        {/* --- ABA DE ADICIONAR / EDITAR PRODUTO --- */}
        {activeTab === 'add' && (
          <div>
            <form onSubmit={handleSaveProduct} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 max-w-3xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#423E37] uppercase tracking-tight">
                  {editingId ? `Editando Produto #${editingId}` : 'Novo Produto'}
                </h2>
                {editingId && (
                  <button type="button" onClick={handleResetForm} className="text-xs font-bold text-red-500 hover:underline">
                    Cancelar Edição
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#4A7C96] uppercase mb-2">Nome do Produto *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#4A7C96] uppercase mb-2">Descrição *</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A7C96] uppercase mb-2">Categoria/Tipo *</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all bg-white">
                    <option value="Roupa de Boneca">Roupa de Boneca</option>
                    <option value="Bichinho de Feltro">Bichinho de Feltro</option>
                    <option value="Acessório">Acessório</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A7C96] uppercase mb-2">Preço (R$) *</label>
                  <input type="text" value={price} onChange={(e) => setPrice(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4A7C96] outline-none transition-all" />
                </div>
                <div className="md:col-span-2 mt-4">
                  <label className="block text-xs font-bold text-[#4A7C96] uppercase mb-2">
                    Imagem do Produto {editingId ? '(Opcional - deixe em branco para não alterar)' : '*'}
                  </label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:bg-[#E8B864] file:text-white hover:file:bg-[#B15E4B] file:transition-all cursor-pointer bg-white border border-gray-200 rounded-xl" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#B15E4B] text-white font-bold text-sm mt-6 py-4 rounded-full shadow-lg hover:bg-[#4A7C96] transition-all disabled:opacity-50 uppercase tracking-widest">
                {loading ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Cadastrar Produto')}
              </button>
            </form>
          </div>
        )}

        {/* --- ABA DO CATÁLOGO --- */}
        {activeTab === 'catalog' && (
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[#4A7C96] text-xs uppercase tracking-widest font-bold">
                    <th className="p-4 border-b border-gray-200">Ref</th>
                    <th className="p-4 border-b border-gray-200">Produto</th>
                    <th className="p-4 border-b border-gray-200">Preço</th>
                    <th className="p-4 border-b border-gray-200 text-center">Status</th>
                    <th className="p-4 border-b border-gray-200 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-400 italic">Nenhum produto cadastrado.</td></tr>
                  ) : products.map(product => (
                    <tr key={product.code} className={`hover:bg-[#F7E9D0]/10 transition-colors border-b border-gray-100 last:border-0 ${!product.is_active ? 'opacity-60 bg-gray-50' : ''}`}>
                      <td className="p-4 font-mono text-xs text-gray-500">#{product.code}</td>
                      <td className="p-4">
                        <p className="font-bold text-[#423E37]">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.type}</p>
                      </td>
                      <td className="p-4 font-bold text-[#B15E4B]">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td className="p-4 text-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                          {product.is_active ? 'Ativo' : 'Oculto'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-[#4A7C96] hover:text-[#4A7C96] hover:bg-[#F7E9D0]/50 p-2 rounded-lg font-bold text-xs uppercase transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggleVisibility(product.code)}
                          className={`${product.is_active ? 'text-red-500 hover:bg-red-50' : 'text-blue-500 hover:bg-blue-50'} p-2 rounded-lg font-bold text-xs uppercase transition-all`}
                        >
                          {product.is_active ? 'Ocultar' : 'Reexibir'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ABA DE PEDIDOS --- */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-[#4A7C96] uppercase tracking-tight">Pedidos Convencionais</h2>
            {orders.length === 0 ? (
              <p className="text-gray-400 italic p-8 bg-gray-50 rounded-2xl text-center">Nenhum pedido recebido ainda.</p>
            ) : (
              <div className="grid gap-4">
                {orders.map(order => (
                  <div key={order.code} className="bg-white border border-[#F7E9D0] p-6 rounded-2xl shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                      <div>
                        <span className="text-xs font-bold bg-[#E8B864] text-white px-3 py-1 rounded-full mr-3 uppercase">#{order.code}</span>
                        <span className="text-sm font-bold text-[#4A7C96]">{new Date(order.order_time).toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="font-black text-xl text-[#B15E4B]">
                        {order.total_amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>
                    {order.user && (
                      <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                        <strong>Cliente:</strong> {order.user.name} ({order.user.email})<br />
                        <strong>Endereço:</strong> {order.user.street}, {order.user.number} - {order.user.city}/{order.user.state} (CEP: {order.user.cep})
                      </p>
                    )}
                    <ul className="text-sm space-y-2 mb-4 border-b border-gray-100 pb-4">
                      {order.items?.map(item => (
                        <li key={item.id} className="flex justify-between items-center bg-[#F7E9D0]/20 p-2 rounded-lg">
                          <span className="font-medium text-[#423E37]">{item.quantity}x {item.product?.name || `Produto #${item.product_code}`}</span>
                          <span className="text-gray-500">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} un.</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-4 md:mb-0">
                        <span className="text-xs font-bold uppercase text-gray-500">Status Pagamento:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                          }`}>
                          {order.status === 'paid' ? 'Pago' : order.status === 'cancelled' ? 'Cancelado' : 'Pendente Pix'}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            <h2 className="text-2xl font-bold text-[#4A7C96] uppercase tracking-tight mt-12">Pedidos Sob Medida</h2>
            {customOrders.length === 0 ? (
              <p className="text-gray-400 italic p-8 bg-gray-50 rounded-2xl text-center">Nenhum pedido sob medida recebido.</p>
            ) : (
              <div className="grid gap-4">
                {customOrders.map(order => (
                  <div key={order.Code} className="bg-white border border-[#4A7C96]/30 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6">
                    {(order.image_url || order.image_data) && (
                      <img
                        src={order.image_url || `data:${order.img_type};base64,${order.image_data}`}
                        alt={order.Model}
                        className="w-full md:w-48 h-48 object-cover rounded-xl"
                      />
                    )}
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold bg-[#4A7C96] text-white px-3 py-1 rounded-full uppercase">Sob Medida #{order.Code}</span>
                        <span className="text-sm font-bold text-gray-400">{new Date(order.OrderTime).toLocaleString('pt-BR')}</span>
                      </div>
                      {order.User && (
                        <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                          <strong>Cliente:</strong> {order.User.name} ({order.User.email})
                        </p>
                      )}
                      <h4 className="font-extrabold text-xl text-[#423E37] mb-2">{order.Model}</h4>
                      <p className="text-gray-600 italic text-sm">{order.Details}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
