import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Importando axios

const api = axios.create({
  baseURL: 'http://localhost:8080', // URL do seu backend
});

export const ProdutoContext = createContext();

export const ProdutoProvider = ({ children }) => {
    const [produto, setProduto] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = async () => {
        try {
            const response = await api.get('/products');
            const produtos = response.data.map(produto => ({
                ...produto,
                preco: parseFloat(produto.preco),
            }));
            console.log('Produtos recebidos:', produtos);
            setProduto(produtos);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            setError(error);
            setLoading(false);
        }
    };

    // Função para adicionar um produto novo
    const addProduto = async (novoProduto) => {
        try {
            // Garantir que 'preco' seja um número
            const produtoToAdd = {
                ...novoProduto,
                preco: parseFloat(novoProduto.preco),
            };
            const response = await api.post('/products', produtoToAdd);
            setProduto([...produto, response.data]);
        } catch (error) {
            console.error('Erro ao adicionar Produto:', error);
            throw error; // Propagar o erro para ser tratado no componente
        }
    };

    // Função para deletar um produto
    const deleteProduto = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProduto(produto.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            throw error;
        }
    };

    // Função para atualizar um produto
    const updateProduto = async (produtoUpgrade) => {
        try {
            const response = await api.put(`/products/${produtoUpgrade.id}`, produtoUpgrade);
            setProduto(produto.map((item) => (item.id === produtoUpgrade.id ? response.data : item)));
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            throw error;
        }
    };

    return (
        <ProdutoContext.Provider value={{ produto, loading, error, addProduto, fetchProdutos, deleteProduto, updateProduto }}>
            {children}
        </ProdutoContext.Provider>
    );
};
