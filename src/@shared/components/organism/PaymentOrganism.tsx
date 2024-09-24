import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Alert,
  useTheme,
  Box,
  Tab,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Stack from "@mui/material/Stack";
import { AsaasPaymentStatus } from "../../enums/asaas";
import { PaymentItem } from "../molecules/PaymentItem";
import { SubscriptionItem } from "../molecules/SubscriptionItem";


interface PaymentOrganismProps {
  client: { id: string; name: string; email: string; phone: string };
  payments?: PaymentItem[];
  subscriptions?: SubscriptionItem[];
}

export const PaymentOrganism: React.FC<PaymentOrganismProps> = ({
  client,
  payments,
  subscriptions,
}) => {
  const theme = useTheme();

  const [selectedTab, setSelectedTab] = useState(AsaasPaymentStatus.PENDING);

  const [updatedSubscriptions, setUpdatedSubscriptions] = useState<
    SubscriptionItem[]
  >([]);
  const [singlePayments, setSinglePayments] = useState<PaymentItem[]>([]);

  useEffect(() => {
    const updatedSubs: SubscriptionItem[] =
      subscriptions?.map((subscription: SubscriptionItem) => {
        const subPayments: PaymentItem[] =
          payments?.filter(
            (payment: PaymentItem) => payment.subscription === subscription.id
          ) || [];
        subscription.payments = subPayments;
        return subscription;
      }) || [];
    setUpdatedSubscriptions(updatedSubs);

    const filteredPayments: PaymentItem[] =
      payments?.filter((payment) => !payment.subscription) || [];
    setSinglePayments(filteredPayments);
  }, [payments, subscriptions]);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: AsaasPaymentStatus
  ) => {
    setSelectedTab(newValue);
  };

  return (
    <Grid container spacing={0} sx={{ padding: "1rem" }}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Pagamentos de {client.name}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TabContext value={selectedTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="Seleção de tipos de pagamento"
            >
              <Tab label="Avulsos" value={AsaasPaymentStatus.PENDING} />
              <Tab label="Recorrentes" value="SUBSCRIPTIONS" />
            </TabList>
          </Box>
          <TabPanel value={AsaasPaymentStatus.PENDING}>
            {singlePayments && singlePayments.length > 0 ? (
              <Stack
                spacing={{ xs: 1, sm: 2 }}
                direction="row"
                useFlexGap
                flexWrap="wrap"
              >
                {singlePayments.map((item: PaymentItem, index: number) => (
                  <PaymentItem
                    key={`payment-${index}`}
                    theme={theme}
                    payment={item}
                    client={client}
                  />
                ))}
              </Stack>
            ) : (
              <Alert severity="info">
                Não existem pagamentos avulsos para {client.name}
              </Alert>
            )}
          </TabPanel>
          <TabPanel value="SUBSCRIPTIONS">
            {updatedSubscriptions && updatedSubscriptions.length > 0 ? (
              <Stack
                spacing={{ xs: 1, sm: 2 }}
                direction="row"
                useFlexGap
                flexWrap="wrap"
              >
                {updatedSubscriptions.map(
                  (item: SubscriptionItem, index: number) => (
                    <SubscriptionItem
                      key={`subscription-${index}`}
                      theme={theme}
                      subscription={item}
                      payments={item.payments || []}
                      client={client}
                    />
                  )
                )}
              </Stack>
            ) : (
              <Alert severity="info">
                Não existem pagamentos recorrentes para {client.name}
              </Alert>
            )}
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};
