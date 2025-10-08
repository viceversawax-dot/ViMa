import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { Button } from './ui/Button';
import { PRODUCT_CATEGORIES } from '../constants';
import { CategorySelector } from './ui/CategorySelector';

interface AddProductProps {
  onSave: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ onSave }) => {
  const { addProduct } = useProducts();
  const [name, setName] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [serialNumber, setSerialNumber] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name || !category || !serialNumber) {
      setError('Tutti i campi sono obbligatori.');
      return;
    }
    addProduct({ name, category, serialNumber });
    onSave();
  };

  return (
    <div className="py-4 space-y-6 animate-[fade-in_0.3s_ease-out]">
        {error && <p className="text-brand-red text-center bg-brand-red/10 p-2 rounded-lg">{error}</p>}
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-brand-gray-600 px-1">Nome Prodotto</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="es., Proiettore Epson"
            className="w-full p-3 text-gray-900 bg-ios-secondary-bg border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-gray-600 px-1">Categoria</label>
          <CategorySelector
            categories={PRODUCT_CATEGORIES}
            selectedCategory={category}
            onSelectCategory={setCategory}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="serialNumber" className="text-sm font-medium text-brand-gray-600 px-1">Numero di Serie / ID</label>
          <input
            id="serialNumber"
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Verrà usato per il QR code"
            className="w-full p-3 text-gray-900 bg-ios-secondary-bg border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none"
          />
        </div>
        <div className="pt-4">
            <Button onClick={handleSave}>Aggiungi Prodotto all'Inventario</Button>
        </div>
         <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `}</style>
    </div>
  );
};

export default AddProduct;
