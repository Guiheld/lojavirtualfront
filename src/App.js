import './App.css';
import React from 'react';
import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Auth from './components/auth/auth'; 
import AdicionarProduto from './components/produto/adicionarProduto';
import TestConnection from './components/backendTest/testarComunicacao';
import TodosOsProdutos from './components/home/homeTodosProdutos';
import Carrinho from './components/carrinho/carrinho';
import MensagemDeErro from './components/mensagemErro/mensagemErro';
import Fornecedor from './components/fornecedor/fornecedor';

import Header from './components/header/header';

import { ProdutoProvider } from './context/produtoContext';
import { CarrinhoProvider } from './context/carrinhoContext';
import { AuthProvider, AuthContext } from './context/authContext';

import styled from 'styled-components';

const TemQueLogar = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  if(!isAuthenticated){
    return <MensagemDeErro mensagem="Você precisa estar logado para acessar esta página." />;
  }
  return children;
};

function App() {
  <TestConnection/>
  return (
    <Router>
      <AuthProvider>
        <ProdutoProvider>
          <CarrinhoProvider>
            <AppContainer>
              <Header/>
              <Routes>

                {/* nao precisa logar */}
                <Route path="/" element={<TodosOsProdutos />} />
                <Route path="/cadastro" element={<Auth />} /> 
                <Route path="/fornecedores" element={<Fornecedor />} />

                {/* precisa logar */}
                <Route path="/adicionar-produto" element={
                  <TemQueLogar>
                    <AdicionarProduto/> 
                  </TemQueLogar>
                } />
                <Route path="/carrinho" element={
                  <TemQueLogar>
                    <Carrinho />
                  </TemQueLogar>
                } />

              </Routes>
            </AppContainer>
          </CarrinhoProvider>
        </ProdutoProvider>
      </AuthProvider>
    </Router>
  );
}

const AppContainer = styled.div`
    width: 100vw;
    min-height: 100vh;
    background-image: linear-gradient(90deg,#002F52 35%,#326589 165%);
`;

export default App;
