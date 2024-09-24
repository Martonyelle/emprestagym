import { Alert } from "@mui/material";
import { EntityCustomView } from "firecms";
import { PaymentOrganism } from "../../@shared/components/organism/PaymentOrganism";


export const paymentsView: EntityCustomView = {
  path: "payments",
  name: "Pagamentos",
  Builder: ({ entity }) => {
    if (!entity)
      return (
        <Alert severity="warning">
          Selecione um cliente para ver os dados de pagamento
        </Alert>
      );

    const clientData = {
      id: entity.id,
      name: entity.values.name,
      email: entity.values.email,
      phone: entity.values.phone,
    };

    return (
      <PaymentOrganism
        client={clientData}
        payments={entity.values.payments}
        subscriptions={entity.values.subscriptions}
      />
    );
  },
};
