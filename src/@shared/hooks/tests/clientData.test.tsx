// src/@shared/hooks/tests/clientData.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useClients } from '../clientData';
import useCollectionData from '../collectionData';

jest.mock('../collectionData');

const TestComponent = () => {
  const { clients, loading, error } = useClients();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <ul>
      {clients.map((client) => (
        <li key={client.id}>{client.values.name}</li>
      ))}
    </ul>
  );
};

describe('useClients', () => {
  let mockGetData: jest.Mock;

  beforeEach(() => {
    mockGetData = jest.fn();
    (useCollectionData as jest.Mock).mockReturnValue({
      getData: mockGetData,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar uma lista de clientes quando a busca é bem-sucedida', async () => {
    const mockClients = [
      { id: '1', name: 'Cliente 1' },
      { id: '2', name: 'Cliente 2' },
    ];

    mockGetData.mockResolvedValue(mockClients);

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    mockClients.forEach((client) => {
      expect(screen.getByText(client.name)).toBeInTheDocument();
    });
  });

  it('deve retornar um erro quando a busca falha', async () => {
    mockGetData.mockRejectedValue(new Error('Erro ao buscar clientes'));

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Error: Falha ao carregar clientes.')).toBeInTheDocument();
  });

  it('deve definir o estado de carregamento corretamente', async () => {
    const mockClients = [
      { id: '1', name: 'Cliente 1' },
      { id: '2', name: 'Cliente 2' },
    ];

    mockGetData.mockResolvedValue(mockClients);

    render(<TestComponent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});
