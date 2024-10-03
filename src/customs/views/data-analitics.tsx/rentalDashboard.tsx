import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import { useRentalData } from "../../../@shared/hooks/useRentalData";
import { RentalData } from "../../../@shared/interface/interfaces";
import { ActionButton } from "../../../@shared/components/atoms/ActionButton";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AllocationModal from "../../../@shared/components/modals/AllocationModal";
import { useEquipmentData } from "../../../@shared/hooks/useEquipamentData";
import { useDataSource, useSideEntityController } from "firecms";
import { equipmentsCollection } from "../../../collections/equipments";
import { allocationsCollection } from "../../../collections/allocation";
import { clientsCollection } from "../../../collections/client/client";

const RentalDashboard = () => {
  const [selectedEquipmentId] = useState<string>("");
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null);
  const [returnModalOpen, setReturnModalOpen] = useState<boolean>(false);

  const dataSource = useDataSource();
  const sideEntityController = useSideEntityController();

  const {
    data: rentalData = [],
    loading: rentalsLoading,
    error: rentalsError,
  } = useRentalData();

  const handleReturn = async () => {
    if (!selectedReturnId) return;

    const rentalItem = rentalData.find((item) => item.id === selectedReturnId);
    if (!rentalItem) return;

    try {
      const equipment = equipments.find((e) => e.id === rentalItem.equipment?.id);
      if (equipment) {
        await dataSource.saveEntity({
          path: "equipments",
          entityId: equipment.id,
          collection: equipmentsCollection,
          values: {
            ...equipment,
            available_quantity: equipment.available_quantity + 1,
          },
          status: "existing",
        });
      }

      const entityToDelete = await dataSource.fetchEntity({
        path: "allocations",
        entityId: selectedReturnId,
        collection: allocationsCollection,
      });

      if (entityToDelete) {
        await dataSource.deleteEntity({
          entity: entityToDelete,
        });

        setReturnModalOpen(false);
        setSelectedReturnId(null);
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao realizar a devolução:", error);
    }
  };

  const transformedData: RentalData[] = rentalData.map((item) => ({
    id: item.id,
    clientId: item.client?.id || "",
    equipmentId: item.equipment?.id || "",
    total_cost: item.total_cost || 0,
    rental_duration: item.rental_duration || 0,
    allocation_date: item.allocation_date ? new Date(item.allocation_date) : new Date(0),
    payment_method: item.payment_method || "",
  }));

  const {
    data: equipments = []
  } = useEquipmentData();

  const getEquipmentName = (equipmentId?: string): string => {
    if (!equipmentId) return "Equipamento Desconhecido";
    const equipment = equipments.find((e) => e.id === equipmentId);
    return equipment ? equipment.name : "Equipamento Não Encontrado";
  };

  const getClientName = (clientId?: string): string => {
    return clientId ? clientId : "Cliente Desconhecido";
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "clientId",
      headerName: "Cliente",
      width: 150,
      renderCell: (params: GridCellParams) => {
        const clientId = params.row?.clientId;
        return getClientName(clientId);
      },
    },
    {
      field: "total_cost",
      headerName: "Preço Total",
      type: "number",
      width: 150,
    },
    {
      field: "rental_duration",
      headerName: "Duração do Aluguel (meses)",
      type: "number",
      width: 200,
    },
    {
      field: "allocation_date",
      headerName: "Data de Alocação",
      type: "date",
      width: 150,
    },
    {
      field: "payment_method",
      headerName: "Método de Pagamento",
      width: 150,
    },
    {
      field: "equipmentId",
      headerName: "Equipamento",
      width: 150,
      renderCell: (params: GridCellParams) => {
        const equipmentId = params.row?.equipmentId;
        return getEquipmentName(equipmentId);
      },
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 150,
      renderCell: (params: GridCellParams) => {
        return (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setSelectedReturnId(params.row.id);
              setReturnModalOpen(true);
            }}
          >
            Devolvido
          </Button>
        );
      },
    },
  ];

  const handleCreateNewClient = () => {
    sideEntityController.open({
      path: "clients",
      collection: clientsCollection,
    });
  };

  const handleCreateNewEquipment = () => {
    sideEntityController.open({
      path: "equipments",
      collection: equipmentsCollection,
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <h1>Dashboard de Alocações</h1>

      <Dialog open={returnModalOpen} onClose={() => setReturnModalOpen(false)}>
        <DialogTitle>Confirmar Devolução</DialogTitle>
        <DialogContent>Tem certeza que deseja devolver este equipamento?</DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleReturn} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <Button variant="contained" color="primary" onClick={handleCreateNewClient}>
          Criar Novo Cliente
        </Button>

        <Button sx={{ marginLeft: 2 }} variant="contained" color="primary" onClick={handleCreateNewEquipment}>
          Adicionar Novo Equipamento
        </Button>

        <Box sx={{ marginLeft: 2 }}>
          <ActionButton<{
            equipmentId: string;
          }>
            title="Alocar"
            icon={<AssignmentTurnedInIcon />}
            triggerModal={AllocationModal}
            data={{
              equipmentId: selectedEquipmentId,
            }}
            color="primary"
            showSnackbar={false}
          />
        </Box>
      </Box>

      {rentalsLoading ? (
        <div>Carregando alocações...</div>
      ) : rentalsError ? (
        <div style={{ color: "red" }}>Erro ao carregar alocações: {rentalsError}</div>
      ) : (
        <div style={{ height: 400, width: "100%", marginBottom: 2 }}>
          <DataGrid rows={transformedData} columns={columns} checkboxSelection getRowId={(row) => row.id} />
        </div>
      )}
    </Box>
  );
};

export default RentalDashboard;
