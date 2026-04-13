import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Carrega o perfil do LocalStorage ao montar
    const storedUser = localStorage.getItem('@FarolDaArte:userProfile');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const saveProfile = (userData) => {
    // Apenas salva localmente, sem senhas ou banco de dados falso
    setUser(userData);
    localStorage.setItem('@FarolDaArte:userProfile', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@FarolDaArte:userProfile');
  };

  return (
    <AuthContext.Provider value={{ user, saveProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
