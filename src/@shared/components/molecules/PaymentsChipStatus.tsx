import React from 'react';
import { Chip } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import DoneIcon from '@mui/icons-material/Done';
import UndoIcon from '@mui/icons-material/Undo';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import PendingIcon from '@mui/icons-material/Pending';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { AsaasPaymentStatus, AsaasBillingType } from '../../enums/asaas';
import { ManualPaymentInfo } from './ManualPaymentInfo';

interface PaymentStatusConfig {
  [key: string]: {
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    icon: React.ReactElement;
    label: string;
  };
}

const paymentStatusConfig: PaymentStatusConfig = {
  [AsaasPaymentStatus.OVERDUE]: { color: 'error', icon: <ErrorIcon />, label: 'VENCIDA' },
  [AsaasPaymentStatus.PENDING]: { color: 'warning', icon: <PendingIcon />, label: 'PENDENTE' },
  [AsaasPaymentStatus.REFUND_REQUESTED]: { color: 'warning', icon: <WarningIcon />, label: 'EXTORNO SOLICITADO' },
  [AsaasPaymentStatus.RECEIVED]: { color: 'success', icon: <DoneIcon />, label: 'RECEBIDO' },
  [AsaasPaymentStatus.REFUNDED]: { color: 'success', icon: <UndoIcon />, label: 'EXTORNADO' },
  [AsaasPaymentStatus.CONFIRMED]: { color: 'success', icon: <DoneIcon />, label: 'CONFIRMADO' },
  [AsaasPaymentStatus.RECEIVED_IN_CASH]: { color: 'success', icon: <DoneIcon />, label: 'RECEBIDO MANUAL' },
  [AsaasPaymentStatus.REFUND_IN_PROGRESS]: { color: 'warning', icon: <HourglassBottomIcon />, label: 'EXTORNO EM ANDAMENTO' },
  [AsaasPaymentStatus.CHARGEBACK_REQUESTED]: { color: 'warning', icon: <CurrencyExchangeIcon />, label: 'DISPUTA SOLICITADA' },
  [AsaasPaymentStatus.CHARGEBACK_DISPUTE]: { color: 'warning', icon: <HourglassBottomIcon />, label: 'DISPUTA EM ANDAMENTO' },
  [AsaasPaymentStatus.AWAITING_CHARGEBACK_REVERSAL]: { color: 'success', icon: <DoneIcon />, label: 'RESULTADO DA DISPUTA' },
  [AsaasPaymentStatus.DUNNING_REQUESTED]: { color: 'warning', icon: <CreditCardOffIcon />, label: 'COBRANÇA SOLICITADA' },
  [AsaasPaymentStatus.DUNNING_RECEIVED]: { color: 'success', icon: <DoneIcon />, label: 'COBRANÇA RECEBIDA' },
  [AsaasPaymentStatus.AWAITING_RISK_ANALYSIS]: { color: 'error', icon: <RequestQuoteIcon />, label: 'AGUARDANDO ANÁLISE DE RISCO' },
};

interface BillingTypeConfig {
  [key: string]: {
    icon: React.ReactElement;
    label: string;
  };
}

const billingTypeConfig: BillingTypeConfig = {
  [AsaasBillingType.CREDIT_CARD]: { icon: <CreditCardIcon />, label: 'Cartão' },
  [AsaasBillingType.BOLETO]: { icon: <ReceiptIcon />, label: 'Boleto' },
};

interface PaymentItem {
  status: AsaasPaymentStatus;
  billingType: AsaasBillingType;
  creditCard?: {
    creditCardBrand: string;
    creditCardNumber: string;
  };
  manualPaymentExtras?: any;
}

const getPaymentStatusChips = (
  payment: PaymentItem,
  handleOpenManualInfo: (event: React.MouseEvent<HTMLElement>) => void,
  anchorManualPaymentInfo: HTMLUnknownElement | null,
  handleCloseManualInfo: () => void
) => {
  const chips = [];

  const statusConfig = paymentStatusConfig[payment.status];
  if (statusConfig) {
    if (payment.status === AsaasPaymentStatus.RECEIVED_IN_CASH) {
      chips.push(
        <Chip
          key={payment.status}
          color={statusConfig.color}
          icon={statusConfig.icon}
          label={statusConfig.label}
          onClick={handleOpenManualInfo}
        />
      );
      chips.push(
        <ManualPaymentInfo
          key="manualPaymentInfo"
          anchorEl={anchorManualPaymentInfo}
          manualPaymentExtras={payment.manualPaymentExtras || null}
          onClose={handleCloseManualInfo}
        />
      );
    } else {
      chips.push(
        <Chip
          key={payment.status}
          color={statusConfig.color}
          icon={statusConfig.icon}
          label={statusConfig.label}
        />
      );
    }
  }

  const billingConfig = billingTypeConfig[payment.billingType];
  if (billingConfig) {
    chips.push(
      <Chip
        key={payment.billingType}
        icon={billingConfig.icon}
        label={
          payment.billingType === AsaasBillingType.CREDIT_CARD && payment.creditCard
            ? `${payment.creditCard.creditCardBrand} - ${payment.creditCard.creditCardNumber}`
            : billingConfig.label
        }
      />
    );
  }

  return chips;
};

interface PaymentStatusChipsProps {
  payment: PaymentItem;
  handleOpenManualInfo: (event: React.MouseEvent<HTMLElement>) => void;
  anchorManualPaymentInfo: HTMLUnknownElement | null;
  handleCloseManualInfo: () => void;
}

const PaymentStatusChips: React.FC<PaymentStatusChipsProps> = ({
  payment,
  handleOpenManualInfo,
  anchorManualPaymentInfo,
  handleCloseManualInfo
}) => {
  return (
    <>
      {getPaymentStatusChips(payment, handleOpenManualInfo, anchorManualPaymentInfo, handleCloseManualInfo)}
    </>
  );
};

export default PaymentStatusChips;
