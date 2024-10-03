import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useSnackbarController, useDataSource, EntityReference } from "firecms";
import { SnackbarMessage } from "../../atoms/SnackbarMessage";
import { allocationsCollection } from "../../../collections/allocation";
import { equipmentsCollection } from "../../../collections/equipments";
import { useClients } from "../../hooks/clientData";
import { Allocation } from "../../interface/interfaces";
import { useEquipmentData } from "../../hooks/useEquipamentData";

interface AllocationModalProps {
  isOpen: boolean;
  closeFn: () => void;
}

const AllocationModal: React.FC<AllocationModalProps> = ({
  isOpen,
  closeFn,
}) => {
  const snackbarController = useSnackbarController();
  const dataSource = useDataSource();

  // Carregar clientes
  const {
    clients = [],
    loading: clientsLoading,
    error: clientsError,
  } = useClients();

  const {
    data: equipments = [],
    loading: equipmentsLoading,
    error: equipmentsError,
  } = useEquipmentData();

  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [rentalDuration, setRentalDuration] = useState<number>(1);
  const [loadingAllocation, setLoadingAllocation] = useState<boolean>(false);

  const selectedEquipment = equipments.find(
    (e) => e.id === selectedEquipmentId
  );

  const totalCost = (selectedEquipment?.price ?? 0) * rentalDuration;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingAllocation(true);

    try {
      if (!selectedEquipment) {
        throw new Error("Equipamento não encontrado.");
      }

      if (selectedEquipment.available_quantity <= 0) {
        throw new Error("Equipamento sem quantidade disponível.");
      }

      if (!selectedClientId) {
        throw new Error("Cliente não selecionado.");
      }

      const equipmentReference: EntityReference = {
        id: selectedEquipment.id,
        path: "equipments",
        pathWithId: `equipments/${selectedEquipment.id}`,
      };

      const clientReference: EntityReference = {
        id: selectedClientId,
        path: "clients",
        pathWithId: `clients/${selectedClientId}`,
      };

      const allocationData: Allocation = {
        equipment: equipmentReference,
        client: clientReference,
        payment_method: paymentMethod,
        rental_duration: rentalDuration,
        total_cost: totalCost,
        allocation_date: new Date(),
      };

      await dataSource.saveEntity({
        path: "allocations",
        collection: allocationsCollection,
        values: allocationData,
        status: "new",
      });

      await dataSource.saveEntity({
        path: "equipments",
        entityId: selectedEquipment.id,
        collection: equipmentsCollection,
        values: {
          ...selectedEquipment,
          available_quantity: selectedEquipment.available_quantity - 1,
        },
        status: "existing",
      });

      snackbarController.open({
        type: "success",
        message: (
          <SnackbarMessage
            title={"Equipamento alocado com sucesso!"}
            subtitle={`O equipamento foi alocado para o cliente selecionado.`}
          />
        ),
      });

      window.location.reload();
    } catch (error: any) {
      console.error("Erro ao alocar equipamento:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Não foi possível alocar o equipamento.";
      snackbarController.open({
        type: "error",
        message: (
          <SnackbarMessage
            title={"Erro ao alocar equipamento"}
            subtitle={errorMessage}
          />
        ),
      });
    } finally {
      setLoadingAllocation(false);
    }
  };

  if (clientsLoading || equipmentsLoading) {
    return (
      <Dialog open={isOpen} onClose={closeFn}>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (clientsError || equipmentsError) {
    return (
      <Dialog open={isOpen} onClose={closeFn}>
        <DialogContent>
          <Typography color="error">Erro ao carregar dados</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onClose={closeFn}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Alocar Equipamento</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="client-select-label">Cliente</InputLabel>
            <Select
              labelId="client-select-label"
              id="client-select"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value as string)}
              label="Cliente"
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.values.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" required>
            <InputLabel id="equipment-select-label">Equipamento</InputLabel>
            <Select
              labelId="equipment-select-label"
              id="equipment-select"
              value={selectedEquipmentId}
              onChange={(e) => setSelectedEquipmentId(e.target.value as string)}
              label="Equipamento"
            >
              {equipments
                .filter((equipment) => equipment.available_quantity > 0)
                .map((equipment) => (
                  <MenuItem key={equipment.id} value={equipment.id}>
                    {equipment.name} (Disponível: {equipment.available_quantity})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" required>
            <InputLabel id="payment-method-label">Forma de Pagamento</InputLabel>
            <Select
              labelId="payment-method-label"
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as string)}
              label="Forma de Pagamento"
            >
              <MenuItem value="credit_card">Cartão de Crédito</MenuItem>
              <MenuItem value="debit_card">Cartão de Débito</MenuItem>
              <MenuItem value="cash">Dinheiro</MenuItem>
              <MenuItem value="bank_transfer">Transferência Bancária</MenuItem>
              <MenuItem value="pix">PIX</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            id="rentalDuration"
            name="rental_duration"
            label="Duração do Aluguel (meses)"
            type="number"
            fullWidth
            variant="outlined"
            value={rentalDuration}
            onChange={(e) => setRentalDuration(Number(e.target.value))}
            required
            InputProps={{ inputProps: { min: 1 } }}
          />

          {selectedEquipment?.price !== undefined && (
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Valor do Equipamento: R$ {selectedEquipment.price.toFixed(2)}
            </Typography>
          )}

          <Typography variant="subtitle1">
            Custo Total: R$ {totalCost.toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFn} disabled={loadingAllocation}>
            Cancelar
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={
              loadingAllocation ||
              !selectedClientId ||
              !selectedEquipmentId ||
              !paymentMethod ||
              rentalDuration < 1
            }
          >
            {loadingAllocation ? "Alocando..." : "Alocar"}
          </Button>
        </DialogActions>
        {loadingAllocation && <LinearProgress />}
      </form>
    </Dialog>
  );
};

export default AllocationModal;
