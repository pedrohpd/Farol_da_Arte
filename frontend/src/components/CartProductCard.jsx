export default function CartProductCard({ item, onRemove }) {
  return (
    <div className="bg-white border border-[#F7E9D0] rounded-3xl p-6 flex gap-6 items-center shadow-sm relative transition-all hover:shadow-md">
      <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden bg-[#F7E9D0]/20 border border-gray-100">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-grow">
        <h4 className="font-bold text-[#423E37] text-xl mb-1">{item.name}</h4>
        <p className="text-[#B15E4B] font-extrabold text-lg mb-4">{item.price}</p>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Quantidade:
          </span>
          <span className="text-sm font-bold text-[#423E37] bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
            {item.quantity}
          </span>
        </div>
      </div>

      <button 
        onClick={() => onRemove(item.id)}
        className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-[#B15E4B] hover:bg-[#B15E4B]/10 rounded-full transition-all absolute top-4 right-4"
        title="Remover item"
      >
        <span className="text-xl">✕</span>
      </button>
    </div>
  );
}