import React, { createContext, useState, useEffect, ReactNode } from "react";
import ApiService from "../../services/apiServices";

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  signin: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const signin = async (username: string, password: string) => {
    try {
      const data = await ApiService.login(username, password);
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        setToken(data.token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Signin failed:", error);
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const data = await ApiService.signup(username, password);
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, signin, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
