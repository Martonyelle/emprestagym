// src/@shared/components/modals/AllocationModal.tsx

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
import { useSnackbarController, useDataSource } from "firecms";
import { SnackbarMessage } from "../../atoms/SnackbarMessage";
import { useEquipment } from "../../hooks/useEquipment";
import { allocationsCollection } from "../../../collections/allocation";
import { equipmentsCollection } from "../../../collections/equipments";
import { useClients } from "../../hooks/clientData";
import { Allocation } from "../../interface/interfaces";

interface AllocationModalProps {
    equipmentId: string;
    isOpen: boolean;
    closeFn: () => void;
}

const AllocationModal: React.FC<AllocationModalProps> = ({
    equipmentId,
    isOpen,
    closeFn,
}) => {
    const snackbarController = useSnackbarController();
    const dataSource = useDataSource();

    const { equipment, loading: equipmentLoading, error: equipmentError } = useEquipment(equipmentId);
    const { clients, loading: clientsLoading, error: clientsError } = useClients();

    const [selectedClientId, setSelectedClientId] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [rentalDuration, setRentalDuration] = useState<number>(1);
    const [loadingAllocation, setLoadingAllocation] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoadingAllocation(true);

        try {
            if (!equipment) {
                throw new Error("Equipamento não encontrado.");
            }

            if (!selectedClientId) {
                throw new Error("Cliente não selecionado.");
            }

            const totalCost = equipment.price * rentalDuration;

            const allocationData: Allocation = {
                equipment: {
                    id: equipment.id,
                    path: "equipments",
                    pathWithId: `equipments/${equipment.id}`,
                },
                client: {
                    id: selectedClientId,
                    path: "clients",
                    pathWithId: `clients/${selectedClientId}`,
                },
                payment_method: paymentMethod,
                rental_duration: rentalDuration,
                total_cost: totalCost,
                allocation_date: new Date(),
            };

            // Salvando a alocação
            await dataSource.saveEntity({
                path: "allocations",
                collection: allocationsCollection,
                values: allocationData,
                status: "new",
            });

            // Atualizando o status do equipamento
            await dataSource.saveEntity({
                path: "equipments",
                entityId: equipment.id,
                collection: equipmentsCollection,
                values: {
                    ...equipment,
                    status: "allocated",
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

            closeFn();
        } catch (error: any) {
            console.error("Erro ao alocar equipamento:", error);
            snackbarController.open({
                type: "error",
                message: (
                    <SnackbarMessage
                        title={"Erro ao alocar equipamento"}
                        subtitle={error.message || "Não foi possível alocar o equipamento."}
                    />
                ),
            });
        } finally {
            setLoadingAllocation(false);
        }
    };

    if (equipmentLoading || clientsLoading) {
        return (
            <Dialog open={isOpen} onClose={closeFn}>
                <DialogContent>
                    <CircularProgress />
                </DialogContent>
            </Dialog>
        );
    }

    if (equipmentError || !equipment) {
        return (
            <Dialog open={isOpen} onClose={closeFn}>
                <DialogContent>
                    <Typography color="error">
                        {equipmentError?.message || "Equipamento não encontrado"}
                    </Typography>
                </DialogContent>
            </Dialog>
        );
    }

    if (clientsError) {
        return (
            <Dialog open={isOpen} onClose={closeFn}>
                <DialogContent>
                    <Typography color="error">
                        Erro ao carregar clientes
                    </Typography>
                </DialogContent>
            </Dialog>
        );
    }

    const totalCost = equipment.price * rentalDuration;

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
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            label="Cliente"
                        >
                            {clients.map((client) => (
                                <MenuItem key={client.id} value={client.id}>
                                    {client.values.name} {/* Ajuste conforme a estrutura dos dados */}
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
                            onChange={(e) => setPaymentMethod(e.target.value)}
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
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Valor do Equipamento: R$ {equipment.price.toFixed(2)}
                    </Typography>
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
