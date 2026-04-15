import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedSession = localStorage.getItem('@FarolDaArte:session');
    if (storedSession) {
      setUser(JSON.parse(storedSession));
    }
  }, []);

  const register = (userData) => {
    localStorage.setItem('@FarolDaArte:registeredUser', JSON.stringify(userData));
    setUser(userData);
    localStorage.setItem('@FarolDaArte:session', JSON.stringify(userData));
    return { success: true };
  };

  const login = (email, password) => {
    const registeredUser = JSON.parse(localStorage.getItem('@FarolDaArte:registeredUser'));
    if (registeredUser && registeredUser.email === email && registeredUser.password === password) {
      setUser(registeredUser);
      localStorage.setItem('@FarolDaArte:session', JSON.stringify(registeredUser));
      return { success: true };
    } else {
      return { success: false, message: 'Email ou senha incorretos.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@FarolDaArte:session');
  };

  const deleteAccount = () => {
    localStorage.removeItem('@FarolDaArte:registeredUser');
    setUser(null);
    localStorage.removeItem('@FarolDaArte:session');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
