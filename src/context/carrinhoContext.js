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
        if (userId) {
            const fetchCarrinho = async () => {
                setLoading(true);
                setError(null); // Reseta o erro antes de tentar novamente
                try {
                    const token = localStorage.getItem('token');
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };
    
                    const response = await api.get(`/carrinho/${userId}`, config);
    
                    if (response.data && response.data.produtos) {
                        // Processando os produtos para o formato esperado
                        const itensProcessados = response.data.produtos.map(produto => ({
                            id: produto.id,
                            nome: produto.nome,
                            preco: produto.preco,
                            descricao: produto.descricao,
                            quantity: produto.CarrinhoProduto.quantity || 0, // Relacionamento do carrinho
                            total: produto.CarrinhoProduto.total || 0,       // Relacionamento do carrinho
                        }));
                        setCarrinhoItems(itensProcessados); // Atualizando o estado com os itens processados
                    } else {
                        setCarrinhoItems([]); // Caso não haja produtos, limpa o carrinho
                    }
                } catch (error) {
                    console.error('Erro ao buscar carrinho:', error);
                    setError('Erro ao carregar o carrinho.'); // Armazenando a mensagem de erro no estado
                } finally {
                    setLoading(false); // Finalizando o estado de carregamento
                }
            };
    
            fetchCarrinho(); // Chamando a função para carregar os dados ao montar o componente
        }
    }, [userId]);
    

    const addToCarrinho = async (produto) => {
        setLoading(true);
        try {
            const quantidade = carrinhoItems.some(item => item.id === produto.id) 
                ? carrinhoItems.find(item => item.id === produto.id).quantity + 1 
                : 1;

            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
            const response = await api.post('/carrinho/add', {
                productId: produto.id,
                quantity: quantidade
            }, config);
    
            if (response.data && response.data.produtos) {
                const itensProcessados = response.data.produtos.map(produto => ({
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    descricao: produto.descricao,
                    quantity: produto.CarrinhoProduto.quantity, // Obtém do relacionamento
                    total: produto.CarrinhoProduto.total       // Obtém do relacionamento
                }));
                setCarrinhoItems(itensProcessados);
            }
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            setError(error);
        } finally {
            setLoading(false);
            window.location.reload()
        }
    };
    
    const removeFromCarrinho = async (produtoId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
            const response = await api.delete(`/carrinho/remove/${produtoId}`, config); // Não precisa passar o body aqui
            console.log('Resposta do servidor:', response);
            if (response.data?.Products) {
                const itensProcessados = response.data.map(produto => ({
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    descricao: produto.descricao,
                    quantity: produto.quantity || 0,
                    total: produto.total || 0,
                }));
                setCarrinhoItems(itensProcessados);
            }
        } catch (error) {
            console.error('Erro ao remover do carrinho:', error);
            setError(error);
        } finally {
            window.location.reload()
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
