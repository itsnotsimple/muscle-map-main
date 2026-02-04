import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ТУК Е РАЗКОВНИЧЕТО:
  // Слагаме loading: false ОТ САМОТО НАЧАЛО.
  // Така React никога няма да влезе в режим "зареждане".
  const [loading, setLoading] = useState(false); 
  const [user, setUser] = useState(null);

  // Махаме useEffect-a напълно временно. 
  // Сега няма да те логва автоматично, но поне ще видим сайта!

  const login = (token, email) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    setUser({ email, token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);