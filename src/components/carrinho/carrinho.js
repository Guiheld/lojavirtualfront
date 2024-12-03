import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { CarrinhoContext } from '../../context/carrinhoContext';
import axios from 'axios'; // Importando axios
import deleteIcon from '../../imagens/icones/removeProduto.svg';

const api = axios.create({
  baseURL: 'http://localhost:8080', // URL do seu backend
});

function Carrinho() {
    const { carrinhoItems, removeFromCarrinho, clearCarrinho } = useContext(CarrinhoContext);
    const [metodoPagamento, setMetodoPagamento] = useState('credit-card');
    const [form, setForm] = useState({
        numeroCartao: '',
        cvv: '',
        dataValidade: '',
        pix: ''
    });
    const [mensagem, setMensagem] = useState('');

    const valorTotal = carrinhoItems.reduce((acc, item) => acc + item.total, 0);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (metodoPagamento === 'credit-card') {
                const { numeroCartao, cvv, dataValidade } = form;
                if (!numeroCartao || !cvv || !dataValidade) {
                    setMensagem('Por favor, preencha todos os campos do cartão.');
                    return;
                }
                const response = await api.post('/payment/credit-card', {
                    valorTotal,
                    numeroCartao,
                    cvv,
                    dataValidade
                });
                if (response.status === 201) {
                    setMensagem('Pagamento com cartão de crédito realizado com sucesso!');
                    clearCarrinho(); // Nome correto
                }
            } else if (metodoPagamento === 'pix') {
                const { pix } = form;
                if (!pix) {
                    setMensagem('Por favor, insira o código PIX.');
                    return;
                }
                const response = await api.post('/payment/pix', {
                    valorTotal,
                    pix
                });
                if (response.status === 201) {
                    setMensagem('Pagamento via PIX realizado com sucesso!');
                    clearCarrinho(); // Nome correto
                }
            }
        } catch (error) {
            console.error('Obrigado por testar!. Pagamento nao incluido na entrega.', error);
            setMensagem('Obrigado por testar!. Pagamento nao incluido na entrega.');
        }
    };

    return (
        <CarrinhoContainer>
            {carrinhoItems.length === 0 ? (
                <TituloCarrinho>Seu Carrinho de Compras esta vazio! </TituloCarrinho>
            ) : (
                <>
                    <div>
                        <TituloCarrinho>Seu Carrinho de Compras</TituloCarrinho>
                        <CarrinhoListaContainer>
                            <ListaCarrinho>
                                {carrinhoItems.map(item => (
                                    <ItemCarrinho key={item.id}>
                                    <NomeLivro><b>{item.nome}</b></NomeLivro>
                                    <div className="info">
                                      <Icone onClick={() => removeFromCarrinho(item.id)}><img src={deleteIcon} alt="Remover Produto" /></Icone>
                                      <PrecoProduto>R$ {item.preco.toFixed(2)}</PrecoProduto>
                                    </div>
                                  </ItemCarrinho>
                                ))}
                            </ListaCarrinho>
                            <hr></hr>
                            <Total><b>Total</b>: R$ {valorTotal.toFixed(2)}</Total>
                        </CarrinhoListaContainer>
                    </div>
                    <div>
                    <TituloCarrinho>Pagamento</TituloCarrinho>
                        <FormPagamento onSubmit={handleSubmit}>
                            <h3>Processar Pagamento</h3>
                            <Campo>
                                <select
                                    value={metodoPagamento}
                                    onChange={(e) => setMetodoPagamento(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #CCC' }}
                                >
                                    <option value="credit-card">Cartão de Crédito/Debito</option>
                                    <option value="pix">PIX</option>
                                </select>
                            </Campo>
                            {metodoPagamento === 'credit-card' && (
                                <>
                                    <Campo>
                                        <Label>Número do Cartão</Label>
                                        <Input
                                            type="text"
                                            name="numeroCartao"
                                            value={form.numeroCartao}
                                            onChange={handleChange}
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            required
                                        />
                                    </Campo>
                                    <Campo>
                                        <Label>CVV</Label>
                                        <Input
                                            type="text"
                                            name="cvv"
                                            value={form.cvv}
                                            onChange={handleChange}
                                            placeholder="XXX"
                                            required
                                        />
                                    </Campo>
                                    <Campo>
                                        <Label>Data de Validade</Label>
                                        <Input
                                            type="text"
                                            name="dataValidade"
                                            value={form.dataValidade}
                                            onChange={handleChange}
                                            placeholder="MM/AA"
                                            required
                                        />
                                    </Campo>
                                </>
                            )}
                            {metodoPagamento === 'pix' && (
                                <Campo>
                                    <Label>Código PIX</Label>
                                    <Input
                                        type="text"
                                        name="pix"
                                        value={form.pix}
                                        onChange={handleChange}
                                        placeholder="Insira o código PIX"
                                        required
                                    />
                                </Campo>
                            )}
                            <BotaoPagamento type="submit">Confirmar Pagamento</BotaoPagamento>
                            {mensagem && <Mensagem>{mensagem}</Mensagem>}
                        </FormPagamento>
                    </div>
                </>
            )}
        </CarrinhoContainer>
    );
}

// - estilos da pagina

const Icone = styled.div`
  cursor: pointer;
  margin: 10px;
  width: 30px;
  height: 30px;

  img {
    width: 100%;
    height: 100%;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const CarrinhoContainer = styled.div`
  padding: 40px;
  background-color: #ebecee;
  min-height: 80vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const CarrinhoListaContainer = styled.div`
  background-color: #FFF;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 60vh;
`;

const ListaCarrinho = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TituloCarrinho = styled.h2`
    color: #434343;
    font-size: 36px;
    text-align: center;
    margin-bottom: 50px;
`;

const ItemCarrinho = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFF;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  
  .info {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }
`;

const NomeLivro = styled.p`
    font-size: 18px;
    margin: 0;
`;
const PrecoProduto = styled.p`
    text-align: right;
    font-size: 18px;
    margin: 0;
`;

const BotaoRemover = styled.button`
    background-color: #FF4C4C;
    color: #FFF;
    border: none;
    padding: 6px 8px;
    border-radius: 12px;
    cursor: pointer;
    margin-left: 10px;

    &:hover {
        background-color: #d83a3a;
    }
`;

const Total = styled.div`
    text-align: right;
    font-size: 20px;
    margin-bottom: 30px;
`;

const FormPagamento = styled.form`
    background-color: #FFF;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 0 auto;
`;

const Campo = styled.div`
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
    border: 1px solid #CCC;
    border-radius: 5px;
    box-sizing: border-box;
`;

const BotaoPagamento = styled.button`
    width: 100%;
    background-color: #EB9B00;
    color: #FFF;
    padding: 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;

    &:hover {
        background-color: #d88e00;
    }
`;

const Mensagem = styled.p`
    text-align: center;
    font-size: 18px;
    color: green;
    margin-top: 20px;
`;

export default Carrinho;