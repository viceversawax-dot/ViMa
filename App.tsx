
import React from 'react';
import { ProductProvider } from './contexts/ProductContext';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <ProductProvider>
      <Layout />
    </ProductProvider>
  );
};

export default App;
