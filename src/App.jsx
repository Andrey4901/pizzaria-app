import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList.jsx';
// Vamos criar esta página no próximo passo
import ProductDetailPage from './components/ProductDetailPage.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Rota para a Home Page (lista de produtos) */}
        <Route path="/" element={<ProductList />} />
        
        {/* Rota para a Página de Detalhes 
            ':id' é um parâmetro dinâmico 
        */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;