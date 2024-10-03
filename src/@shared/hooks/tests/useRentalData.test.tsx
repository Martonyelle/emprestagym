import { render, screen, waitFor } from '@testing-library/react';
import { useRentalData } from '../useRentalData';
import useCollectionData from '../collectionData';
import { RentalItem } from '../../interface/interfaces';
import { Entity } from 'firecms';

jest.mock('../collectionData');

const TestComponent = ({ clientFilter }: { clientFilter?: string }) => {
  const { data, loading, error } = useRentalData(clientFilter);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <ul>
      {data.map((rental) => (
        <li key={rental.id}>{rental.id}</li>
      ))}
    </ul>
  );
};

describe("useRentalData", () => {
  let mockGetData: jest.Mock;

  beforeEach(() => {
    mockGetData = jest.fn();
    (useCollectionData as jest.Mock).mockReturnValue({ getData: mockGetData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch rental data successfully", async () => {
    const mockData: Entity<RentalItem>[] = [
      {
        id: "1",
        values: {
          client: { id: "Client A" },
          id: "1",
          equipment: { id: "Equipment A" },
          total_cost: 100,
          rental_duration: 2,
          allocation_date: new Date(),
          payment_method: "credit_card",
        },
        path: "allocations/1",
      },
      {
        id: "2",
        values: {
          client: { id: "Client B" },
          id: "2",
          equipment: { id: "Equipment B" },
          total_cost: 200,
          rental_duration: 3,
          allocation_date: new Date(),
          payment_method: "cash",
        },
        path: "allocations/2",
      },
    ];

    mockGetData.mockResolvedValue(mockData);

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    mockData.forEach((allocation) => {
      expect(screen.getByText(allocation.id)).toBeInTheDocument();
    });
  });

  it("should handle errors during fetch", async () => {
    mockGetData.mockRejectedValue(new Error("Failed to fetch"));

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Error: Falha ao carregar alocações.")).toBeInTheDocument();
  });

  it("should apply client filter", async () => {
    const mockData: Entity<RentalItem>[] = [
      {
        id: "1",
        values: {
          client: { id: "Client A" },
          id: "1",
          equipment: { id: "Equipment A" },
          total_cost: 100,
          rental_duration: 2,
          allocation_date: new Date(),
          payment_method: "credit_card",
        },
        path: "allocations/1",
      },
    ];

    mockGetData.mockResolvedValue(mockData);

    render(<TestComponent clientFilter="Client A" />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
