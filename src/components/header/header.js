import styled from 'styled-components'

import perfil from '../../imagens/icones/accountCircle.svg';
import sacola from '../../imagens/icones/carrin.svg';
import adicionar from '../../imagens/icones/add.svg'; 
import home from '../../imagens/icones/home.svg'; 

import { Link } from 'react-router-dom';
import { useContext } from 'react';

function Header() {
    return (
        <HeaderContainer>
            <IconesHeader/>
        </HeaderContainer>
    )
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
                <Link to="/home">
                    <img src={home} alt="home" />
                </Link>
            </Icone>
        </Icones>
    );
}

//estilo para o header

const Icone = styled.li`
    margin-right: 40px;
    width: 25px;
    position: relative;
`;

const Icones = styled.ul`
    display: flex;
    align-items: center;
`;

const Badge = styled.span`
    position: absolute;
    top: -5px;
    right: -10px;
    background-color: #FF4C4C;
    color: #FFF;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
`;

const IconeAuth = styled.li`
    margin-right: 40px;
    width: 25px;
`;

const HeaderContainer = styled.header`
    background-color: #FFF;
    display: flex;
    justify-content: center;
`;

export default Header