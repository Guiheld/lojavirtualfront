import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://localhost:8080', // Ajuste a URL do backend conforme necessário
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('fornecedoresToken')}`
    }
});

function Fornecedores() {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [mensagem, setMensagem] = useState('');
    const [error, setError] = useState(false);
    const [fornecedores, setFornecedores] = useState([]);

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
        const { name, email, password } = form;

        try {
            if (isRegister) {
                // Verifica se todos os campos obrigatórios estão preenchidos
                if (!name || !email || !password) {
                    setMensagem('Preencha todos os campos obrigatórios.');
                    setError(true);
                    return;
                }

                // Envia os dados para o backend para cadastro
                await api.post('/fornecedor/register', { name, email, password });
                setMensagem('Cadastro realizado com sucesso!');
                setError(false);
                setForm({ name: '', email: '', password: '' });
                fetchFornecedores();
            } else {
                // Verifica se os campos obrigatórios estão preenchidos
                if (!email || !password) {
                    setMensagem('Preencha todos os campos obrigatórios.');
                    setError(true);
                    return;
                }

                // Envia dados de login e armazena o token
                const res = await api.post('/fornecedor/login', { email, password });
                localStorage.setItem('fornecedoresToken', res.data.token);
                setMensagem('Login realizado com sucesso!');
                setError(false);
                window.location.reload();
                navigate('/'); // Redireciona para o dashboard após login
            }
        } catch (error) {
            console.error(error);
            setMensagem('Erro ao realizar a operação, verifique a senha.');
            setError(true);
        }
    };

    return (
        <Container>
            <FormSection>
                <Title>{isRegister ? 'Cadastro de Fornecedor' : 'Login de Fornecedor'}</Title>
                <form onSubmit={handleSubmit}>
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
                        <Label>Senha</Label>
                        <Input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Senha"
                            required
                        />
                    </Field>
                    <Button type="submit">{isRegister ? 'Cadastrar' : 'Entrar'}</Button>
                </form>
                <SwitchButton onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
                </SwitchButton>
                {mensagem && <Message error={error}>{mensagem}</Message>}
            </FormSection>

            <ListSection>
                <Title>Fornecedores Cadastrados</Title>
                {fornecedores.map(fornecedor => (
                    <FornecedorCard key={fornecedor.id}>
                        <FornecedorName>{fornecedor.name}</FornecedorName>
                        <FornecedorEmail>{fornecedor.email}</FornecedorEmail>
                    </FornecedorCard>
                ))}
            </ListSection>
        </Container>
    );
}

// Estilização com styled-components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    background-color: #f5f5f5;
    min-height: 100vh;
`;

const FormSection = styled.div`
    width: 100%;
    max-width: 400px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const ListSection = styled.div`
    width: 100%;
    max-width: 600px;
`;

const Title = styled.h2`
    color: #333;
    text-align: center;
`;

const Field = styled.div`
    margin-bottom: 15px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const SwitchButton = styled(Button)`
    background: transparent;
    color: #007bff;
    text-decoration: underline;
`;

const Message = styled.p`
    color: ${props => (props.error ? 'red' : 'green')};
    text-align: center;
`;

const FornecedorCard = styled.div`
    padding: 10px;
    background: white;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FornecedorName = styled.h4`
    color: #333;
    margin: 0;
`;

const FornecedorEmail = styled.p`
    color: #666;
    margin: 0;
`;

export default Fornecedores;
