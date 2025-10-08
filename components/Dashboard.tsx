import React from 'react';
import { useProducts } from '../contexts/ProductContext';
import { Product, ProductStatus } from '../types';
import { Card } from './ui/Card';
import { Icon } from './ui/Icon';
import { Badge } from './ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';


const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <Card className="flex items-center p-4">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm font-medium text-brand-gray-600">{title}</p>
    </div>
  </Card>
);

const OverdueItem: React.FC<{item: Product}> = ({item}) => (
    <div className="flex justify-between items-center py-3">
        <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-brand-red">
                Scaduto da {formatDistanceToNow(item.returnDate!, { locale: it })}
            </p>
        </div>
        <Badge status={item.status} />
    </div>
);


export const Dashboard: React.FC = () => {
  const { products } = useProducts();
  const now = new Date();

  const counts = {
    available: products.filter(p => p.status === ProductStatus.Disponibile).length,
    inUse: products.filter(p => p.status === ProductStatus.InUso).length,
    maintenance: products.filter(p => p.status === ProductStatus.InManutenzione).length,
  };
  
  const overdueItems = products.filter(p => p.status === ProductStatus.InUso && p.returnDate && p.returnDate < now)
    .sort((a,b) => a.returnDate!.getTime() - b.returnDate!.getTime());

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Riepilogo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Disponibili" value={counts.available} icon={<Icon name="check-circle" className="w-6 h-6 text-white"/>} color="bg-brand-green" />
        <StatCard title="In Uso" value={counts.inUse} icon={<Icon name="alert-circle" className="w-6 h-6 text-white"/>} color="bg-brand-blue" />
        <StatCard title="In Manutenzione" value={counts.maintenance} icon={<Icon name="wrench" className="w-6 h-6 text-white"/>} color="bg-brand-orange" />
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-2 flex items-center">
            <Icon name="alert-circle" className="w-5 h-5 mr-2 text-brand-red"/>
            Elementi Scaduti ({overdueItems.length})
        </h2>
        {overdueItems.length > 0 ? (
            <div className="divide-y divide-brand-gray-200">
                {overdueItems.map(item => <OverdueItem key={item.id} item={item} />)}
            </div>
        ) : (
            <p className="text-brand-gray-500 text-center py-4">Nessun elemento scaduto. Ottimo lavoro!</p>
        )}
      </Card>
    </div>
  );
};
