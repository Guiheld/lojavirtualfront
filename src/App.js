import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './components/auth/auth'; 
import AdicionarProduto from './components/produto/adicionarProduto';
import TestConnection from './components/backendTest/testarComunicacao';
import TodosOsProdutos from './components/home/homeTodosProdutos';

import Header from './components/header/header';

import { ProdutoProvider } from './context/produtoContext';
import { CarrinhoProvider } from './context/carrinhoContext';

import styled from 'styled-components';


function App() {
  <TestConnection/>
  return (
    <Router>
      <ProdutoProvider>
        <CarrinhoProvider>
          <AppContainer>
            <Header/>
            <Routes>
              <Route path="/cadastro" element={<Auth />} /> {}
              <Route path="/adicionar-produto" element={<AdicionarProduto />} />
              <Route path="/" element={<TodosOsProdutos />} />
            </Routes>
          </AppContainer>
        </CarrinhoProvider>
      </ProdutoProvider>
    </Router>
  );
}

const AppContainer = styled.div`
    width: 100vw;
    min-height: 100vh;
    background-image: linear-gradient(90deg,#002F52 35%,#326589 165%);
`;

export default App;
