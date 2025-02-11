import React, { createContext, useState, useEffect, ReactNode } from "react";
import ApiService from "../../services/apiServices";

interface User {
  id: string;
  email: string;
  name: string | null;
  profileImage: string | null;
  isPrivate: boolean;
  username: string;
  createdAt: string;
  updatedAt: string;
}

interface SignUpData {
  username: string;
  password: string;
  email: string;
  name: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  signin: (username: string, password: string) => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const signin = async (username: string, password: string) => {
    try {
      const data = await ApiService.login(username, password);
      if (data.accessToken) {
        const { accessToken, ...userData } = data;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(accessToken);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Signin failed:", error);
    }
  };

  const signup = async (data: SignUpData) => {
    try {
      const response = await ApiService.signup(data);
      if (response.accessToken) {
        const { accessToken, ...userData } = response;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(accessToken);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, signin, signup, logout }}
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
