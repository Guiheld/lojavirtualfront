import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ProdutoContext } from '../../context/produtoContext';
import { useNavigate, useParams } from 'react-router-dom';

function EditarProduto() {
    const { produto, updateProduto } = useContext(ProdutoContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const produtoId = parseInt(id);

    const produtoEditar = produto.find(produto => produto.id === produtoId);

    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        preco: '',
        estoque: 100 
    });
    const [mensagem, setMensagem] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (produtoEditar) {
            setForm({
                nome: produtoEditar.nome,
                descricao: produtoEditar.descricao,
                preco: produtoEditar.preco,
                estoque: produtoEditar.estoque
            });
        } else {
            setMensagem('Produto não encontrado.');
            setError(true);
        }
    }, [produtoEditar]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { nome, descricao, preco, estoque } = form;

        if (nome && descricao && preco && estoque) {
            try {
                await updateProduto({
                    id: produtoId,
                    nome,
                    descricao,
                    preco: parseFloat(preco),
                    estoque: parseInt(estoque)
                });
                setMensagem('Produto atualizado com sucesso!');
                setError(false);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } catch (error) {
                setMensagem('Erro ao atualizar o produto.');
                setError(true);
                console.error(error);
            }
        } else {
            setMensagem('Por favor, preencha os campos obrigatorios.');
            setError(true);
        }
    };

    if (!produtoEditar) {
        return (
            <EditarProdutoContainer>
                <Mensagem error={error}>{mensagem}</Mensagem>
            </EditarProdutoContainer>
        );
    }

    return (
        <EditarProdutoContainer>
            <Form onSubmit={handleSubmit}>
                <Titulo>Atualizar Produto</Titulo>
                <Campo>
                    <Label>Nome do Produto</Label>
                    <Input
                        type="text"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        placeholder="Ex: nome produto"
                        required
                    />
                </Campo>
                <Campo>
                    <Label>Descrição</Label>
                    <Input
                        type="text"
                        name="descricao"
                        value={form.descricao}
                        onChange={handleChange}
                        placeholder="Descrição"
                        required
                    />
                </Campo>
                <Campo>
                    <Label>Preço (R$)</Label>
                    <Input
                        type="number"
                        name="preco"
                        value={form.preco}
                        onChange={handleChange}
                        placeholder="1.99"
                        step="0.01"
                        required
                    />
                </Campo>
                <Campo>
                    <Label>Estoque</Label>
                    <Input
                        type="number"
                        name="estoque"
                        value={form.estoque}
                        onChange={handleChange}
                        placeholder="100"
                        required
                    />
                </Campo>
                <BotaoAtualizar type="submit">Atualizar Produto</BotaoAtualizar>
                {mensagem && <Mensagem error={error}>{mensagem}</Mensagem>}
            </Form>
        </EditarProdutoContainer>
    );
}

// estilo


const EditarProdutoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    background-color: #f5f5f5;
    min-height: 80vh;
`;

const Form = styled.form`
    background-color: #FFF;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
`;

const Titulo = styled.h2`
    text-align: center;
    margin-bottom: 20px;
    color: #002F52;
`;

const Campo = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 20px;
    border: 1px solid #CCC;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 16px;
`;

const BotaoAtualizar = styled.button`
    width: 100%;
    background-color: #00A8E8;
    color: white;
    padding: 14px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;

    &:hover {
        background-color: #008dc7;
    }
`;

const Mensagem = styled.p`
    text-align: center;
    font-size: 18px;
    color: ${props => props.error ? 'red' : 'green'};
    margin-top: 20px;
`;


export default EditarProduto;