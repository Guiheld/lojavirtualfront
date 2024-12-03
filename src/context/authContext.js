import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [fornecedoresToken, setFornecedoresToken] = useState(localStorage.getItem('fornecedoresToken') || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (fornecedoresToken) {
      try {
        const decoded = jwtDecode(fornecedoresToken);
        if (decoded.exp * 1000 < Date.now()) {
          throw new Error("Token expirado");
        }
        setUser({
          id: decoded.fornecedorId,
          email: decoded.email,
          name: decoded.name,
          role: 'fornecedor',
        });
        api.defaults.headers.common['Authorization'] = `Bearer ${fornecedoresToken}`;
      } catch (error) {
        console.error('Token de fornecedor inválido ou expirado:', error);
        setFornecedoresToken(null);
        setUser(null);
        localStorage.removeItem('fornecedoresToken');
      }
    } else if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          throw new Error("Token expirado");
        }
        setUser({
          id: decoded.userId,
          email: decoded.email,
          name: decoded.name,
          role: 'usuario',
        });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Token de usuário inválido ou expirado:', error);
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
      }
    } else {
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
  }, [fornecedoresToken, token]);

  const loginFornecedor = async (email, password) => {
    try {
      const response = await api.post('/fornecedor/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('fornecedoresToken', token);
      setFornecedoresToken(token);
    } catch (error) {
      console.error('Erro ao fazer login como fornecedor:', error.response?.data?.message || error.message);
    }
  };

  const loginUsuario = async (email, password) => {
    try {
      const response = await api.post('/usuario/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
    } catch (error) {
      console.error('Erro ao fazer login como usuário:', error.response?.data?.message || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('fornecedoresToken');
    localStorage.removeItem('token');
    setFornecedoresToken(null);
    setToken(null);
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{
      fornecedoresToken,
      token,
      user,
      isAuthenticated: !!user,
      isFornecedor: user?.role === 'fornecedor',
      isUsuario: user?.role === 'usuario',
      loginFornecedor,
      loginUsuario,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};