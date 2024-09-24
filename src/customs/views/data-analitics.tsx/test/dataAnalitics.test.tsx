import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRentalData } from '../../../../@shared/hooks/useRentalData';
import '@testing-library/jest-dom';
import RentalDashboard from '../rentalDashboard';


jest.mock('../../@shared/hooks/useRentalData');

describe('RentalDashboard', () => {
  beforeEach(() => {
    (useRentalData as jest.Mock).mockReturnValue({
      data: [
        {
          id: '1',
          client: { id: 'client_1' },
          rental_price: 100,
          rental_period: {
            start_date: new Date('2023-09-01'),
            end_date: new Date('2023-09-10')
          }
        }
      ]
    });
  });

  test('renders RentalDashboard component', () => {
    render(<RentalDashboard />);
    expect(screen.getByText(/Dashboard de Alocações/i)).toBeInTheDocument();
  });

  test('filters data when client is selected', () => {
    render(<RentalDashboard />);
    fireEvent.mouseDown(screen.getByLabelText(/Cliente/i));
    fireEvent.click(screen.getByText(/Cliente 1/i));

    expect(screen.getByText(/Cliente 1/)).toBeInTheDocument();
  });
});
