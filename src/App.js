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
import AtualizarProduto from './components/produto/editarProduto';

import Header from './components/header/header';
import Footer from './components/footer/footer';

import { ProdutoProvider } from './context/produtoContext';
import { CarrinhoProvider } from './context/carrinhoContext';
import { AuthProvider, AuthContext } from './context/authContext';

import styled from 'styled-components';

const TemQueLogarUsuario = ({ children }) => {
  const { isAuthenticated, isUsuario } = useContext(AuthContext);
  if(!isAuthenticated){
    return <MensagemDeErro mensagem="Você precisa estar logado para acessar esta página." />;
  }else if(!isUsuario){
    return <MensagemDeErro mensagem="Somente usuarios podem acessar esta página, por favor crie uma conta como usuario." />;
  }
  return children;
};

const TemQueLogarFornecedor = ({ children }) => {
  const { isAuthenticated, isFornecedor } = useContext(AuthContext);
  if(!isAuthenticated ){
    return <MensagemDeErro mensagem="Você precisa estar logado como  para acessar esta página." />;
  }else if(!isFornecedor){
    return <MensagemDeErro mensagem="Somente fornecedores podem acessar esta página." />;
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

                {/* precisa logar como usuario*/}
                <Route path="/carrinho" element={
                  <TemQueLogarUsuario>
                    <Carrinho />
                  </TemQueLogarUsuario>
                } />

                {/* precisa logar como fornecedor */}
                <Route path="/adicionar-produto" element={
                  <TemQueLogarFornecedor>
                    <AdicionarProduto/> 
                  </TemQueLogarFornecedor>
                } />
                <Route path="/editar-produto/:id" element={
                  <TemQueLogarFornecedor>
                    <AtualizarProduto/> 
                  </TemQueLogarFornecedor>
                } />
              </Routes>
            </AppContainer>
            <Footer/>
          </CarrinhoProvider>
        </ProdutoProvider>
      </AuthProvider>
    </Router>
  );
}

const AppContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    background-image: linear-gradient(90deg,#002F52 35%,#326589 165%);
`;

export default App;
