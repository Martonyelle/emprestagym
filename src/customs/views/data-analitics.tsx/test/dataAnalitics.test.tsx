import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useDataSource, useSideEntityController } from "firecms";
import { useClients } from "../../../../@shared/hooks/clientData";
import { useEquipmentData } from "../../../../@shared/hooks/useEquipamentData";
import { useRentalData } from "../../../../@shared/hooks/useRentalData";
import RentalDashboard from "../rentalDashboard";

jest.mock("../../../@shared/hooks/useRentalData");
jest.mock("../../../@shared/hooks/clientData");
jest.mock("../../../@shared/hooks/useEquipamentData");
jest.mock("firecms");

describe("RentalDashboard", () => {
  beforeEach(() => {
    (useRentalData as jest.Mock).mockReturnValue({
      data: [
        {
          id: "1",
          client: { id: "client1" },
          equipment: { id: "equipment1" },
          total_cost: 100,
          rental_duration: 2,
          allocation_date: new Date(),
          payment_method: "credit_card",
        },
      ],
      loading: false,
      error: null,
    });

    (useClients as jest.Mock).mockReturnValue({
      clients: [{ id: "client1", values: { name: "John Doe" } }],
      loading: false,
      error: null,
    });

    (useEquipmentData as jest.Mock).mockReturnValue({
      data: [{ id: "equipment1", name: "Treadmill" }],
      loading: false,
      error: null,
    });

    (useDataSource as jest.Mock).mockReturnValue({
      saveEntity: jest.fn(),
      fetchEntity: jest.fn(),
      deleteEntity: jest.fn(),
    });

    (useSideEntityController as jest.Mock).mockReturnValue({
      open: jest.fn(),
    });
  });

  test("renders RentalDashboard component", () => {
    render(<RentalDashboard />);
    expect(screen.getByText("Dashboard de Alocações")).toBeInTheDocument();
    expect(screen.getByText("Criar Novo Cliente")).toBeInTheDocument();
  });

  test("opens the create new client form", () => {
    const { open } = useSideEntityController();
    render(<RentalDashboard />);
    
    const createClientButton = screen.getByText("Criar Novo Cliente");
    fireEvent.click(createClientButton);

    expect(open).toHaveBeenCalledWith({
      path: "clients",
      collection: expect.anything(),
    });
  });

  test("opens and closes the return confirmation modal", async () => {
    render(<RentalDashboard />);

    const returnButton = screen.getByText("Devolvido");
    fireEvent.click(returnButton);

    expect(screen.getByText("Confirmar Devolução")).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Confirmar Devolução")).not.toBeInTheDocument();
    });
  });

  test("shows rental data in the DataGrid", () => {
    render(<RentalDashboard />);
    
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Treadmill")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("handles return action correctly", async () => {
    const { deleteEntity, saveEntity } = useDataSource();
    render(<RentalDashboard />);

    const returnButton = screen.getByText("Devolvido");
    fireEvent.click(returnButton);

    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(saveEntity).toHaveBeenCalled();
      expect(deleteEntity).toHaveBeenCalled();
    });
  });
});
