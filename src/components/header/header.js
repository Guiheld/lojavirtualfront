import styled from 'styled-components';

import perfil from '../../imagens/icones/accountCircle.svg';
import sacola from '../../imagens/icones/carrin.svg';
import adicionar from '../../imagens/icones/add.svg'; 
import home from '../../imagens/icones/home.svg'; 

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext'; // Importe o contexto

function Header() {
    const { user, isAuthenticated } = useContext(AuthContext); // Obtenha os dados do usuário

    return (
        <HeaderContainer>
            <UserInfo>
                {isAuthenticated ? (
                    <span>Bem-vindo, {user?.email || 'Usuário'}!</span>
                ) : (
                    <span>Olá, visitante!</span>
                )}
            </UserInfo>
            <IconesHeader />
        </HeaderContainer>
    );
}

function IconesHeader() {
    return (
        <Icones>
            <IconeAuth>
                <Link to="/cadastro">
                    <img src={perfil} alt="Perfil/Autenticação" />
                </Link>
            </IconeAuth>
            <Icone>
                <Link to="/carrinho">
                    <img src={sacola} alt="Carrinho" />
                </Link>
            </Icone>
            <Icone>
                <Link to="/adicionar-produto">
                    <img src={adicionar} alt="Adicionar Produto" />
                </Link>
            </Icone>
            <Icone>
                <Link to="/">
                    <img src={home} alt="home" />
                </Link>
            </Icone>
        </Icones>
    );
}

// Estilo adicional para o nome do usuário
const UserInfo = styled.div`
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 14px;
    color: #333;
`;

const Icone = styled.li`
    margin-right: 40px;
    width: 25px;
    position: relative;
`;

const Icones = styled.ul`
    display: flex;
    align-items: center;
`;

const IconeAuth = styled.li`
    margin-right: 40px;
    width: 25px;
`;

const HeaderContainer = styled.header`
    background-color: #FFF;
    display: flex;
    justify-content: center;
    position: relative;
`;

export default Header;
