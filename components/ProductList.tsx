import React, { useState, useMemo } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Icon } from './ui/Icon';
import ProductDetailModal from './ProductDetailModal';
import AddProduct from './AddProduct';
import { ConfirmationModal } from './ui/ConfirmationModal';


const ProductListItem: React.FC<{ product: Product; onSelect: () => void; onDelete: () => void; }> = ({ product, onSelect, onDelete }) => (
  <div className="flex items-center space-x-2">
    <Card onClick={onSelect} className="flex-grow flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{product.name}</p>
        <p className="text-sm text-brand-gray-500">{product.serialNumber} &bull; {product.category}</p>
      </div>
      <div className="flex items-center space-x-2 pl-2">
        <Badge status={product.status} />
        <Icon name="chevron-right" className="w-5 h-5 text-brand-gray-400 flex-shrink-0" />
      </div>
    </Card>
    <button
      onClick={onDelete}
      className="p-2 text-brand-red hover:bg-brand-red/10 rounded-full transition-colors flex-shrink-0"
      aria-label={`Elimina ${product.name}`}
    >
      <Icon name="trash" className="w-5 h-5" />
    </button>
  </div>
);


export const ProductList: React.FC = () => {
  const { products, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [products, searchTerm]);

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };


  return (
    <div className="p-4 space-y-4">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold text-gray-900">{isAdding ? 'Aggiungi Nuovo Prodotto' : 'Inventario'}</h1>
         {isAdding ? (
            <button onClick={() => setIsAdding(false)} className="text-brand-blue font-semibold px-2 py-1">Annulla</button>
         ) : (
            <button onClick={() => setIsAdding(true)} className="p-1 text-brand-blue rounded-full hover:bg-brand-blue/10 transition-colors">
                <Icon name="plus-circle" className="w-8 h-8"/>
            </button>
         )}
       </div>

       {isAdding ? (
         <AddProduct onSave={() => setIsAdding(false)} />
       ) : (
         <>
          <div className="relative">
            <input
              type="text"
              placeholder="Cerca prodotti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
          <div className="space-y-3">
            {filteredProducts.length > 0 ? filteredProducts.map(product => (
              <ProductListItem 
                key={product.id} 
                product={product} 
                onSelect={() => setSelectedProduct(product)}
                onDelete={() => setProductToDelete(product)}
              />
            )) : (
              <div className="text-center py-10 text-brand-gray-500">
                <p className="font-semibold">Nessun prodotto trovato.</p>
                <p className="text-sm">Clicca sull'icona '+' in alto per aggiungere il tuo primo prodotto.</p>
              </div>
            )}
          </div>
         </>
       )}
      
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {productToDelete && (
        <ConfirmationModal
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Conferma Eliminazione"
        >
          <p>Sei sicuro di voler eliminare definitivamente <strong>{productToDelete.name}</strong>?</p>
          <p className="text-sm text-brand-gray-500 mt-2">Questa azione non può essere annullata.</p>
        </ConfirmationModal>
      )}
    </div>
  );
};
