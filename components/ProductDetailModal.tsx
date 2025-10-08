import React, { useState, useEffect } from 'react';
import { Product, ProductStatus } from '../types';
import { useProducts } from '../contexts/ProductContext';
import { Modal } from './ui/Modal';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { format, addDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { getMaintenanceSuggestions } from '../services/geminiService';
import { PRODUCT_CATEGORIES } from '../constants';
import { CategorySelector } from './ui/CategorySelector';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  const { checkInProduct, checkOutProduct, setProductMaintenance, updateProductDetails } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus>(product.status);
  
  const [returnDate, setReturnDate] = useState('');
  const [maintenanceNotes, setMaintenanceNotes] = useState('');
  const [category, setCategory] = useState(product.category);
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens or product changes
      setIsEditing(false);
      setSelectedStatus(product.status);
      setCategory(product.category);
      setReturnDate(product.returnDate ? format(product.returnDate, 'yyyy-MM-dd') : '');
      const lastMaintenanceLog = product.history.find(log => log.action === 'In Manutenzione' && log.notes);
      setMaintenanceNotes(lastMaintenanceLog?.notes || '');
    }
  }, [isOpen, product]);

  const handleSave = () => {
    if (category !== product.category) {
      updateProductDetails(product.id, { category });
    }

    switch (selectedStatus) {
      case ProductStatus.Disponibile:
        checkInProduct(product.id);
        break;
      case ProductStatus.InUso:
        if (returnDate) {
          checkOutProduct(product.id, new Date(returnDate));
        } else {
            // maybe show an error
            return;
        }
        break;
      case ProductStatus.InManutenzione:
        if (maintenanceNotes) {
            setProductMaintenance(product.id, maintenanceNotes);
        } else {
            // maybe show an error
            return;
        }
        break;
    }
    handleClose();
  };
  
  const handleClose = () => {
    setIsEditing(false);
    onClose();
  }

  const handleGetSuggestion = async () => {
      if (!maintenanceNotes) return;
      setIsGettingSuggestion(true);
      const suggestion = await getMaintenanceSuggestions(product.name, maintenanceNotes);
      setMaintenanceNotes(prev => `${prev}\n\n--- Suggerimenti AI ---\n${suggestion}`);
      setIsGettingSuggestion(false);
  }

  const handlePrint = () => {
    const qrCodeElement = document.getElementById(`qr-code-to-print-${product.id}`);
    if (qrCodeElement) {
        const printWindow = window.open('', '_blank');
        printWindow?.document.write(`
            <html>
                <head>
                    <title>Stampa QR Code</title>
                    <style>
                        @media print {
                            body { -webkit-print-color-adjust: exact; }
                        }
                        body { font-family: sans-serif; text-align: center; padding: 20px; }
                        h1 { font-size: 1.2rem; margin-bottom: 0.5rem; }
                        p { font-family: monospace; margin-top: 0; }
                    </style>
                </head>
                <body>
                    <h1>${product.name}</h1>
                    ${qrCodeElement.innerHTML}
                    <p>${product.serialNumber}</p>
                </body>
            </html>
        `);
        printWindow?.document.close();
        printWindow?.focus();
        printWindow?.print();
    }
  };

  const handleStatusSelection = (newStatus: ProductStatus) => {
    setSelectedStatus(newStatus);
    if (newStatus === ProductStatus.InUso) {
        // If item is already in use, keep its date. Otherwise set a default (week from now).
        if (product.status !== ProductStatus.InUso || !product.returnDate) {
            const defaultReturnDate = addDays(new Date(), 7);
            setReturnDate(format(defaultReturnDate, 'yyyy-MM-dd'));
        } else {
             setReturnDate(format(product.returnDate, 'yyyy-MM-dd'));
        }
    }
  };

  const renderStatusEditor = () => (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <CategorySelector
                categories={PRODUCT_CATEGORIES}
                selectedCategory={category}
                onSelectCategory={setCategory}
            />
        </div>

        <h3 className="font-semibold text-gray-800 pt-2">Cambia Stato</h3>
        <div className="flex space-x-2">
            {(Object.values(ProductStatus) as ProductStatus[]).map(status => (
                <button
                    key={status}
                    onClick={() => handleStatusSelection(status)}
                    className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${selectedStatus === status ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-700 border-gray-300'}`}
                >
                    {status}
                </button>
            ))}
        </div>

        {selectedStatus === ProductStatus.InUso && (
            <div className="space-y-2">
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">Data di Rientro</label>
                <input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900"
                />
            </div>
        )}

        {selectedStatus === ProductStatus.InManutenzione && (
            <div className="space-y-2">
                <label htmlFor="maintenanceNotes" className="block text-sm font-medium text-gray-700">Note di Manutenzione</label>
                <textarea
                    id="maintenanceNotes"
                    placeholder="Descrivi il problema..."
                    value={maintenanceNotes}
                    onChange={(e) => setMaintenanceNotes(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg h-24 text-gray-900"
                />
                 <Button variant="secondary" onClick={handleGetSuggestion} disabled={isGettingSuggestion || !maintenanceNotes}>
                    <div className="flex items-center justify-center">
                        <Icon name="zap" className="w-5 h-5 mr-2" />
                        {isGettingSuggestion ? 'Caricamento...' : 'Ottieni Suggerimenti AI'}
                    </div>
                </Button>
            </div>
        )}

        <div className="flex space-x-2 pt-2">
            <Button variant="secondary" onClick={() => setIsEditing(false)}>Annulla</Button>
            <Button onClick={handleSave}>Salva Modifiche</Button>
        </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={product.name}>
      <div className="space-y-4">
        <div className="text-center p-4 bg-white rounded-lg">
            <div className="flex justify-center">
                <div id={`qr-code-to-print-${product.id}`}>
                    <QRCode value={product.serialNumber} size={128} />
                </div>
            </div>
            <p className="mt-2 text-sm text-brand-gray-500 font-mono">{product.serialNumber}</p>
            <button onClick={handlePrint} className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-brand-gray-600 hover:bg-brand-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gray-500">
                <Icon name="printer" className="w-4 h-4 mr-2"/>
                Stampa QR Code
            </button>
        </div>
        
        <div className="p-4 bg-brand-gray-100 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-500">Stato</span>
                <Badge status={product.status} />
            </div>
            <div className="flex justify-between items-center text-gray-900">
                <span className="font-semibold text-gray-500">Categoria</span>
                <span className="font-medium">{product.category}</span>
            </div>
            {product.returnDate && (
                <div className="flex justify-between items-center text-gray-900">
                    <span className="font-semibold text-gray-500">Scadenza Rientro</span>
                    <span className="font-medium">{format(product.returnDate, 'd MMM yyyy', { locale: it })}</span>
                </div>
            )}
        </div>

        <div>
            {isEditing ? renderStatusEditor() : <Button onClick={() => setIsEditing(true)}>Modifica Prodotto</Button>}
        </div>

        <div className="pt-4">
            <h3 className="font-semibold mb-2 text-gray-900">Cronologia</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                {product.history.map(log => (
                    <div key={log.id} className="text-sm flex justify-between">
                        <span className="text-gray-700">{log.action}</span>
                        <span className="text-brand-gray-500">{format(log.timestamp, 'd MMM, HH:mm', { locale: it })}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
