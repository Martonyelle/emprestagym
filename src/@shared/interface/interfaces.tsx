import { EntityReference } from "firecms";

export interface RentalItem {
  id: string;
  client: { id: string };
  equipment: { id: string };
  rental_price: number;
  rental_period: {
    start_date: string;
    end_date: string;
  };
  payment_method: string;
  return_date: string;
  delivery_condition: string;
  return_condition: string;
}



export interface RentalData {
  id: string;
  clientId: string;
  equipmentId: string;
  rental_price: number | null;
  startDate: Date | null;
  endDate: Date | null;
  payment_method: string;
  return_date: Date | null;
  delivery_condition: string;
  return_condition: string;
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