import React from 'react';
import { Card } from 'react-bootstrap';
import './ProductCard.css'; // Importa nosso CSS (agora mais forte)

// Recebe um 'product' como propriedade
const ProductCard = ({ product }) => {

  // Formata o preço para R$ 00,00
  const formattedPrice = `R$ ${product.price.toFixed(2).replace('.', ',')}`;

  return (
    // 1. O card principal tem a classe 'product-card'
    <Card className="product-card">
      
      {/* 2. O Header não precisa de classe customizada. 
         Nosso CSS vai estilizá-lo automaticamente. */}
      <Card.Header as="h5">
        {product.category}
      </Card.Header>

      {/* 3. O placeholder da imagem */}
      <div className="card-image-placeholder">
        (Foto)
      </div>

      {/* 4. O Footer também não precisa de classe customizada. */}
      <Card.Footer>
        <div className="product-name">{product.name}</div>
        <div className="product-price">{formattedPrice}</div>
      </Card.Footer>

    </Card>
  );
};

export default ProductCard;