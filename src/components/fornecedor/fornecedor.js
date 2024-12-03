import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Icon from '../../imagens/icones/fornecedorIcone.svg';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('fornecedoresToken')}`
  }
});

const corFornecedor = '#F19E39';

function Fornecedores() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [mensagem, setMensagem] = useState('');
  const [error, setError] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const { name, email, password } = form;

  const handleToggle = () => {
    setIsRegister(!isRegister);
    setForm({ name: '', email: '', password: '' });
    setMensagem('');
    setError(false);
  };

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const fetchFornecedores = async () => {
    try {
      const response = await api.get('/fornecedor');
      setFornecedores(response.data);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
      setMensagem('Erro ao carregar fornecedores.');
      setError(true);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        if (!name || !email || !password) {
          setMensagem('Preencha todos os campos obrigatórios.');
          setError(true);
          return;
        }
        await api.post('/fornecedor/register', { name, email, password });
        setMensagem('Cadastro realizado com sucesso!');
        setError(false);
        setForm({ name: '', email: '', password: '' });
        fetchFornecedores();
      } else {
        if (!email || !password) {
          setMensagem('Preencha todos os campos obrigatórios.');
          setError(true);
          return;
        }

        const res = await api.post('/fornecedor/login', { email, password });
        localStorage.setItem('fornecedoresToken', res.data.token);
        localStorage.removeItem('token');
        setMensagem('Login realizado com sucesso!');
        setError(false);
        window.location.reload();
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao realizar a operação, verifique a senha.');
      setError(true);
    }
  };

  return (
    <Container>
      <AuthContainer>
        <Icone><img src={Icon} alt="Fornecedores Icone" /></Icone>
        <Title> Fornecedores {isRegister ? 'Cadastro' : 'Login'}</Title>
        <ToggleContainer>
          <ToggleButton isActive={isRegister} onClick={handleToggle}>
            Cadastro
          </ToggleButton>
          <ToggleButton isActive={!isRegister} onClick={handleToggle}>
            Login
          </ToggleButton>
        </ToggleContainer>
        <Form onSubmit={handleSubmit}>
            <FieldsContainer>
                {isRegister && (
                <Field>
                    <Label>Nome</Label>
                    <Input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nome do Fornecedor"
                    required
                    />
                </Field>
                )}
                <Field>
                <Label>Email</Label>
                <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@exemplo.com"
                    required
                />
                </Field>
                <Field>
                  <Label>Senha de 6 Digitos</Label>
                  <Input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="******"
                      required
                  />
                </Field>
            </FieldsContainer>
            <Button type="submit">{isRegister ? 'Cadastrar' : 'Entrar'}</Button>
            {mensagem && <Message error={error}>{mensagem}</Message>}
        </Form>
      </AuthContainer>
      <FornecedoresList>
        <TitleList>Todos Fornecedores Cadastrados</TitleList>
        {fornecedores.length > 0 && (
          fornecedores.map((fornecedor) => (
            <FornecedorItem key={fornecedor.id}>
              <ul>
              <li><b>{fornecedor.name}</b>  ({fornecedor.email})</li>
              </ul>
            </FornecedorItem>
          ))
        )}
        {fornecedores.length === 0 && (
            <Mensagem>
              <p>Nenhum  <span style={{ color: corFornecedor }}><b>fornecedor</b></span> cadastrado no sistema...</p>
              <p>Cadastre-se como <span style={{ color: corFornecedor }}><b>fornecedor</b></span> para cadastrar novos produtos!</p>
            </Mensagem>
        )}
      </FornecedoresList>
    </Container>
  );
}

const Mensagem = styled.p`
  font-size: 20px;
  text-align: center;
  margin-top: 50px;
`;

const Icone = styled.div`
  cursor: pointer;
  align: center;
  padding-left: 330px;
  margin: 10px;
  width: 60px;
  height: 60px;

  img {
    width: 100%;
    height: 100%;
  }

`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  max-width: 90%;
  min-height: 80vh;
  margin: 40px auto;
  display: flex;
  justify-content: space-between;
`;

const AuthContainer = styled.div`
  background-color: #f9f9f9;
  padding: 40px;
  padding-bottom: 40px;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 50%;
`;
const Title = styled.h2`
  text-align: center;
  color: #333333;
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 24px;
`;

const TitleList = styled.h2`
  text-align: center;
  color: #434343;
  font-weight: bold;
  margin-bottom: 30px;
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
  border-bottom: ${(props) => (props.isActive ? '2px solid #F19E39' : 'none')};
  color: ${(props) => (props.isActive ? '#F19E39' : '#ECB576')};
  font-size: 16px;
  padding: 10px;
  font-weight: ${(props) => (props.isActive ? 'bold' : 'normal')};
  cursor: pointer;
  transition: color 0.3s, border-bottom 0.3s;
  &:hover {
    color: #F19E39;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Field = styled.div`
  margin-bottom: 10px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  padding: 12px;
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  &:focus {
    border-color: #0073e6;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #ECB576;
  color: #ffffff;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #F19E39;
  }
`;

const Message = styled.p`
  color: ${(props) => (props.error ? '#d9534f' : '#5cb85c')};
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
`;

const FornecedoresList = styled.div`
  width: 40%;
  margin-left: 0px;
  overflow-y: auto;
  padding: 20px;
  height: 400px;
  background-color: #f1f1f1;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
`;

const FornecedorItem = styled.div`
  padding: 2px;
  text-align: center;
  background-color: #f1f1f1;
  margin-bottom: 3px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
`;

export default Fornecedores