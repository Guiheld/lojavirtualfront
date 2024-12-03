import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import perfil from '../../imagens/icones/accountCircle.svg';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: ''
    });
    setMessage('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isLogin) {
        const response = await api.post('/users/login', {
          email: formData.email,
          password: formData.password
        });
        setMessage('Login bem-sucedido!');
        localStorage.setItem('token', response.data.token);
        localStorage.removeItem('fornecedoresToken');
        navigate('/');
      } else {
        const response = await api.post('/users/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        setMessage('Cadastro bem-sucedido! Faça login.');
        setIsLogin(true);
      }
      window.location.reload();
    } catch (error) {
      console.error('Erro na autenticação:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Ocorreu um erro. Tente novamente.');
      }
    }
  };

  return (
    <Container>
      <Icone><img src={perfil} alt="Account User Icon" /></Icone>
      <Title>{isLogin ? 'Login' : 'Cadastro'}</Title>
      <ToggleContainer>
        <ToggleButton isActive={isLogin} onClick={handleToggle}>
          Login
        </ToggleButton>
        <ToggleButton isActive={!isLogin} onClick={handleToggle}>
          Cadastro
        </ToggleButton>
      </ToggleContainer>
      <Form onSubmit={handleSubmit}>
        {!isLogin && (
          <Input
            type="text"
            name="name"
            placeholder="Nome"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <SubmitButton type="submit">
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </SubmitButton>
      </Form>
      {message && <Message error={message.toLowerCase().includes('erro')}>{message}</Message>}
    </Container>
  );
};

// Estilo 

const Icone = styled.div`
  cursor: pointer;
  align: center;
  padding-left: 167px;
  margin: 10px;
  width: 50px;
  height: 50px;

  img {
    width: 100%;
    height: 100%;
  }

`;

const Container = styled.div`
  max-width: 400px;
  margin: 80px auto;
  background-color: #f9f9f9;
  padding: 40px;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333333;
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 24px;
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid #d1d1d1;
  padding-bottom: 10px;
`;

const ToggleButton = styled.button`
  flex: 1;
  background: none;
  border: none;
  border-bottom: ${(props) => (props.isActive ? '2px solid #0073e6' : 'none')};
  color: ${(props) => (props.isActive ? '#0073e6' : '#666666')};
  font-size: 16px;
  padding: 10px;
  font-weight: ${(props) => (props.isActive ? 'bold' : 'normal')};
  cursor: pointer;
  transition: color 0.3s, border-bottom 0.3s;
  &:hover {
    color: #0073e6;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  &:focus {
    border-color: #0073e6;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background-color: #0073e6;
  color: #ffffff;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #005bb5;
  }
`;

const Message = styled.p`
  color: ${(props) => (props.error ? '#d9534f' : '#5cb85c')};
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
`;

export default Auth;
