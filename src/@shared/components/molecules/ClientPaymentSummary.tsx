// src/@shared/components/molecules/ClientPaymentSummary.tsx
import React, { useMemo } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { EnhancedRentalItem } from "../../hooks/useRentalData";

interface Props {
  rentals: EnhancedRentalItem[];
}

interface ClientPayment {
  clientId: string;
  clientName: string;
  totalToPay: number;
  totalPaid: number;
  balance: number;
}

const ClientPaymentSummary: React.FC<Props> = ({ rentals }) => {
  const clientPayments: ClientPayment[] = useMemo(() => {
    const payments: Record<string, { clientName: string; totalToPay: number; totalPaid: number }> = {};
    rentals.forEach((rental) => {
      const clientId = rental.client.id;
      const clientName = rental.clientName;
      if (!payments[clientId]) {
        payments[clientId] = { clientName, totalToPay: 0, totalPaid: 0 };
      }
      payments[clientId].totalToPay += rental.total_cost;
      payments[clientId].totalPaid += rental.rental_price ?? 0;
    });
    return Object.entries(payments).map(([clientId, { clientName, totalToPay, totalPaid }]) => ({
      clientId,
      clientName,
      totalToPay,
      totalPaid,
      balance: totalToPay - totalPaid,
    }));
  }, [rentals]);

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Resumo de Pagamentos por Cliente
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">Total Pago</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientPayments.map((row) => (
              <TableRow key={row.clientId}>
                <TableCell align="right">R$ {row.totalToPay.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ClientPaymentSummary;
