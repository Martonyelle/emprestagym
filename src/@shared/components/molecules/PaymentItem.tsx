import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  IconButton,
  Typography,
  CardActions,
  Button,
  Popover,
  FormControl,
  TextField,
  CircularProgress,
  MenuItem,
  InputLabel,
  Select,
  Chip,
} from "@mui/material";
import {
  AttachMoney as AttachMoneyIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Launch as LaunchIcon,
  Loop as LoopIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import moment from "moment";
import { useSnackbarController } from "firecms";
import { receivePaymentInCash, deletePayment } from "../../../customs/controllers/asaas";
import { SnackbarMessage } from "../../atoms/SnackbarMessage";
import { AsaasBillingType, AsaasPaymentStatus } from "../../enums/asaas";
import PaymentStatusChips from "./PaymentsChipStatus";
import { AsaasPayment } from "../../interface/asaas";
import { openLink } from "../../../helpers/helpers";

export interface PaymentItem extends AsaasPayment {
  subscription?: string;
  paymentDate?: string;
  billingType: AsaasBillingType;
  status: AsaasPaymentStatus;
}

export enum ManualPaymentOptions {
  CASH = "cash",
  PIX = "pix",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  TRANSFER = "transfer",
  OTHER = "other",
}

interface PaymentItemProps {
  client: { name: string; email: string; phone: string };
  payment: PaymentItem;
  theme?: any;
  onPaymentUpdate?: (payment: PaymentItem) => void;
}

export const PaymentItem: React.FC<PaymentItemProps> = ({
  client,
  payment,
  theme = useTheme(),
}) => {
  const snackbarController = useSnackbarController();
  const [anchorOptions, setAnchorOptions] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorRegisterPayment, setAnchorRegisterPayment] =
    React.useState<HTMLButtonElement | null>(null);
  const [registerPaymentLoading, setRegisterPaymentLoading] = useState(false);
  const [errorState, setErrorState] = useState({ value: null });
  const [paymentValue, setPaymentValue] = useState("");
  const [paymentType, setPaymentType] = useState(ManualPaymentOptions.CASH);
  const [paymentNegociation, setPaymentNegociation] = useState("");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const handleOpenInvoice = () => {
    if (payment.invoiceUrl) openLink(payment.invoiceUrl, true);
  };

  const registerPayment = async () => {
    setRegisterPaymentLoading(true);
    const date = new Date();

    try {
      const asaasRes = await receivePaymentInCash(
        payment.id,
        parseFloat(paymentValue),
        date,
        paymentNegociation,
        paymentType,
        true
      );
      if (!asaasRes.success) {
        const errorMsg = asaasRes.error
          ? asaasRes.error.message
          : "Falha ao registrar pagamento";
        throw new Error(errorMsg);
      }
      setReceiptUrl(asaasRes.data.transactionReceiptUrl);

      snackbarController.open({
        type: "success",
        message: (
          <SnackbarMessage
            title={"Pagamento atualizado!"}
            subtitle={
              "O pagamento foi registrado com o valor informado."
            }
          />
        ),
      });
    } catch (error) {
      snackbarController.open({
        type: "error",
        message: (
          <SnackbarMessage
            title={"Falha ao registrar pagamento"}
            subtitle={JSON.stringify(error)}
          />
        ),
      });
    }

    clear();
  };

  const handleDeletePayment = async () => {
    const asaasRes = await deletePayment(`${payment.id}`);
    if (!asaasRes.success) {
      const errorMsg = asaasRes.error
        ? asaasRes.error.message
        : "Falha ao excluir pagamento";
      throw new Error(errorMsg);
    } else {
      snackbarController.open({
        type: "success",
        message: (
          <SnackbarMessage
            title={"Pagamento excluído com sucesso!"}
            subtitle={
              "O pagamento foi excluído do sistema de pagamentos."
            }
          />
        ),
      });
    }
  };

  const clear = () => {
    setRegisterPaymentLoading(false);
    setPaymentValue("");
    setAnchorRegisterPayment(null);
  };

  const actions = [
    {
      disabled: false,
      title: "Excluir",
      icon: <DeleteIcon />,
      showSnackbar: false,
      clickFn: () => handleDeletePayment(),
    },
  ];

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ width: "100%" }} variant="outlined">
        <CardHeader
          action={
            <>
              <IconButton onClick={(e) => setAnchorOptions(e.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
              <Popover
                open={Boolean(anchorOptions)}
                anchorEl={anchorOptions}
                onClose={() => setAnchorOptions(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              >
                {/* Implemente a lista de ações aqui */}
              </Popover>
            </>
          }
          title={
            <>
              {payment.invoiceNumber && (
                <Typography variant="overline" display="block">
                  # {payment.invoiceNumber}
                </Typography>
              )}
              {payment.object === "subscription" && payment.cycle && (
                <Chip
                  size="small"
                  icon={<LoopIcon />}
                  label={payment.cycle}
                />
              )}
              <Typography variant="h4" color="success">
                R$ {payment.value}
              </Typography>
            </>
          }
          subheader={
            <>
              <Typography variant="h6" color="text.primary">
                {payment.description}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Vencimento: {moment(payment.dueDate).format("DD/MM/YYYY")}
              </Typography>
            </>
          }
        />

        <CardContent>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <PaymentStatusChips payment={payment} handleOpenManualInfo={function (event: React.MouseEvent<HTMLElement>): void {
              throw new Error("Function not implemented.");
            } } anchorManualPaymentInfo={null} handleCloseManualInfo={function (): void {
              throw new Error("Function not implemented.");
            } } />
          </Stack>
        </CardContent>
        <CardActions>
          {(payment.status === AsaasPaymentStatus.PENDING ||
            payment.status === AsaasPaymentStatus.OVERDUE) && (
            <Button
              onClick={(e) => setAnchorRegisterPayment(e.currentTarget)}
              disabled={registerPaymentLoading}
              size="small"
              color="success"
            >
              <AttachMoneyIcon sx={{ marginRight: "0.25rem" }} />
              Registrar Pagamento
            </Button>
          )}
          <Button size="small" color="info" onClick={handleOpenInvoice}>
            <LaunchIcon sx={{ marginRight: "0.25rem" }} />
            Ver Fatura
          </Button>
        </CardActions>
        <Popover
          open={Boolean(anchorRegisterPayment)}
          anchorEl={anchorRegisterPayment}
          onClose={() => setAnchorRegisterPayment(null)}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            spacing={2}
            sx={{ margin: "1rem" }}
          >
            <FormControl fullWidth size="small" variant="filled">
              <InputLabel id="payment-type-label">
                Forma de recebimento
              </InputLabel>
              <Select
                labelId="payment-type-label"
                id="payment-type"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as ManualPaymentOptions)}
              >
                <MenuItem value={ManualPaymentOptions.CASH}>Dinheiro</MenuItem>
                <MenuItem value={ManualPaymentOptions.PIX}>PIX</MenuItem>
                <MenuItem value={ManualPaymentOptions.CREDIT_CARD}>
                  Cartão de Crédito
                </MenuItem>
                <MenuItem value={ManualPaymentOptions.DEBIT_CARD}>
                  Cartão de Débito
                </MenuItem>
                <MenuItem value={ManualPaymentOptions.TRANSFER}>
                  Transferência
                </MenuItem>
                <MenuItem value={ManualPaymentOptions.OTHER}>Outros</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" variant="filled">
              <TextField
                required
                id="payment-value"
                label="Valor Recebido"
                type="number"
                disabled={registerPaymentLoading}
                value={paymentValue}
                onChange={(e) => setPaymentValue(e.target.value)}
                error={Boolean(errorState.value)}
                helperText={errorState.value || ""}
              />
            </FormControl>
            <FormControl fullWidth size="small" variant="filled">
              <TextField
                id="negociation"
                label="Negociação"
                type="text"
                disabled={registerPaymentLoading}
                multiline
                rows={3}
                value={paymentNegociation}
                onChange={(e) => setPaymentNegociation(e.target.value)}
              />
            </FormControl>
            <Button
              sx={{ color: theme.palette.success.main }}
              onClick={registerPayment}
              disabled={
                Boolean(errorState.value) ||
                !paymentValue ||
                registerPaymentLoading
              }
            >
              {registerPaymentLoading ? (
                <CircularProgress color="success" size={"2rem"} />
              ) : (
                "Registrar"
              )}
            </Button>
          </Stack>
        </Popover>
      </Card>
    </Grid>
  );
};
