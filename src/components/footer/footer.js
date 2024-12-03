import styled from 'styled-components';

const corUsuario = '#3498db';

function Footer() {
  return (
    <Home>
      <div>
        <InfoDesenvolvedor>
          <p>
            Cadastre-se como um usuário para abrir o seu carrinho e realizar compras! 
            <br></br>
            <br></br>
            Ou, cadastre-se como fornecedor para criar, editar ou remover produtos.
            <br></br>
            <br></br>
          </p>
        </InfoDesenvolvedor>
      </div>
      <InfoDesenvolvedor>
        Desenvolvido por <b>Guilherme Azevedo Held</b> | 
        <LinkIcon  href="https://www.linkedin.com/in/guilherme-azevedo-held-b06900289/">
          <i className="fas fa-external-link-alt"></i> Visitar site
        </LinkIcon>
      </InfoDesenvolvedor>
    </Home>
  );
}

const Home = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
`;

const InfoDesenvolvedor = styled.div`
  font-size: 12px;
  color: #999;
  text-align: right;
`;

const LinkIcon = styled.a`
  text-decoration: none;
  color: ${corUsuario};
  transition: color 0.2s;

  &:hover {
    color: #87CEEB; /* Azul mais claro */
  }

  i {
    margin-right: 5px;
  }
`;

export default Footer;