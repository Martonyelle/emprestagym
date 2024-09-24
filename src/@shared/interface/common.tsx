export interface APIResponse{
  status?: number;
  success: boolean; 
  progress?: number;
  data?: any;
  error?: any | undefined;
  message?: string;
}

export interface CreditCard {
  holder_name: string;
  number: string;
  expiry_month: number;
  expiry_year: number;
  ccv: string;
  brand?: string;
}