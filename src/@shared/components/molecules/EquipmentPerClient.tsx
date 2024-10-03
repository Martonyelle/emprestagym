// src/@shared/components/EquipmentPerClient.tsx
import React, { useMemo } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { EnhancedRentalItem } from "../../hooks/useRentalData";

interface Props {
  rentals: EnhancedRentalItem[];
}

interface ClientEquipmentCount {
  clientId: string;
  clientName: string;
  equipmentCount: number;
}

const EquipmentPerClient: React.FC<Props> = ({ rentals }) => {
  const clientEquipmentCounts: ClientEquipmentCount[] = useMemo(() => {
    const counts: Record<string, { clientName: string; equipmentCount: number }> = {};
    rentals.forEach((rental) => {
      const clientId = rental.client.id;
      const clientName = rental.clientName;
      if (!counts[clientId]) {
        counts[clientId] = { clientName, equipmentCount: 0 };
      }
      counts[clientId].equipmentCount += 1;
    });
    return Object.entries(counts).map(([clientId, { clientName, equipmentCount }]) => ({
      clientId,
      clientName,
      equipmentCount,
    }));
  }, [rentals]);

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Quantidade de Equipamentos Alocados
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">Equipamentos Alocados</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientEquipmentCounts.map((row) => (
              <TableRow key={row.clientId}>
                <TableCell align="right">{row.equipmentCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EquipmentPerClient;
