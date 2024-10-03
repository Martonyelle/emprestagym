import { EntityReference } from "firecms";

export interface RentalItem {
  total_cost: number;
  rental_duration: number;
  allocation_date: Date;
  id: string;
  client: { id: string };
  equipment: { id: string };
  payment_method: string;
  rental_period?: {
    start_date: string;
    end_date: string;
  };
  return_date?: string;
  delivery_condition?: string;
  return_condition?: string;
  rental_price?: number;
  clientName?: string;
}

export interface RentalData {
  id: string;
  clientId: string;
  equipmentId: string;
  total_cost: number; 
  rental_duration: number; 
  allocation_date: Date; 
  payment_method: string; 
  delivery_condition?: string; 
  return_condition?: string; 
  return_date?: Date | null; 
}

export interface ClientData {
  id: string;
  values: {
    cpf: string;
    name: string;
    phone: string;
    email: string;
    address: {
      state: string;
      city: string;
      street: string;
      number: string;
      complement: string;
    };
    status: string;
    config: any;
  };
}

export interface Allocation {
  equipment: EntityReference[] | EntityReference;
  client: EntityReference;
  payment_method: string;
  rental_duration: number;
  total_cost: number;
  allocation_date: Date;
}

