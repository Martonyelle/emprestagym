import { render, screen } from '@testing-library/react';
import { useRentalData } from '../../../../@shared/hooks/useRentalData';
import { RentalItem } from '../../../../@shared/interface/interfaces';
import RentalReports from '../rentalReports';


jest.mock('../../../@shared/hooks/useRentalData');

const mockedUseRentalData = useRentalData as jest.Mock;

const mockData: RentalItem[] = [
  {
    total_cost: 100,
    rental_duration: 2,
    allocation_date: new Date(),
    id: '1',
    client: { id: 'client1' },
    equipment: { id: 'Equipment A' },
    rental_price: 150,
    rental_period: {
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
    },
    payment_method: 'credit_card',
    return_date: new Date().toISOString(),
    delivery_condition: 'good',
    return_condition: 'good',
    clientName: 'Client A',
  },
  {
    total_cost: 200,
    rental_duration: 3,
    allocation_date: new Date(),
    id: '2',
    client: { id: 'client2' },
    equipment: { id: 'Equipment B' },
    rental_price: 250,
    rental_period: {
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
    },
    payment_method: 'cash',
    return_date: new Date().toISOString(),
    delivery_condition: 'excellent',
    return_condition: 'excellent',
    clientName: 'Client B',
  },
];

describe('RentalReports Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir o estado de carregamento', () => {
    mockedUseRentalData.mockReturnValue({
      data: [],
      loading: true,
      error: null,
    });

    render(<RentalReports />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve exibir o estado de erro', () => {
    mockedUseRentalData.mockReturnValue({
      data: [],
      loading: false,
      error: 'Falha ao carregar alocações.',
    });

    render(<RentalReports />);

    expect(screen.getByText('Falha ao carregar alocações.')).toBeInTheDocument();
  });

  it('deve exibir os relatórios corretamente quando os dados são carregados com sucesso', () => {
    mockedUseRentalData.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<RentalReports />);

    expect(screen.getByText('Quantidade de Equipamentos Alocados por Cliente')).toBeInTheDocument();
    expect(screen.getByText('Resumo de Pagamentos por Cliente')).toBeInTheDocument();
    expect(screen.getByText('Total de Vendas')).toBeInTheDocument();

    expect(screen.getByText('Client A')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); 
    expect(screen.getByText('Client B')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    expect(screen.getByText('Client A')).toBeInTheDocument();
    expect(screen.getByText('R$ 100.00')).toBeInTheDocument(); 
    expect(screen.getByText('R$ 150.00')).toBeInTheDocument(); 
    expect(screen.getByText('R$ -50.00')).toBeInTheDocument();  

    expect(screen.getByText('Client B')).toBeInTheDocument();
    expect(screen.getByText('R$ 200.00')).toBeInTheDocument();
    expect(screen.getByText('R$ 250.00')).toBeInTheDocument();
    expect(screen.getByText('R$ -50.00')).toBeInTheDocument(); 

    expect(screen.getByText('R$ 300.00')).toBeInTheDocument(); 
  });

  it('deve exibir mensagem quando não há dados', () => {
    mockedUseRentalData.mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });

    render(<RentalReports />);

    expect(screen.getByText('Quantidade de Equipamentos Alocados por Cliente')).toBeInTheDocument();
    expect(screen.getByText('Resumo de Pagamentos por Cliente')).toBeInTheDocument();
    expect(screen.getByText('Total de Vendas')).toBeInTheDocument();

  });
});
