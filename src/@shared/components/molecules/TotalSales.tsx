import React, { useMemo } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { RentalItem } from "../../interface/interfaces";

interface Props {
  rentals: RentalItem[];
}

const TotalSales: React.FC<Props> = ({ rentals }) => {
  const totalSales = useMemo(() => {
    return rentals.reduce((acc, rental) => acc + rental.total_cost, 0);
  }, [rentals]);

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Total de Vendas
      </Typography>
      <Typography variant="h4">R$ {totalSales.toFixed(2)}</Typography>
    </Paper>
  );
};

export default TotalSales;