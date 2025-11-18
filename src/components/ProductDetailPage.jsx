import React, { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { products } from './dummyData';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './ProductDetailPage.css'; 

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  
  // --- ESTADOS ---
  const [selectedOption, setSelectedOption] = useState(null);
  const [cep, setCep] = useState(''); 
  const [address, setAddress] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const product = products.find(p => p.id == id);

  if (!product) {
    return <div>Produto não encontrado!</div>;
  }
  
  const handleBackClick = () => {
    navigate(-1);
  };

  // --- FUNÇÃO DE BUSCA DA API ---
  const handleCepSearch = async () => {
    setAddress(null);
    setError(null);
    
    if (cep.length < 8) {
      setError("CEP inválido.");
      return;
    }

    setIsLoading(true); 

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError("CEP não encontrado.");
        setAddress(null);
      } else {
        setAddress(data);
      }
    } catch (e) {
      setError("Erro na conexão.");
    }

    setIsLoading(false); 
  };


  const formattedPrice = `R$ ${product.price.toFixed(2).replace('.', ',')}`;

  return (
    <div className="detail-page-container">
      
      {/* 1. CABEÇALHO */}
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

      {/* 2. CORPO (CONTEÚDO RESTAURADO AQUI) */}
      <Container className="detail-body my-4">
        <Row>
          {/* Coluna da Esquerda: Imagem e Preço */}
          <Col md={6} className="d-flex flex-column align-items-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-image-detail" 
            />
            <div className="product-price-large mt-3">
              {formattedPrice}
            </div>
          </Col>

          {/* Coluna da Direita: Descrição e Opções */}
          <Col md={6}>
            <div className="product-description">
              <h2 className="cursive-font desc-title">Descrição:</h2>
              <p className="desc-text">{product.description}</p>
            </div>

            {/* Lógica de Bebidas (Opções) */}
            {product.options && product.options.length > 0 && (
              <div className="product-options">
                <Form>
                  {product.options.map((option, index) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      id={`option-${index}`}
                      name="drink-option"
                      label={option}
                      value={option}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="option-label"
                    />
                  ))}
                </Form>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* 3. RODAPÉ (COM ENDEREÇO COMPLETO) */}
      <footer className="detail-footer">
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={7}>
              <div className="cep-section">
                
                <Form.Group controlId="cepInput" className="cep-input-group">
                  <Form.Label>CEP:</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="00000000"
                    maxLength={8} 
                    value={cep} 
                    onChange={(e) => setCep(e.target.value)} 
                  />
                </Form.Group>
                
                <Button 
                  variant="success" 
                  className="cep-button"
                  onClick={handleCepSearch} 
                  disabled={isLoading}
                >
                  {isLoading ? '...' : 'Buscar'}
                </Button>
                
                <div className="address-display">
                  
                  {isLoading && <span>Buscando endereço...</span>}
                  
                  {error && <span className="cep-error">{error}</span>}
                  
                  {/* AQUI ESTÁ A CORREÇÃO DO ENDEREÇO */}
                  {address && (
                    <div style={{ lineHeight: '1.2' }}>
                      {/* Linha 1: Rua e Bairro */}
                      <span style={{ display: 'block', fontWeight: 'bold' }}>
                        {address.logradouro} {address.bairro ? `- ${address.bairro}` : ''}
                      </span>
                      {/* Linha 2: Cidade, UF e CEP */}
                      <span style={{ display: 'block' }}>
                        {address.localidade} / {address.uf} - {address.cep}
                      </span>
                    </div>
                  )}

                  {!address && !isLoading && !error && (
                    <div style={{ lineHeight: '1.2' }}>
                      <span style={{ display: 'block', fontWeight: 'bold' }}>Endereço Completo</span>
                      <span style={{ display: 'block' }}>Cidade/UF - CEP</span>
                    </div>
                  )}
                </div>
              </div>
            </Col>
            
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