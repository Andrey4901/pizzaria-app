import React from 'react';
import { Card } from 'react-bootstrap';
import './ProductCard.css'; // Importa nosso CSS customizado


// Recebe um 'product' como propriedade
const ProductCard = ({ product }) => {

  // Formata o preço para R$ 00,00
  const formattedPrice = `R$ ${product.price.toFixed(2).replace('.', ',')}`;

  return (
    // Usamos o Card do Bootstrap como base
    <Card className="product-card">
      
      {/* 1. Cabeçalho Customizado (Categoria) */}
      <Card.Header as="h5" className="card-header-custom">
        {product.category}
      </Card.Header>

      {/* 2. Corpo Customizado (Foto) */}
      {/* Aqui usaremos um placeholder. 
        No futuro, trocaríamos por: <Card.Img variant="top" src={product.image} />
      */}
      <div className="card-image-placeholder">
        (Foto)
      </div>

      {/* 3. Rodapé Customizado (Detalhes) */}
      <Card.Footer className="card-footer-custom">
        <div className="product-name">{product.name}</div>
        <div className="product-price">{formattedPrice}</div>
      </Card.Footer>

    </Card>
  );
};

export default ProductCard;