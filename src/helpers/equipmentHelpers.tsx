import { getAuthToken } from './authHelpers';
import { API_URL } from '../config';

interface AllocateEquipmentParams {
  equipmentId: string;
  clientName: string;
  allocationDate: string;
  paymentMethod: string;
  rentalDuration: number;
  totalCost: number;
}

export async function allocateEquipment(params: AllocateEquipmentParams): Promise<void> {
  const accessToken = await getAuthToken();

  const response = await fetch(`${API_URL}/equipments/allocate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao alocar equipamento');
  }
}
