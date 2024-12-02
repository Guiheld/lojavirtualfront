import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import FornecedorCheck from './../fornecedor/fornecedorCheck';
import fornecedor from '../../imagens/icones/fornecedorIcone.svg';
import adicionar from '../../imagens/icones/add.svg';
import LogoutIcone from '../../imagens/icones/logoutIcon.svg';
import home from '../../imagens/icones/home.svg';
import sacola from '../../imagens/icones/carrin.svg';
import perfil from '../../imagens/icones/accountCircle.svg';

function Header() {
    const { user, isAuthenticated, logout } = useContext(AuthContext);

    // Usa o FornecedorCheck para verificar se o usuário logado é um fornecedor
    const isFornecedor = FornecedorCheck();

    useEffect(() => {
        console.log('isFornecedor:', isFornecedor); // Log para depuração
    }, [isFornecedor]);

    return (
        <HeaderContainer>
            <NavLeft>
                <IconesHeader isFornecedor={isFornecedor} />
                {isFornecedor && (
                    <FornecedorFunctions>
                        <Link to="/adicionar-produto">
                            <img src={adicionar} alt="Adicionar Produto" />
                            Adicionar Produto Como Fornecedor
                        </Link>
                    </FornecedorFunctions>
                )}
            </NavLeft>

            <UserInfo>
                {isAuthenticated ? (
                    <>
                        {isFornecedor ? (
                            <span>Bem-vindo, Fornecedor <b>{user?.name || user?.email || 'Usuário'}! </b></span>
                        ) : (
                            <span>Bem-vindo, <b>{user?.name || user?.email || 'Usuário'}!</b></span>
                        )}
                        <LogoutIcon onClick={logout}>
                            <img src={LogoutIcone} alt="Logout" />
                        </LogoutIcon>
                    </>
                ) : (
                    <span>Olá, visitante!</span>
                )}
            </UserInfo>
        </HeaderContainer>
    );
}

function IconesHeader({ isFornecedor }) {
    return (
        <Icones>
            <Icone>
                <Link to="/fornecedores">
                    <img src={fornecedor} alt="Fornecedor" />
                </Link>
            </Icone>
            <IconeAuth>
                <Link to="/cadastro">
                    <img src={perfil} alt="Perfil/Autenticação" />
                </Link>
            </IconeAuth>
            <IconeGroupRight>
                {/* Exibe o carrinho somente se não for fornecedor */}
                {!isFornecedor && (
                    <Icone>
                        <Link to="/carrinho">
                            <img src={sacola} alt="Carrinho" />
                        </Link>
                    </Icone>
                )}
                <Icone>
                    <Link to="/">
                        <img src={home} alt="Home" />
                    </Link>
                </Icone>
            </IconeGroupRight>
        </Icones>
    );
}

// Novo estilo para os ícones do lado direito
const IconeGroupRight = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
`;

const UserInfo = styled.div`
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 14px;
    color: #333;
`;

const NavLeft = styled.div`
    display: flex;
    align-items: center;
`;

const FornecedorFunctions = styled.div`
    margin-left: 20px;
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    a {
        display: flex;
        align-items: center;
        margin-right: 15px;
        color: #002f52;
        font-weight: bold;
        text-decoration: none;
    }

    img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
    }
`;

const Icone = styled.li`
    margin-right: 20px;
    width: 25px;
    position: relative;
`;

const IconeAuth = styled.li`
    margin-right: 20px;
    width: 25px;
`;

const Icones = styled.ul`
    display: flex;
    align-items: center;
    list-style-type: none;
    padding: 0;
    margin: 0;
`;

const HeaderContainer = styled.header`
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    position: relative;
    padding: 20px 40px;
`;

const LogoutIcon = styled.div`
    display: inline-block;
    margin-left: 10px;
    cursor: pointer;

    img {
        width: 20px;
        height: 20px;
    }

    &:hover {
        opacity: 0.7;
    }
`;

export default Header;
