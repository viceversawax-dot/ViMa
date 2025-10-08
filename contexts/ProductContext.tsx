import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Product, ProductStatus, LogAction } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

interface ProductContextType {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  checkOutProduct: (id: string, returnDate: Date) => void;
  checkInProduct: (id: string) => void;
  setProductMaintenance: (id: string, notes: string) => void;
  getOverdueCount: () => number;
  addProduct: (productData: { name: string; category: string; serialNumber: string }) => void;
  deleteProduct: (id: string) => void;
  updateProductDetails: (id: string, details: { category: string }) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

  const updateProduct = (id: string, updates: Partial<Product>, logAction?: { action: LogAction, notes?: string }) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === id
          ? {
              ...p,
              ...updates,
              history: logAction ? [{ id: `h-${Date.now()}`, ...logAction, timestamp: new Date() }, ...p.history] : p.history,
            }
          : p
      )
    );
  };
  
  const checkOutProduct = (id: string, returnDate: Date) => {
    updateProduct(id, {
      status: ProductStatus.InUso,
      checkoutDate: new Date(),
      returnDate
    }, { action: "Preso in carico" });
  };

  const checkInProduct = (id: string) => {
    updateProduct(id, {
      status: ProductStatus.Disponibile,
      checkoutDate: undefined,
      returnDate: undefined,
    }, { action: "Restituito" });
  };

  const setProductMaintenance = (id: string, notes: string) => {
    updateProduct(id, {
        status: ProductStatus.InManutenzione,
        checkoutDate: undefined,
        returnDate: undefined,
    }, { action: "In Manutenzione", notes });
  };

  const getOverdueCount = () => {
    const now = new Date();
    return products.filter(p => p.status === ProductStatus.InUso && p.returnDate && p.returnDate < now).length;
  };

  const addProduct = ({ name, category, serialNumber }: { name: string; category: string; serialNumber: string }) => {
    const newProduct: Product = {
      id: serialNumber,
      serialNumber,
      name,
      category,
      status: ProductStatus.Disponibile,
      history: [
        { id: `h-${Date.now()}`, timestamp: new Date(), action: "Aggiunto" }
      ],
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
  };
  
  const updateProductDetails = (id: string, details: { category: string }) => {
    updateProduct(id, details);
  };


  return (
    <ProductContext.Provider value={{ products, getProductById, checkOutProduct, checkInProduct, setProductMaintenance, getOverdueCount, addProduct, deleteProduct, updateProductDetails }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};