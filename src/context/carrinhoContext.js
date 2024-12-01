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
            setError(null); // Reseta o erro antes de tentar novamente
            try {
                // Fazendo a requisição para pegar os itens do carrinho do backend
                const response = await api.get(`/carrinho/${userId}`);

                // Agora que a resposta é um array de produtos, processamos diretamente
                if (response.data?.length > 0) {
                    // Processando os produtos para o formato esperado
                    const itensProcessados = response.data.map(produto => ({
                        id: produto.id,
                        nome: produto.nome,
                        preco: produto.preco,
                        descricao: produto.descricao,
                        quantity: produto.quantity || 0,  
                        total: produto.total || 0, 
                    }));
                    setCarrinhoItems(itensProcessados);  // Atualizando o estado com os itens processados
                } else {
                    setCarrinhoItems([]);  // Caso não haja produtos, limpa o carrinho
                }
            } catch (error) {
                console.error('Erro ao buscar carrinho:', error);
                setError('Erro ao carregar o carrinho.');  // Armazenando a mensagem de erro no estado
            } finally {
                setLoading(false);  // Finalizando o estado de carregamento
            }
        };

        fetchCarrinho();  // Chamando a função para carregar os dados ao montar o componente
    }, [userId]);

    const addToCarrinho = async (produto) => {
        setLoading(true);
        try {
            const itemExistente = carrinhoItems.find(item => item.id === produto.id);
            const quantidade = itemExistente ? itemExistente.quantity + 1 : 1;

            // Envia a requisição para adicionar o produto ao carrinho
            const response = await api.post('/carrinho/add', {
                userId,
                productId: produto.id,
                quantity: quantidade,
            });

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
            console.error('Erro ao adicionar ao carrinho:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCarrinho = async (produtoId) => {
        setLoading(true);
        try {
            const response = await api.delete(`/carrinho/remove/${produtoId}`); // Não precisa passar o body aqui
    
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
            setLoading(true);
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
