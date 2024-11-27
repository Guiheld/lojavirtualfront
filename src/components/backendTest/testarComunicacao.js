import React, { useEffect, useState } from 'react';

const TestConnection = () => {
  const [message, setMessage] = useState('');

  // Função para realizar a requisição
  const testConnection = async () => {
    try {
      // Faz a requisição ao backend
      const response = await fetch('http://localhost:8080/api/teste');
      if (!response.ok) {
        throw new Error('Falha na resposta do backend');
      }
      
      // Converte a resposta para JSON
      const data = await response.json();

      // Atualiza o estado com a mensagem recebida
      setMessage(`Conexão bem-sucedida: ${data.message}`);
      console.log(`Mensagem do back: ${data.message}`);
    } catch (error) {
      console.error('Erro ao se conectar:', error);
      setMessage('Erro ao se conectar ao backend.');
    }
  };

  // Usa o useEffect para chamar a função automaticamente ao montar o componente
  useEffect(() => {
    testConnection(); // Chama a função de teste de conexão
  }, []);

  return (
    <div>
      <h1>Teste de Conexão</h1>
      <p>{message}</p>
    </div>
  );
};

export default TestConnection;
