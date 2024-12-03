import React, { useContext } from 'react';
import { ProdutoContext } from '../../context/produtoContext';
import styled from 'styled-components';
import { CarrinhoContext } from '../../context/carrinhoContext';
import { AuthContext } from '../../context/authContext'; // Importa o AuthContext
import { useNavigate } from 'react-router-dom';
import carrinhoAdd from '../../imagens/icones/carrinhoAdd.svg';
import deleteIcon from '../../imagens/icones/carrinhoRemove.svg';
import editIcon from '../../imagens/icones/editProduto.svg';
import deleteProdutoIcon from '../../imagens/icones/deleteProduto.svg';
import SadFaceIcon from '../../imagens/icones/sadFaceIcon.svg';

const corFornecedor = '#F19E39';
const corUsuario = '#0073e6';

function TodosOsProdutos() {
    const { produto, deleteProduto } = useContext(ProdutoContext);
    const { carrinhoItems, addToCarrinho, removeFromCarrinho } = useContext(CarrinhoContext);
    const { isAuthenticated, isFornecedor } = useContext(AuthContext); // Verifica se o usuário está autenticado
    const navigate = useNavigate();

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

    if (!produto || produto.length === 0) {
      return (
        <Home>
          <Title>Nenhum Produto Cadastrado ...</Title>
          <IconeSad><img src={SadFaceIcon} alt="Fornecedores Icone" /></IconeSad>
          <Mensagem>
            <p>
              Cadastre-se como um <span style={{ color: corUsuario }}><b>usuario</b></span> para abrir o seu carrinho e realizar compras! 
              <br></br>
              <br></br>
              Ou, cadastre-se como <span style={{ color: corFornecedor }}><b>fornecedor</b></span> para criar, editar ou remover produtos.
              <br></br>
              <br></br>
            </p>

          </Mensagem>
        </Home>
      );
    }

    return (
        <Home>
            <Title><b>Todos os Produtos</b></Title>
            <TodosOsProdutosWrapper>
                {produto.map((prod) => (
                    <ProdutoCard key={prod.id}>
                    <ProdutoInfo>
                      <ProdutoNome><b> {prod.nome} </b></ProdutoNome>
                      <ProdutoDescricao>Descrição: {prod.descricao}</ProdutoDescricao>
                    </ProdutoInfo>
                    <BotoesAcao>
                      <ProdutoPreco>
                        R$ {prod.preco ? prod.preco.toFixed(2) : 'n/a'}
                      </ProdutoPreco>
                      
                      {!isFornecedor && (
                        <>
                          {!carrinhoItems.find((item) => item.id === prod.id) ? (
                            <Icone onClick={() => handleAddToCarrinho(prod)}>
                              <img src={carrinhoAdd} alt="Adicionar Produto" />
                            </Icone>
                          ) : (
                            <Icone onClick={() => removeFromCarrinho(prod.id)}>
                              <img src={deleteIcon} alt="Remover Produto" />
                            </Icone>
                          )}
                        </>
                      )}
                      
                      {isFornecedor && (
                        <>
                          <Icone remover onClick={() => handleDelete(prod.id)}>
                            <img src={deleteProdutoIcon} alt="Deletar Produto" />
                          </Icone>
                          <Icone onClick={() => handleUpdate(prod.id)}>
                            <img src={editIcon} alt="Atualizar Produto" />
                          </Icone>
                        </>
                      )}
                    </BotoesAcao>
                  </ProdutoCard>
                ))}
            </TodosOsProdutosWrapper>
        </Home>
    );
}

// Estilização

const IconeSad = styled.div`
  cursor: pointer;
  align: center;
  margin: 10px;
  width: 70px;
  height: 70px;

  img {
    width: 100%;
    height: 100%;
  }

`;

const Mensagem = styled.p`
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
`;

const Icone = styled.div`
  cursor: pointer;
  margin: 10px;
  width: 30px;
  height: 30px;

  img {
    width: 100%;
    height: 100%;
  }

  &:hover {
    opacity: 0.6;
  }
`;

const Title = styled.h2`
  text-align: center;
  padding-top: 50px;
  padding-bottom: 20px;
  color: #333333;
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 30px;
`;

const Home = styled.section`
    min-height: 90vh;
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
  height: 300px; /* Defina altura fixa */
`;

const ProdutoInfo = styled.div`
  flex-grow: 1;
  overflow-y: auto; /* Habilita scrollbar */
`;


const ProdutoNome = styled.p`
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
  overflow: hidden; /* Trunca texto */
  text-overflow: ellipsis; /* Adiciona '...' */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limita linhas */
  -webkit-box-orient: vertical;
`;

const ProdutoDescricao = styled.p`
  font-size: 14px;
  text-align: center;
  margin-bottom: 10px;
  overflow: hidden; /* Trunca texto */
  text-overflow: ellipsis; /* Adiciona '...' */
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limita linhas */
  -webkit-box-orient: vertical;
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
    margin: 3px 0;
    width: 100%;

    &:hover {
        background-color: ${(props) =>
            props.remover ? '#d83a3a' : props.atualizar ? '#008dc7' : '#d88e00'};
    }
`;

const BotoesAcao = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  padding-top: 10px;
`;

export default TodosOsProdutos;
