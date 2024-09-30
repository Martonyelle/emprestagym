import React, { useState } from "react";
import {
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import {
  DataGrid,
  GridColDef,
  GridCellParams,
} from "@mui/x-data-grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useRentalData } from "../../../@shared/hooks/useRentalData";
import { useClients } from "../../../@shared/hooks/clientData";
import { RentalData } from "../../../@shared/interface/interfaces";
import { ActionButton } from "../../../@shared/components/atoms/ActionButton";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AllocationModal from "../../../@shared/components/modals/AllocationModal";
import { useEquipmentData } from "../../../@shared/hooks/useEquipamentData";


const RentalDashboard = () => {
  const [clientFilter, setClientFilter] = useState<string>("");
  const {
    data: rentalData = [],
    loading: rentalsLoading,
    error: rentalsError,
  } = useRentalData(clientFilter);
  const {
    clients = [],
    loading: clientsLoading,
    error: clientsError,
  } = useClients();
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>("");

  const handleClientChange = (event: SelectChangeEvent<string>) => {
    setClientFilter(event.target.value);
  };

  const handleEquipmentChange = (event: SelectChangeEvent<string>) => {
    setSelectedEquipmentId(event.target.value);
  };


  // Transformar os dados antes de passá-los para o DataGrid
  const transformedData: RentalData[] = rentalData.map((item) => ({
    id: item.id,
    clientId: item.client?.id || "",
    equipmentId: item.equipment?.id || "",
    rental_price: item.rental_price || null,
    startDate: item.rental_period?.start_date
      ? new Date(item.rental_period.start_date)
      : null,
    endDate: item.rental_period?.end_date
      ? new Date(item.rental_period.end_date)
      : null,
    payment_method: item.payment_method || "",
    return_date: item.return_date ? new Date(item.return_date) : null,
    delivery_condition: item.delivery_condition || "",
    return_condition: item.return_condition || "",
  }));

  const {
    data: equipments = [],
    loading: equipmentsLoading,
    error: equipmentsError,
  } = useEquipmentData();

  const getEquipmentName = (equipmentId?: string): string => {
    if (!equipmentId) return "Equipamento Desconhecido";
    const equipment = equipments.find((e) => e.id === equipmentId);
    return equipment ? equipment.name : "Equipamento Não Encontrado";
  };



  console.log("data", transformedData);

  // Função para obter o nome do cliente a partir do ID
  const getClientName = (clientId?: string): string => {
    if (!clientId) return "Cliente Desconhecido";
    const client = clients.find((c) => c.id === clientId);
    return client ? client.values.name : "Cliente Não Encontrado";
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
      field: "rental_price",
      headerName: "Preço do Aluguel",
      type: "number",
      width: 150,
    },
    {
      field: "startDate",
      headerName: "Data de Início",
      type: "date",
      width: 150,
    },
    {
      field: "endDate",
      headerName: "Data de Término",
      type: "date",
      width: 150,
    },
    {
      field: "payment_method",
      headerName: "Método de Pagamento",
      width: 150,
    },
    {
      field: "return_date",
      headerName: "Data de Devolução",
      type: "date",
      width: 150,
    },
    {
      field: "delivery_condition",
      headerName: "Condição na Entrega",
      width: 150,
    },
    {
      field: "return_condition",
      headerName: "Condição na Devolução",
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
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <h1>Dashboard de Alocações</h1>

      {/* Container para os Seletores e Botão */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        {/* Seletor de Cliente */}
        <FormControl
          variant="outlined"
          sx={{ minWidth: 200 }}
        >
          <InputLabel id="client-select-label">Cliente</InputLabel>
          <Select
            labelId="client-select-label"
            id="client-select"
            value={clientFilter}
            onChange={handleClientChange}
            label="Cliente"
          >
            <MenuItem value="">
              <em>Todos os Clientes</em>
            </MenuItem>
            {clientsLoading ? (
              <MenuItem disabled>Carregando...</MenuItem>
            ) : clientsError ? (
              <MenuItem disabled>Erro ao carregar clientes</MenuItem>
            ) : (
              clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.values.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {/* Botão de Alocar */}
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

      {/* Tabela de Alocações */}
      {rentalsLoading ? (
        <div>Carregando alocações...</div>
      ) : rentalsError ? (
        <div style={{ color: "red" }}>
          Erro ao carregar alocações: {rentalsError}
        </div>
      ) : (
        <div
          style={{ height: 400, width: "100%", marginBottom: 2 }}
        >
          <DataGrid
            rows={transformedData}
            columns={columns}
            checkboxSelection
            getRowId={(row) => row.id}
          />
        </div>
      )}

      {/* Calendário */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CalendarPicker
          date={new Date()}
          onChange={(date) =>
            console.log("Data Selecionada:", date)
          }
        />
      </LocalizationProvider>
    </Box>
  );
};

export default RentalDashboard;
