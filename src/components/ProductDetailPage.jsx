// O 'useState' já deve estar aqui
import React, { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { products } from './dummyData';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './ProductDetailPage.css'; 

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  
  // --- ESTADOS EXISTENTES ---
  const [selectedOption, setSelectedOption] = useState(null);
  
  // --- 1. NOVOS ESTADOS PARA O CEP ---
  const [cep, setCep] = useState(''); // Guarda o CEP digitado
  const [address, setAddress] = useState(null); // Guarda a resposta da API
  const [isLoading, setIsLoading] = useState(false); // Feedback de "carregando"
  const [error, setError] = useState(null); // Guarda mensagens de erro

  
  const product = products.find(p => p.id == id);

  if (!product) {
    return <div>Produto não encontrado!</div>;
  }
  
  const handleBackClick = () => {
    navigate(-1);
  };

  // --- 2. NOVA FUNÇÃO DE BUSCA DA API ---
  const handleCepSearch = async () => {
    // Limpa estados anteriores
    setAddress(null);
    setError(null);
    
    // Validação simples
    if (cep.length < 8) {
      setError("Por favor, digite um CEP válido.");
      return;
    }

    setIsLoading(true); // Inicia o "carregando"

    try {
      // Chama a API ViaCEP (JSON)
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      // ViaCEP retorna 'erro: true' se não encontrar
      if (data.erro) {
        setError("CEP não encontrado.");
        setAddress(null);
      } else {
        // Sucesso! Guarda o endereço no 'state'
        setAddress(data);
      }
    } catch (e) {
      setError("Falha ao conectar com a API. Tente novamente.");
    }

    setIsLoading(false); // Termina o "carregando"
  };


  const formattedPrice = `R$ ${product.price.toFixed(2).replace('.', ',')}`;

  return (
    <div className="detail-page-container">
      
      {/* ... (Seu Header e Body continuam iguais) ... */}
      <header className="detail-header">
        <Button 
          variant="outline-light" 
          className="back-button" 
          onClick={handleBackClick}
        >
          &larr; Voltar
        </Button>
        <h1 className="cursive-font">{product.name}</h1>
      </header>

      <Container className="detail-body my-4">
        {/* ... (Código da Imagem, Descrição, Opções de Bebida, etc.) ... */}
      </Container>

      {/* --- 3. ATUALIZANDO O JSX DO RODAPÉ --- */}
      <footer className="detail-footer">
        <Container>
          <Row className="align-items-center">
            {/* Seção do CEP */}
            <Col xs={12} md={7}>
              {/* Note que mudamos 'Form' para 'div' para evitar o submit */}
              <div className="cep-section">
                
                <Form.Group controlId="cepInput" className="cep-input-group">
                  <Form.Label>CEP:</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="00000000"
                    maxLength={8} // Limita o input
                    value={cep} // Conecta ao state 'cep'
                    onChange={(e) => setCep(e.target.value)} // Atualiza o state
                  />
                </Form.Group>
                
                <Button 
                  variant="success" 
                  className="cep-button"
                  onClick={handleCepSearch} // Chama a função de busca
                  disabled={isLoading} // Desativa o botão enquanto carrega
                >
                  {isLoading ? 'Buscando...' : 'Buscar'}
                </Button>
                
                <div className="address-display">
                  <strong>Endereço:</strong>
                  
                  {/* --- LÓGICA DE EXIBIÇÃO DINÂMICA --- */}
                  {isLoading && <span>Carregando...</span>}
                  
                  {error && <span className="cep-error">{error}</span>}
                  
                  {address && (
                    <>
                      <span>{address.localidade} / {address.uf}</span>
                      <span>{address.cep}</span>
                    </>
                  )}

                  {!address && !isLoading && !error && (
                    <>
                      <span>Cidade/Estado</span>
                      <span>CEP</span>
                    </>
                  )}
                </div>
              </div>
            </Col>
            
            {/* Seção do Botão Comprar */}
            <Col xs={12} md={5} className="text-md-end mt-3 mt-md-0">
              <Button variant="success" className="buy-button">COMPRAR</Button>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default ProductDetailPage;