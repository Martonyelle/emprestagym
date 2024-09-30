import React, { useState } from "react";

import { Card, CardHeader, CardContent, Grid, IconButton, Typography, CardActions, Button, Chip, Popover, FormControl, TextField, CircularProgress } from "@mui/material";

import { useTheme } from '@mui/material/styles';
import Stack from "@mui/system/Stack";
import { ButtonList } from "./ButtonList";


//ICONS
import LaunchIcon from '@mui/icons-material/Launch';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LoopIcon from '@mui/icons-material/Loop';
import DoneIcon from '@mui/icons-material/Done';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';


import moment, { Moment } from "moment";
import { toSnakeCase, useSnackbarController } from "firecms";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import { PaymentItem } from "./PaymentItem";
import { DocumentReference } from "firebase/firestore";
import { LocalizationProvider, ptBR, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { getSubscriptionPaybook, deleteAsaasSubscription } from "../../../customs/controllers/asaas";
import { SnackbarMessage } from "../../atoms/SnackbarMessage";
import { AsaasBillingCycle, AsaasPaymentStatus, AsaasBillingType } from "../../enums/asaas";
import { AsaasSubscription } from "../../interface/asaas";
import SubscriptionPaymentsModal from "../modals/SubscriptionPaymentModal";
import { downloadFileFromBase64 } from "../../../helpers/helpers";
import { removeSubscription } from "../../../customs/controllers/client";
import { ActionButtonProps } from "../../interface/components";


export interface SubscriptionItem extends AsaasSubscription {
  insurance?: DocumentReference;
  payments?: PaymentItem[];
}

interface SubscriptionItemProps {
  client: { id: string, name: string, email: string, phone: string };
  subscription: SubscriptionItem;
  payments: PaymentItem[];
  theme?: any;
}

export const SubscriptionItem: React.FC<SubscriptionItemProps> = ({
  client,
  subscription,
  payments,
  theme = useTheme()
}) => {
  const snackbarController = useSnackbarController();
  const emptyErrorState: any = {
    due_date: null
  }

  const [openModal, setOpenModal] = useState(false);
  const [anchorOptions, setAnchorOptions] = React.useState<HTMLButtonElement | null>(null);
  const [anchorPrintInvoice, setAnchorPrintInvoice] = React.useState<HTMLButtonElement | null>(null);
  const [printInvoiceLoading, setPrintInvoiceLoading] = useState(false);
  const [errorState, setErrorState] = useState(emptyErrorState);
  const [invoiceDueDate, setInvoiceDueDate] = useState(moment());

  const getCycleStr = (cycle: AsaasBillingCycle | string) => {
    switch (cycle) {
      case AsaasBillingCycle.WEEKLY:
        return 'Semanal'
      case AsaasBillingCycle.MONTHLY:
        return 'Mensal'
      default:
        break;
    }
  }

  const expandOptions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorOptions(event.currentTarget);
  };

  const expandPrintInvoice = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorPrintInvoice(event.currentTarget)
  }

  const handleCloseOptions = () => {
    setAnchorOptions(null);
  };

  const handleClosePrintInvoice = () => {
    setAnchorPrintInvoice(null);
  };

  const openOptions = Boolean(anchorOptions);
  const popoverOptionsId = openOptions ? 'options-popover' : undefined;

  const openPrintInvoice = Boolean(anchorPrintInvoice);
  const popoverPrintInvoice = openPrintInvoice ? 'options-print-invoice' : undefined;

  const handleOpenBills = () => {
    setOpenModal(true);
  }

  const printInvoice = async () => {
    try {
      setPrintInvoiceLoading(true);
      const month = invoiceDueDate.month();
      const year = invoiceDueDate.year();

      const asaasRes = await getSubscriptionPaybook(subscription.id, month, year);
      if (!asaasRes.success) {
        const errorMsg = asaasRes.error ? asaasRes.error.message : 'Falha fazer download de carnê';
        throw new Error(errorMsg);
      }
      downloadFileFromBase64(asaasRes.data, `carne_${toSnakeCase(client.name)}(${toSnakeCase(subscription.description)}).pdf`);
    } catch (error) {
      snackbarController.open({
        type: 'error',
        message: (
          <SnackbarMessage
            title={'Falha ao gerar carnê'}
            subtitle={JSON.stringify(error)}
          />
        )
      })
    }

    clear();
  }

  const handleDeleteSubscription = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const asaasRes = await deleteAsaasSubscription(`${subscription.id}`);
      if (!asaasRes.success) {
        const errorMsg = asaasRes.error ? asaasRes.error.message : 'Falha ao excluir cobrança recorrente';
        throw new Error(errorMsg);
      } else {
        removeSubscription(client.id, subscription.id);
        snackbarController.open({
          type: 'success',
          message: (
            <SnackbarMessage
              title={'Cobrança excluída com sucesso!'}
              subtitle={'Recebemos a confirmação do provedor de pagamentos de que a cobrança recorrente foi excluida.'}
            />
          )
        });
        return { success: true, message: 'Cobrança excluída com sucesso!' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao excluir cobrança.' };
    }
  }
  

  const clear = () => {
    setPrintInvoiceLoading(false);
    setInvoiceDueDate(moment());
    handleClosePrintInvoice();
  }

  const actions: ActionButtonProps[] = [
    {
      title: 'Excluir',
      icon: <DeleteIcon />,
      showSnackbar: false,
      clickFn: () => handleDeleteSubscription(),
      color: 'inherit',
      data: undefined
    }
  ];


  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ width: '100%' }} variant="outlined" >
        <CardHeader
          // avatar={}
          action={
            <>
              <IconButton onClick={expandOptions} aria-label="opções">
                <MoreVertIcon />
              </IconButton>
              <Popover
                id={popoverOptionsId}
                open={openOptions}
                anchorEl={anchorOptions}
                onClose={handleCloseOptions}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <ButtonList
                  actions={actions}
                />
              </Popover>
            </>
          }
          title={
            <>
              {subscription.invoiceNumber && (
                <Typography variant="overline" display="block">
                  # {subscription.invoiceNumber}
                </Typography>
              )}
              {subscription.cycle && (
                <Chip size="small" icon={<LoopIcon />} label={getCycleStr(subscription.cycle)} />
              )}
              <Typography variant="h4" color="success">
                R$ {subscription.value}
              </Typography>
            </>
          }
          subheader={
            <>
              <Typography variant="h6" color="text.primary">
                {subscription.description}
              </Typography>
            </>
          }
        />
        <CardContent>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {subscription.status === AsaasPaymentStatus.OVERDUE && (
              <Chip color="error" icon={<ErrorIcon />} label="VENCIDA" />
            )}
            {(subscription.status === AsaasPaymentStatus.RECEIVED) && (
              <Chip color="success" icon={<DoneIcon />} label="RECEBIDO" />
            )}
            {(subscription.status === AsaasPaymentStatus.RECEIVED_IN_CASH) && (
              <Chip color="success" icon={<DoneIcon />} label="RECEBIDO MANUAL" />
            )}
            {subscription.status === AsaasPaymentStatus.PENDING && (
              <Chip color="warning" icon={<WarningIcon />} label="PENDENTE" />
            )}

            {subscription.billingType === AsaasBillingType.CREDIT_CARD && (
              <Chip icon={<CreditCardIcon />} label="Cartão" />
            )}
            {subscription.billingType === AsaasBillingType.BOLETO && (
              <Chip icon={<ReceiptIcon />} label="Boleto" />
            )}
          </Stack>
        </CardContent>
        <CardActions >
          {
            subscription.status !== AsaasPaymentStatus.RECEIVED &&
            subscription.status !== AsaasPaymentStatus.RECEIVED_IN_CASH && (
              <Button onClick={handleOpenBills} disabled={printInvoiceLoading} size="small" color="inherit">
                <ReceiptLong sx={{ marginRight: '0.25rem' }} />
                Lista de Cobranças
              </Button>
            )
          }
          {
            subscription.billingType === AsaasBillingType.BOLETO && (
              <Button disabled={false} size="small" color="inherit" onClick={expandPrintInvoice} >
                <PrintIcon sx={{ marginRight: '0.25rem' }} />
                Imprimir Carnê
              </Button>
            )
          }

        </CardActions>
        <Popover
          id={popoverPrintInvoice}
          open={openPrintInvoice}
          anchorEl={anchorPrintInvoice}
          onClose={handleClosePrintInvoice}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >

          <Stack direction="column" justifyContent="center" spacing={2} sx={{ margin: '1rem' }}>
            <Typography variant="caption" >Selecione até quando você quer gerar o carnê para esta assinatura:</Typography>
            <LocalizationProvider
              dateAdapter={AdapterMoment}
              adapterLocale="ptBR"
              localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}>
              <DatePicker
                views={['month']}
                label={'Data Final'}
                value={invoiceDueDate}
                minDate={moment()}
                onChange={(value: Moment | null) => { if (value) setInvoiceDueDate(value) }}
                inputFormat="MM/YYYY"
                renderInput={(params) => <TextField id="due_date" name="due_date" required {...params} helperText={null} />}
              />
            </LocalizationProvider>
            <Button sx={{ color: theme.palette.success.main }} onClick={printInvoice} disabled={errorState.due_date !== null || printInvoiceLoading}>
              {printInvoiceLoading ? (
                <CircularProgress color="success" size={'2rem'} />
              ) : ('Imprimir carnê')}
            </Button>
          </Stack>
        </Popover>
      </Card>
      <SubscriptionPaymentsModal
        subscription={subscription}
        isOpen={openModal}
        closeFn={() => {
          setOpenModal(false);
        }}
        payments={payments}
        client={client}
      />
    </Grid>
  )
}