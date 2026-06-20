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

  const addToCart = (product, quantityToAdd = 1) => {
    setCart((prevCart) => {
      const productCode = product.code || product.id;
      // Se o produto já está no carrinho, apenas aumentamos a quantidade
      const existingProduct = prevCart.find(item => (item.code || item.id) === productCode);
      if (existingProduct) {
        return prevCart.map(item =>
          (item.code || item.id) === productCode ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      }
      // Se for inédito, adicionamos na lista com a quantidade selecionada
      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (code) => {
    setCart((prevCart) => prevCart.filter(item => (item.code || item.id) !== code));
  };

  const clearCart = () => setCart([]);

  const updateQuantity = (code, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        (item.code || item.id) === code ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
