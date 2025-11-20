import React, { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { products } from './dummyData';
// 1. IMPORTAMOS O 'Modal' AQUI
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
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

  // 2. NOVOS ESTADOS PARA O MODAL DE COMPRA
  const [showModal, setShowModal] = useState(false); // Controla se o modal está aberto
  const [purchaseSuccess, setPurchaseSuccess] = useState(false); // Controla a mensagem de "Obrigado"

  const product = products.find(p => p.id == id);

  if (!product) {
    return <div>Produto não encontrado!</div>;
  }
  
  const handleBackClick = () => {
    navigate(-1);
  };

  const formattedPrice = `R$ ${product.price.toFixed(2).replace('.', ',')}`;

  // --- FUNÇÃO DE BUSCA DE CEP ---
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

  // --- 3. FUNÇÕES DO BOTÃO COMPRAR ---

  const handleBuyClick = () => {
    // Validação: Só abre se tiver endereço
    if (!address) {
      alert("Por favor, busque o CEP para calcularmos a entrega!");
      return;
    }
    // Abre o modal
    setShowModal(true);
  };

  const handleConfirmPurchase = () => {
    // Muda o estado para mostrar a mensagem de "Obrigado"
    setPurchaseSuccess(true);

    // Espera 2.5 segundos e volta para a Home
    setTimeout(() => {
      navigate('/');
    }, 2500);
  };

  const handleCloseModal = () => {
    // Se clicar em "Não", apenas fecha o modal e reseta o sucesso
    setShowModal(false);
    setPurchaseSuccess(false);
  };

  return (
    <div className="detail-page-container">
      
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
        <Row>
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

          <Col md={6}>
            <div className="product-description">
              <h2 className="cursive-font desc-title">Descrição:</h2>
              <p className="desc-text">{product.description}</p>
            </div>

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
                  {address && (
                    <div style={{ lineHeight: '1.2' }}>
                      <span style={{ display: 'block', fontWeight: 'bold' }}>
                        {address.logradouro} {address.bairro ? `- ${address.bairro}` : ''}
                      </span>
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
              {/* BOTÃO AGORA CHAMA A FUNÇÃO handleBuyClick */}
              <Button 
                variant="success" 
                className="buy-button"
                onClick={handleBuyClick}
              >
                COMPRAR
              </Button>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* --- 4. COMPONENTE MODAL (O CARD DE CONFIRMAÇÃO) --- */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        
        {/* CONTEÚDO A: Confirmação do Pedido */}
        {!purchaseSuccess && (
          <>
            <Modal.Header closeButton className="modal-header-custom">
              <Modal.Title>Confirmar Pedido</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
              <h5>Produto:</h5>
              <p>{product.name} {selectedOption ? `(${selectedOption})` : ''}</p>
              
              <h5>Valor:</h5>
              <p className="fw-bold text-success">{formattedPrice}</p>
              
              <h5>Endereço de Entrega:</h5>
              {address && (
                <p className="small text-muted">
                  {address.logradouro}, {address.bairro}<br/>
                  {address.localidade} / {address.uf}
                </p>
              )}
              <hr/>
              <p className="text-center mb-0">Deseja finalizar a compra?</p>
            </Modal.Body>
            <Modal.Footer className="modal-footer-custom">
              <Button variant="secondary" onClick={handleCloseModal}>
                Não
              </Button>
              <Button variant="success" onClick={handleConfirmPurchase}>
                Sim
              </Button>
            </Modal.Footer>
          </>
        )}

        {/* CONTEÚDO B: Mensagem de Sucesso */}
        {purchaseSuccess && (
          <Modal.Body className="text-center py-5">
            <h2 className="text-success mb-3">✅</h2>
            <h4>Obrigado por comprar conosco!</h4>
            <p>Seu pedido está sendo preparado.</p>
            <p className="small text-muted">Voltando para o início...</p>
          </Modal.Body>
        )}

      </Modal>

    </div>
  );
};

export default ProductDetailPage;