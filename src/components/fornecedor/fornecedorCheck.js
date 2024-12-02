import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';

const FornecedorCheck = () => {
    const { user } = useContext(AuthContext);
    const [isFornecedor, setIsFornecedor] = useState(false); 
    const [fornecedores, setFornecedores] = useState([]); 

    useEffect(() => {
        const fetchFornecedores = async () => {
            try {
                const fornecedorToken = localStorage.getItem('fornecedoresToken');
                const userToken = localStorage.getItem('userToken');
                
                const response = await axios.get('http://localhost:8080/fornecedor', {
                    headers: {
                        'Authorization': `Bearer ${fornecedorToken || userToken}`
                    }
                });
                
                console.log("Fornecedores retornados ", response.data);
                setFornecedores(response.data); // Armazena a lista de fornecedores no estado
            } catch (error) {
                console.error('Erro ao buscar fornecedores:', error);
            }
        };

        if (user) {
            fetchFornecedores();
        }
    }, [user]);

    useEffect(() => {
        // Verifica se o usuário logado é um fornecedor
        if (user && fornecedores.length > 0) {
            const fornecedorEncontrado = fornecedores.some(fornecedor => fornecedor.id === user.fornecedorId);
            setIsFornecedor(fornecedorEncontrado); // Define se o usuário é fornecedor
        }
    }, [fornecedores, user]);

    return isFornecedor;
};

export default FornecedorCheck;
