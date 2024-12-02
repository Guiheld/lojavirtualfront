import React, { useContext } from 'react';
import { ProdutoContext } from '../../context/produtoContext';
import styled from 'styled-components';
import { CarrinhoContext } from '../../context/carrinhoContext';
import { AuthContext } from '../../context/authContext'; // Importa o AuthContext
import { useNavigate } from 'react-router-dom';
import FornecedorCheck from './../fornecedor/fornecedorCheck';

function TodosOsProdutos() {
    const { produto, deleteProduto } = useContext(ProdutoContext);
    const { carrinhoItems, addToCarrinho, removeFromCarrinho } = useContext(CarrinhoContext);
    const { isAuthenticated } = useContext(AuthContext); // Verifica se o usuário está autenticado
    const navigate = useNavigate();

    // Verifica se o usuário logado é um fornecedor
    const isFornecedor = FornecedorCheck();

    const handleAddToCarrinho = (prod) => {
        if (!isAuthenticated) {
            alert('Você precisa estar logado para adicionar produtos ao carrinho.');
            return;
        }
        addToCarrinho(prod);
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
            deleteProduto(id);
        }
    };

    const handleUpdate = (id) => {
        navigate(`/editar-produto/${id}`);
    };

    return (
        <Home>
            <TodosOsProdutosWrapper>
                {produto.map((prod) => (
                    <ProdutoCard key={prod.id}>
                        <ProdutoNome>Nome Produto: {prod.nome}</ProdutoNome>
                        <ProdutoDescricao>Descrição: {prod.descricao}</ProdutoDescricao>
                        <ProdutoPreco>
                            R$ {prod.preco ? prod.preco.toFixed(2) : 'Preço indisponível'}
                        </ProdutoPreco>
                        {!isFornecedor && (
                            <>
                                {!carrinhoItems.find((item) => item.id === prod.id) ? (
                                    <Botao onClick={() => handleAddToCarrinho(prod)}>Adicionar ao Carrinho</Botao>
                                ) : (
                                    <Botao remover onClick={() => removeFromCarrinho(prod.id)}>
                                        Remover do Carrinho
                                    </Botao>
                                )}
                            </>
                        )}
                        {isFornecedor && (
                            <>
                                <Botao atualizar onClick={() => handleUpdate(prod.id)}>
                                    Atualizar
                                </Botao>
                                <Botao remover onClick={() => handleDelete(prod.id)}>
                                    Deletar
                                </Botao>
                            </>
                        )}
                    </ProdutoCard>
                ))}
            </TodosOsProdutosWrapper>
        </Home>
    );
}

// Estilização (permanece inalterada)
const Home = styled.section`
    background-color: #ebecee;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TodosOsProdutosWrapper = styled.div`
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
`;

const ProdutoCard = styled.div`
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
`;

const ProdutoNome = styled.p`
    font-size: 16px;
    text-align: center;
    margin-bottom: 10px;
`;

const ProdutoDescricao = styled.p`
    font-size: 14px;
    text-align: center;
    margin-bottom: 10px;
`;

const ProdutoPreco = styled.p`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const Botao = styled.button`
    background-color: ${(props) =>
        props.remover ? '#ff4c4c' : props.atualizar ? '#00a8e8' : '#eb9b00'};
    color: #fff;
    padding: 10px 20px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 5px 0;
    width: 100%;

    &:hover {
        background-color: ${(props) =>
            props.remover ? '#d83a3a' : props.atualizar ? '#008dc7' : '#d88e00'};
    }
`;

export default TodosOsProdutos;
