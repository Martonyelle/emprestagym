import React, { useMemo } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import ClientPaymentSummary from "../../../@shared/components/molecules/ClientPaymentSummary";
import EquipmentPerClient from "../../../@shared/components/molecules/EquipmentPerClient";
import TotalSales from "../../../@shared/components/molecules/TotalSales";
import { useRentalData } from "../../../@shared/hooks/useRentalData";

const RentalReports: React.FC = () => {
  const { data, loading, error } = useRentalData();

  const today = new Date();

  const upcomingReturns = useMemo(() => {
    return data.filter((rental) => {
      if (!rental.rental_period || !rental.rental_period.end_date) return false;
      const endDate = new Date(rental.rental_period.end_date);
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    });
  }, [data, today]);

  const overdueRentals = useMemo(() => {
    return data.filter((rental) => {
      if (!rental.rental_period || !rental.rental_period.end_date) return false;
      const endDate = new Date(rental.rental_period.end_date);
      return endDate < today;
    });
  }, [data, today]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Relatórios de Aluguel
      </Typography>

      {loading ? (
        <Typography>Carregando...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <EquipmentPerClient rentals={data} />
          </Grid>
          <Grid item xs={12}>
            <ClientPaymentSummary rentals={data} />
          </Grid>
          <Grid item xs={12}>
            <TotalSales rentals={data} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RentalReports;
