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

  const handleClientChange = (event: SelectChangeEvent<string>) => {
    setClientFilter(event.target.value);
  };

  // Transformar os dados antes de passá-los para o DataGrid
  const transformedData: RentalData[] = rentalData.map((item) => ({
    id: item.id,
    clientId: item.values.client?.id || "",
    rental_price: item.values.rental_price || null,
    startDate: item.values.rental_period?.start_date
      ? new Date(item.values.rental_period.start_date)
      : null,
    endDate: item.values.rental_period?.end_date
      ? new Date(item.values.rental_period.end_date)
      : null,
    payment_method: item.values.payment_method || "",
    return_date: item.values.return_date
      ? new Date(item.values.return_date)
      : null,
    delivery_condition: item.values.delivery_condition || "",
    return_condition: item.values.return_condition || "",
  }));

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
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <h1>Dashboard de Alocações</h1>

      {/* Filtro por Cliente */}
      <FormControl
        variant="outlined"
        sx={{ minWidth: 200, marginBottom: 2 }}
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
