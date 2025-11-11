// src/App.jsx
import React from 'react';
import ProductList from './components/ProductList';

// (O Vite pode ter criado CSS, vamos remover a importação dele por enquanto)
// import './App.css' 

function App() {
  return (
    <div className="App">
      <ProductList />
    </div>
  );
}

export default App;