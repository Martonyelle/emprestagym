import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SnackbarProvider } from "notistack";
import { useClients } from "../../../hooks/clientData";
import { useEquipmentData } from "../../../hooks/useEquipamentData";
import AllocationModal from "../AllocationModal";

jest.mock("../../hooks/useEquipamentData");
jest.mock("../../hooks/clientData");

const mockCloseFn = jest.fn();
const mockSaveEntity = jest.fn();
const mockSnackbarOpen = jest.fn();

jest.mock("firecms", () => ({
  useSnackbarController: () => ({ open: mockSnackbarOpen }),
  useDataSource: () => ({ saveEntity: mockSaveEntity }),
}));

describe("AllocationModal", () => {
  beforeEach(() => {

    jest.clearAllMocks();

    (useClients as jest.Mock).mockReturnValue({
      clients: [
        { id: "client1", values: { name: "Client One" } },
        { id: "client2", values: { name: "Client Two" } },
      ],
      loading: false,
      error: null,
    });

    (useEquipmentData as jest.Mock).mockReturnValue({
      data: [
        { id: "equipment1", name: "Equipment One", price: 100, available_quantity: 5 },
        { id: "equipment2", name: "Equipment Two", price: 200, available_quantity: 0 },
      ],
      loading: false,
      error: null,
    });
  });

  test("renders modal and shows available equipments", () => {
    render(
      <SnackbarProvider>
        <AllocationModal isOpen={true} closeFn={mockCloseFn} />
      </SnackbarProvider>
    );

    expect(screen.getByText("Alocar Equipamento")).toBeInTheDocument();
    expect(screen.getByLabelText("Cliente")).toBeInTheDocument();
    expect(screen.getByLabelText("Equipamento")).toBeInTheDocument();
    expect(screen.getByText("Equipment One (Disponível: 5)")).toBeInTheDocument();
    expect(screen.queryByText("Equipment Two")).not.toBeInTheDocument();
  });

  test("allows form submission with valid data", async () => {
    render(
      <SnackbarProvider>
        <AllocationModal isOpen={true} closeFn={mockCloseFn} />
      </SnackbarProvider>
    );

    fireEvent.mouseDown(screen.getByLabelText("Cliente"));
    fireEvent.click(screen.getByText("Client One"));

    fireEvent.mouseDown(screen.getByLabelText("Equipamento"));
    fireEvent.click(screen.getByText("Equipment One (Disponível: 5)"));

    fireEvent.mouseDown(screen.getByLabelText("Forma de Pagamento"));
    fireEvent.click(screen.getByText("Cartão de Crédito"));

    fireEvent.change(screen.getByLabelText("Duração do Aluguel (meses)"), {
      target: { value: 2 },
    });

    fireEvent.click(screen.getByText("Alocar"));

    await waitFor(() => expect(mockSaveEntity).toHaveBeenCalledTimes(2));
    expect(mockSaveEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "allocations",
        values: expect.objectContaining({
          client: expect.objectContaining({ id: "client1" }),
          equipment: expect.objectContaining({ id: "equipment1" }),
          payment_method: "credit_card",
          rental_duration: 2,
          total_cost: 200,
        }),
      })
    );

    await waitFor(() => expect(mockSnackbarOpen).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
        message: expect.anything(),
      })
    ));

    await waitFor(() => expect(mockCloseFn).toHaveBeenCalled());
  });

  test("shows error if no equipment is selected", async () => {
    render(
      <SnackbarProvider>
        <AllocationModal isOpen={true} closeFn={mockCloseFn} />
      </SnackbarProvider>
    );

    fireEvent.mouseDown(screen.getByLabelText("Cliente"));
    fireEvent.click(screen.getByText("Client One"));
    fireEvent.click(screen.getByText("Alocar"));

    await waitFor(() => expect(mockSnackbarOpen).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        message: expect.anything(),
      })
    ));
  });

  test("disables submit button if required fields are missing", () => {
    render(
      <SnackbarProvider>
        <AllocationModal isOpen={true} closeFn={mockCloseFn} />
      </SnackbarProvider>
    );

    const submitButton = screen.getByText("Alocar");
    expect(submitButton).toBeDisabled();

    fireEvent.mouseDown(screen.getByLabelText("Cliente"));
    fireEvent.click(screen.getByText("Client One"));
    fireEvent.mouseDown(screen.getByLabelText("Equipamento"));
    fireEvent.click(screen.getByText("Equipment One (Disponível: 5)"));

    expect(submitButton).not.toBeDisabled();
  });
});
