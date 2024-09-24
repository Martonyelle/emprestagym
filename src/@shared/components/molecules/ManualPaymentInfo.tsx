import * as React from 'react';

import { useTheme } from '@mui/material/styles';
import { ManualPaymentOptions } from './PaymentItem';
import Popover from '@mui/material/Popover';
import { Stack } from '@mui/system';
import { Typography } from '@mui/material';
import moment from 'moment';

export interface ManualPaymentExtras {
    responsible?: { name: string, email: string, phone: string };
    date?: Date;
    negociation?: string;
    type: ManualPaymentOptions
}

interface ManualPaymentInfoProps {
    anchorEl: null | HTMLElement | HTMLUnknownElement,
    manualPaymentExtras: ManualPaymentExtras | null,
    onClose: any,
    theme?: any
}

export const ManualPaymentInfo: React.FC<ManualPaymentInfoProps> = ({
    anchorEl,
    manualPaymentExtras,
    onClose = () => {},
    theme = useTheme()
}) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [id, setId] = React.useState<string | undefined>(undefined);

    const [cachedAnchorEl, setAnchorEl] = React.useState(anchorEl);

    React.useEffect(() => {
        const canBeOpen = Boolean(anchorEl);
        const updatedId = canBeOpen ? 'manual-payment-info' : undefined;

        setId(updatedId);
        setOpen(canBeOpen);
        setAnchorEl(anchorEl);
    }, [anchorEl])

    const getPaymentTypeString = (type: ManualPaymentOptions | undefined) => {
        switch (type) {
            case ManualPaymentOptions.CREDIT_CARD:
                return 'Em Cartão de Crédito';
            case ManualPaymentOptions.DEBIT_CARD:
                return 'Em Cartão de Débito';
            case ManualPaymentOptions.TRANSFER:
                return 'Via Transferência';
            case ManualPaymentOptions.CASH:
                return 'Em Dinheiro';
            case ManualPaymentOptions.PIX:
                return 'Via Pix';
            default:
                return 'Outros';
        }
    }

    const getPaymentResponsibleString = () => {
        if(manualPaymentExtras?.responsible?.name) return `por ${manualPaymentExtras?.responsible?.name}`;
        if(!manualPaymentExtras?.responsible?.name && manualPaymentExtras?.responsible?.email) return `por ${manualPaymentExtras?.responsible?.email}`;
        return '';
    }

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={cachedAnchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >   
            <Stack direction="column" justifyContent="center" spacing={0} sx={{ margin: '1rem' }}>
                <Typography variant="caption" display="block" gutterBottom>
                   {`${moment(manualPaymentExtras?.date).format('DD/MM/YYYY HH:mm')}`}
                </Typography>
                <Typography variant="button" display="block" gutterBottom>
                   {`Recebido ${getPaymentResponsibleString()} ${getPaymentTypeString(manualPaymentExtras?.type)}`}
                </Typography>
                <Typography variant="overline" display="block" gutterBottom>
                   {manualPaymentExtras?.negociation}
                </Typography>
            </Stack>
        </Popover>
    );
}