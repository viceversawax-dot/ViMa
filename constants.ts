
import { Product, ProductStatus } from './types';
import { subDays, addDays } from 'date-fns';

export const PRODUCT_CATEGORIES = [
    "Proiettore",
    "Microfono",
    "Casse",
    "Amplificatori",
    "Accessori",
    "Cavi"
];

const now = new Date();

export const INITIAL_PRODUCTS: Product[] = [
    {
        id: 'EPSON-EB2265U-001',
        serialNumber: 'EPSON-EB2265U-001',
        name: 'Proiettore Epson EB-2265U',
        category: 'Proiettore',
        status: ProductStatus.Disponibile,
        history: [
            { id: 'h-1', timestamp: subDays(now, 10), action: 'Aggiunto' },
        ],
    },
    {
        id: 'SHURE-SM58-101',
        serialNumber: 'SHURE-SM58-101',
        name: 'Microfono Shure SM58',
        category: 'Microfono',
        status: ProductStatus.InUso,
        checkoutDate: subDays(now, 1),
        returnDate: addDays(now, 5),
        history: [
            { id: 'h-2b', timestamp: subDays(now, 1), action: 'Preso in carico' },
            { id: 'h-2a', timestamp: subDays(now, 20), action: 'Aggiunto' },
        ],
    },
    {
        id: 'RCF-ART715A-201',
        serialNumber: 'RCF-ART715A-201',
        name: 'Cassa Attiva RCF ART 715-A',
        category: 'Casse',
        status: ProductStatus.InUso,
        checkoutDate: subDays(now, 7),
        returnDate: subDays(now, 2), // Overdue
        history: [
            { id: 'h-3b', timestamp: subDays(now, 7), action: 'Preso in carico' },
            { id: 'h-3a', timestamp: subDays(now, 30), action: 'Aggiunto' },
        ],
    },
    {
        id: 'CROWN-XLI2500-301',
        serialNumber: 'CROWN-XLI2500-301',
        name: 'Amplificatore Crown XLi 2500',
        category: 'Amplificatori',
        status: ProductStatus.InManutenzione,
        history: [
            { id: 'h-4b', timestamp: subDays(now, 3), action: 'In Manutenzione', notes: 'Un canale non funziona, da controllare.' },
            { id: 'h-4a', timestamp: subDays(now, 50), action: 'Aggiunto' },
        ],
    },
    {
        id: 'HDMI-10M-001',
        serialNumber: 'HDMI-10M-001',
        name: 'Cavo HDMI 10m',
        category: 'Cavi',
        status: ProductStatus.Disponibile,
        history: [
             { id: 'h-5a', timestamp: subDays(now, 60), action: 'Aggiunto' },
        ],
    },
];
