import React, { useEffect, useState } from 'react';
// FIX: The `Html5QrcodeError` type is not exported by the `html5-qrcode` library.
import { Html5Qrcode, Html5QrcodeResult } from 'html5-qrcode';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types';
import ProductDetailModal from './ProductDetailModal';

export const Scanner: React.FC = () => {
  const { getProductById } = useProducts();
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    const qrReaderId = "qr-reader";
    const html5QrCode = new Html5Qrcode(qrReaderId);

    const qrCodeSuccessCallback = (decodedText: string, decodedResult: Html5QrcodeResult) => {
      console.log(`Scan result: ${decodedText}`, decodedResult);
      const product = getProductById(decodedText);
      if (product) {
        setScannedProduct(product);
        setScanError(null);
        html5QrCode.stop().catch(err => console.error("Failed to stop scanner", err));
      } else {
        setScanError("Prodotto non trovato. Scansiona un QR code WarehousePro valido.");
      }
    };
    
    const qrCodeErrorCallback = (errorMessage: string) => {
        // We can ignore most errors as they are frequent (e.g., QR not found)
        // console.warn(`QR Code Scan Error: ${errorMessage}`);
    };

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          qrCodeSuccessCallback,
          qrCodeErrorCallback
        );
        setScanError(null);
      } catch (err: any) {
        setScanError(`Inizializzazione fotocamera fallita: ${err.message}`);
        console.error("Camera error:", err);
      }
    };

    startScanner();

    return () => {
      // Cleanup: stop the scanner when the component unmounts
      html5QrCode.stop().catch(err => {
         // This can fail if it's already stopped. It's safe to ignore.
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-ios-dark-bg">
      <h1 className="text-2xl font-bold text-white mb-4">Scansiona QR Prodotto</h1>
      <div id="qr-reader" className="w-full max-w-sm aspect-square rounded-lg overflow-hidden border-4 border-brand-blue"></div>
      {scanError && (
        <div className="mt-4 p-3 bg-brand-red/80 text-white text-center rounded-lg">{scanError}</div>
      )}
       {scannedProduct && (
        <ProductDetailModal
          product={scannedProduct}
          isOpen={!!scannedProduct}
          onClose={() => {
            setScannedProduct(null);
            // Optionally restart scanner here if needed
          }}
        />
      )}
    </div>
  );
};