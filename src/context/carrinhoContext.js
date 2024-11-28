import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Importando axios

const api = axios.create({
  baseURL: 'http://localhost:8080', // URL do seu backend
});

export const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
    const [carrinhoItems, setCarrinhoItems] = useState([]);
    const [userId] = useState(1); // Id do usuário fixo para o exemplo
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCarrinho = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/carrinho/${userId}`);
                if (response.data?.Products?.length > 0) {
                    const itensProcessados = response.data.Products.map(product => ({
                        id: product.id,
                        nome: product.nome,
                        preco: product.preco,
                        descricao: product.descricao,
                        quantity: product.CartProduct.quantity,
                        total: product.CartProduct.total,
                    }));
                    setCarrinhoItems(itensProcessados);
                } else {
                    setCarrinhoItems([]);
                }
            } catch (error) {
                console.error('Erro ao buscar carrinho:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCarrinho();
    }, [userId]);

    const addToCarrinho = async (produto) => {
        setLoading(true);
        try {
            // Verifica se o produto já está no carrinho e ajusta a quantidade
            const itemExistente = carrinhoItems.find(item => item.id === produto.id);
            const quantidade = itemExistente ? itemExistente.quantity + 1 : 1;

            // Envia a requisição para adicionar o produto ao carrinho
            const response = await api.post('/carrinho/add', {
                userId,
                productId: produto.id,
                quantity: quantidade,
            });

            if (response.data?.Products) {
                const itensProcessados = response.data.Products.map(product => ({
                    id: product.id,
                    nome: product.nome,
                    preco: product.preco,
                    descricao: product.descricao,
                    quantity: product.CartProduct.quantity,
                    total: product.CartProduct.total,
                }));
                setCarrinhoItems(itensProcessados);
            }
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCarrinho = async (produtoId) => {
        setLoading(true);
        try {
            // Envia a requisição para remover o produto do carrinho
            const response = await api.delete(`/carrinho/remove/${produtoId}`, {
                data: { userId }, // Passa apenas o userId no corpo da requisição
            });

            if (response.data?.Products) {
                const itensProcessados = response.data.Products.map(product => ({
                    id: product.id,
                    nome: product.nome,
                    preco: product.preco,
                    descricao: product.descricao,
                    quantity: product.CartProduct.quantity,
                    total: product.CartProduct.total,
                }));
                setCarrinhoItems(itensProcessados);
            }
        } catch (error) {
            console.error('Erro ao remover do carrinho:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const clearCarrinho = () => {
        setCarrinhoItems([]);
    };

    return (
        <CarrinhoContext.Provider value={{ carrinhoItems, addToCarrinho, removeFromCarrinho, clearCarrinho, loading, error }}>
            {children}
        </CarrinhoContext.Provider>
    );
};
