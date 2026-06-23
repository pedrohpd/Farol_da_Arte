import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    // Memória local do navegador para o usuário não perder a sacola ao dar F5 (Frontend puro)
    const savedCart = localStorage.getItem('@FarolDaArte:cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('@FarolDaArte:cartItems', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const productCode = product.code || product.id;
    const existingProduct = cart.find(item => (item.code || item.id) === productCode);
    if (existingProduct) {
      alert("Este item já está no carrinho!");
      return;
    }
    setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (code) => {
    setCart((prevCart) => prevCart.filter(item => (item.code || item.id) !== code));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
