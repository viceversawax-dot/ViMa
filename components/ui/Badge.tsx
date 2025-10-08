import React from 'react';
import { ProductStatus } from '../../types';

interface BadgeProps {
  status: ProductStatus;
}

const statusStyles: Record<ProductStatus, string> = {
  [ProductStatus.Disponibile]: 'bg-brand-green/20 text-brand-green',
  [ProductStatus.InUso]: 'bg-brand-blue/20 text-brand-blue',
  [ProductStatus.InManutenzione]: 'bg-brand-orange/20 text-brand-orange',
};

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};