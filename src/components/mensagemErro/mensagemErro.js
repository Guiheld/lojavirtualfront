import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import errorAcessIcon from '../../imagens/icones/errorAcess.svg';

const MensagemDeErro = ({ mensagem }) => {
    return (
        <MensagemWrapper>
            <MensagemCaixa>
                <img src={errorAcessIcon} alt="Erro de Acesso" />
                <MensagemTexto>{mensagem}</MensagemTexto>
                <Link to="/cadastro">
                    <Botao>Fazer Login</Botao>
                </Link>
            </MensagemCaixa>
        </MensagemWrapper>
    );
};

const MensagemWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    margin: 20px auto;
    max-width: 600px;
    border: 1px solid #ffccd5;
    border-radius: 8px;
    background-color: #fff3f5;
`;

const MensagemCaixa = styled.div`
    text-align: center;
`;

const MensagemTexto = styled.p`
    font-size: 16px;
    color: #d90429;
    margin-bottom: 30px;
`;

const Botao = styled.button`
    background-color: #d90429;
    color: #ffffff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
        background-color: #c20225;
    }
`;

export default MensagemDeErro;
