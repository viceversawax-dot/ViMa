import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="text-brand-gray-600">{children}</div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Annulla
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Elimina
          </Button>
        </div>
      </div>
    </Modal>
  );
};