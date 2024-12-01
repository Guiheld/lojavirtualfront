import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // Importando axios

const api = axios.create({
  baseURL: 'http://localhost:8080', // URL do seu backend
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);

    // Sempre que o token mudar, tenta decodificar e atualizar o estado do usuário
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("DEBUG FRONTEND - O TOKEN DECODIFICADO ", decoded);
                
                // Verificar se o token está expirado
                if (decoded.exp * 1000 < Date.now()) {
                    throw new Error("Token expirado");
                }

                setUser({
                    userId: decoded.userId,
                    email: decoded.email,
                });

                // Configura o token nas requisições do Axios
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                console.log("DEBUG FRONTEND - Headers do Axios:", api.defaults.headers.common);
            } catch (error) {
                console.error('Token inválido ou expirado:', error);
                setToken(null);
                setUser(null);
                localStorage.removeItem('token');
            }
        } else {
            setUser(null);
            // Remove o token das requisições do Axios quando o token for nulo
            delete api.defaults.headers.common['Authorization'];
            console.log("DEBUG FRONTEND - Cabeçalho Authorization removido");
        }
    }, [token]);

    // Função de login
    const login = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
    };

    // Função de logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
