export enum ProductStatus {
  Disponibile = "Disponibile",
  InUso = "In Uso",
  InManutenzione = "In Manutenzione",
}

export type LogAction = "Preso in carico" | "Restituito" | "In Manutenzione" | "Aggiunto";

export interface LogEntry {
  id: string;
  timestamp: Date;
  action: LogAction;
  notes?: string;
}

export interface Product {
  id: string; // Using serial number as ID
  name: string;
  category: string;
  serialNumber: string;
  status: ProductStatus;
  checkoutDate?: Date;
  returnDate?: Date;
  history: LogEntry[];
}