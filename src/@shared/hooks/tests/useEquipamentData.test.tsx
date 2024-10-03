import { render, screen, waitFor } from '@testing-library/react';
import useCollectionData from '../collectionData';
import { Entity } from 'firecms';
import { useEquipmentData } from '../useEquipamentData';

jest.mock('../collectionData');

const TestComponent = ({ equipmentId }: { equipmentId?: string }) => {
  const { data, loading, error } = useEquipmentData(equipmentId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <ul>
      {data.map((equipment) => (
        <li key={equipment.id}>{equipment.name}</li>
      ))}
    </ul>
  );
};

describe('useEquipmentData', () => {
  let mockGetData: jest.Mock;

  beforeEach(() => {
    mockGetData = jest.fn();
    (useCollectionData as jest.Mock).mockReturnValue({ getData: mockGetData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar uma lista de equipamentos quando a busca é bem-sucedida', async () => {
    const mockEquipments: Entity<any>[] = [
      { id: '1', path: 'equipments/1', values: { name: 'Equipment 1' } },
      { id: '2', path: 'equipments/2', values: { name: 'Equipment 2' } },
    ];

    mockGetData.mockResolvedValue(mockEquipments);

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    mockEquipments.forEach((equipment) => {
      expect(screen.getByText(equipment.values.name)).toBeInTheDocument();
    });
  });

  it('deve retornar um erro quando a busca falha', async () => {
    mockGetData.mockRejectedValue(new Error('Erro ao buscar equipamentos'));

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Error: Falha ao carregar equipamentos.')).toBeInTheDocument();
  });

  it('deve definir o estado de carregamento corretamente', async () => {
    const mockEquipments: Entity<any>[] = [
      { id: '1', path: 'equipments/1', values: { name: 'Equipment 1' } },
    ];

    mockGetData.mockResolvedValue(mockEquipments);

    render(<TestComponent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});
